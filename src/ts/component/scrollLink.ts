import BaseComponent from './baseComponent';
import { pageScroller } from './scroller';

type ConfigType = {
    speed: number;
}
const config: ConfigType = {
    speed: 300
};

/**
 * スムーススクロールリンク
 */
class ScrollLink extends BaseComponent {
    static componentName = 'scrollLink';
    private _element: HTMLElement;
    private _config: ConfigType;
    private _hash: string;

    /**
     * 機能構築
     * @param selector 機能構築の起点となるHTML要素のセレクター
     * @param option 機能拡張オプション
     */
     static create(selector: string, option: Partial<ConfigType> = {}): void {
        document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
            const component = new ScrollLink(element, option);

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
        this._hash = '';

        if (!this._checkPageAnchor()) {
            return;
        }

        this._bindEvent();
    }

    /**
     * 設定を取得する
     * @param option 機能拡張オプション
     */
    private _getConfig(option: Partial<ConfigType>): ConfigType {
        const margeConfig: ConfigType = {
            ...config,
            ...option
        };

        return margeConfig;
    }

    /**
     * ページ内アンカーリンクかどうか判定する
     */
    private _checkPageAnchor(): boolean {
        // a要素以外は対象外
        if (this._element.tagName !== 'A') {
            return false;
        }

        const anchorElment = this._element as HTMLAnchorElement;

        // 現在のページを指していなければ対象外
        if (anchorElment.hostname !== window.location.hostname || anchorElment.pathname !== window.location.pathname) {
            return false;
        }

        this._hash = anchorElment.hash;

        // アンカーリンクでなければ対象外
        if (!this._hash) {
            return false;
        }

        return true;
    }

    /**
     * スクロール先の要素を取得する
     */
    private _getTarget(): HTMLElement | null {
        const element = this._element as HTMLAnchorElement;
        const hash = element.hash;

        if (hash === '#top') {
            return document.documentElement;
        } else {
            return document.getElementById(hash.slice(1));
        }
    }

    /**
     * ブラウザのセッション履歴を記録
     * @param targetHash アンカー
     */
    private _setHistory(targetHash: string): void {
        history.pushState(null, document.title, targetHash);
    }

    /**
     * アンカー押下時の処理
     * @param event イベントオブジェクト
     */
    private _clickHandler(event: MouseEvent): void {
        // 処理対象外：「右クリック」「command/control + クリック」「shift + クリック」
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
            return;
        }

        this.scroll(event);
    }

    /**
     * イベント登録
     */
    private _bindEvent(): void {
        this._element.addEventListener('click', this._clickHandler.bind(this));
    }

    /**
     * スクロール
     * @param event イベントオブジェクト
     */
    scroll(event?: MouseEvent): void {
        const target = this._getTarget();

        if (!target) {
            return;
        }

        event?.preventDefault();

        this._setHistory(this._hash);
        pageScroller.scroll(target, this._config.speed);
    }
}

export default ScrollLink;
