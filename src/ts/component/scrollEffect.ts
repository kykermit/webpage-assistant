import BaseComponent from './baseComponent';
import eventObserver from "../core/eventObserver";

const CLASS_NAME_ACTIVE = 'is-effect-actvie';

type ConfigType = {
    hookPositionId: string;
}
const config: ConfigType = {
    hookPositionId: 'top',
};


/**
 * スクロールエフェクト
 */
class ScrollEffect extends BaseComponent {
    static componentName = 'scrollEffect';
    private _element: HTMLElement;
    private _config: ConfigType;

    /**
     * 機能構築
     * @param selector 機能を構築する対象セレクター
     * @param option 機能拡張オプション
     */
     static create(selector: string, option: Partial<ConfigType> = {}): void {
        document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
            const component = new ScrollEffect(element, option);

            component.setStore(element);
        });
    }

    /**
     * @param element 機能構築の起点となるHTML要素
     * @param option 機能拡張オプション
     */
    constructor(element: HTMLElement, option: Partial<ConfigType>) {
        super();
        this._element = element;
        this._config = this._getConfig(option);

        this._bindEvent();
    }

    /**
     * 設定を取得する
     * @param option 機能拡張オプション
     * @returns デフォルト値とマージしたオプション
     */
    private _getConfig(option: Partial<ConfigType>): ConfigType {
        const margeConfig: ConfigType = {
            ...config,
            ...option
        };

        return margeConfig;
    }

    /**
     * スクロール時の処理
     */
    private _scrollHandler(): void {
        if (window.scrollY === 0) {
            this.removeEffect();
        } else {
            this.setEffect();
        }
    }

    /**
     * Intersection observerのイベントリスナー
     */
    private _intersectionListener(): void {
        const targetPosition = document.getElementById(this._config.hookPositionId);

        if (!targetPosition) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    this.removeEffect();
                } else {
                    this.setEffect();
                }
            });
        }, {
            threshold: 0
        });

        observer.observe(targetPosition);
    }

    /**
     * イベント登録
     */
    private _bindEvent(): void {
        if (this._config.hookPositionId === 'top') {
            eventObserver.on('onScroll', this._scrollHandler.bind(this));
        } else {
            this._intersectionListener();
        }
    }

    /**
     * エフェクトの設定
     */
    setEffect(): void {
        this._element.classList.add(CLASS_NAME_ACTIVE);
    }

    /**
     * エフェクトの解除
     */
    removeEffect(): void {
        this._element.classList.remove(CLASS_NAME_ACTIVE);
    }
}

export default ScrollEffect;
