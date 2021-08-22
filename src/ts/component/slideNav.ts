import BaseComponent from './baseComponent';
import actionMap, { ActionInterface } from '../core/actionMap';
import { mediaQuery } from '../core/core';
import { toBoolAttribute, setStyle, removeStyle, removeHeightStyle, removeWidthStyle, heightGrowTransition, heightShrinkTransition, widthGrowTransition, widthShrinkTransition } from '../utility/index';

const CLASS_NAME_SHOW = 'is-slide-nav-show';
const CLASS_NAME_TRANSITION = 'is-slide-nav-transition';
const CONTROL_TEXT_OPEN = 'ナビゲーションを開く';
const CONTROL_TEXT_CLOSE = 'ナビゲーションを閉じる';

type SlideDirectionType = '' | 'vertical' | 'horizontal';
type ConfigType = {
    [P in 'slideDirectionNarrow' | 'slideDirectionWide']: SlideDirectionType;
} & {
    textSelector: string;
    stickySelector: string;
};

const config: ConfigType = {
    slideDirectionNarrow: 'vertical',
    slideDirectionWide: 'horizontal',
    textSelector: '.js-slide-nav_text',
    stickySelector: '.js-slide-nav_sticky',
};

/**
 * スライドナビゲーション
 */
class SlideNav extends BaseComponent {
    static componentName = 'slideNav';
    private _element: HTMLElement;
    private _config: ConfigType;
    private _content: HTMLElement|null;
    private _controlText: HTMLElement|null;
    private _stickyContent: HTMLElement|undefined|null;
    private _isTransition: boolean;

    /**
     * 機能構築
     * @param selector 機能を構築する対象セレクター
     * @param option 機能拡張オプション
     */
     static create(selector: string, option: Partial<ConfigType> = {}): void {
        document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
            const component = new SlideNav(element, option);

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
        this._content = this._getConetntElement();
        this._controlText = element.querySelector(this._config.textSelector);
        this._stickyContent = this._content?.querySelector(this._config.stickySelector);
        this._isTransition = false;

        if (!this._content) {
            return;
        }

        this._setDefault();
        this._bindEvent();
    }

    /**
     * スライドする方向
     */
    private get _slideDirection(): SlideDirectionType {
        return mediaQuery.matches ? this._config.slideDirectionWide : this._config.slideDirectionNarrow;
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
     * 開閉コンテンツの要素を取得する
     * @returns 開閉コンテンツのHTML要素
     */
    private _getConetntElement(): HTMLElement|null {
        const id = this._element.getAttribute('aria-controls');

        return id ? document.getElementById(id) : null;
    }

    /**
     * 初期設定
     */
    private _setDefault(): void {
        this._element.setAttribute('aria-expanded', 'false');
    }

    /**
     * 開閉後のプロパティや属性値を反映
     */
    private _applyEndState(): void {
        if (!this.isOpen) {
            this._content?.classList.remove(CLASS_NAME_SHOW);
        }

        if (this._slideDirection === 'vertical') {
            removeHeightStyle(this._content);
        } else if (this._slideDirection === 'horizontal') {
            removeWidthStyle(this._content);
        }

        this._isTransition = false;
        this._content?.classList.remove(CLASS_NAME_TRANSITION);
    }

    /**
     * ボタン押下時の処理
     */
    private _clickHandler(event: MouseEvent): void {
        event.preventDefault();
        this.toggle();
    }

    /**
     * 開閉トランジションが完了したときの処理
     */
    private _transitionEndHandler(event: TransitionEvent): void {
        if (event.target !== this._content || !(event.propertyName === 'height' || event.propertyName === 'width')) {
            return;
        }

        this._applyEndState();
    }

    /**
     * イベント登録
     */
    private _bindEvent(): void {
        this._element.addEventListener('click', this._clickHandler.bind(this));
        this._content?.addEventListener('transitionend', this._transitionEndHandler.bind(this));
    }

    /**
     * 開閉状態
     */
    get isOpen(): boolean {
        return toBoolAttribute(this._element, 'aria-expanded');
    }

    /**
     * コンテンツ開閉
     */
    toggle(): void {
        this[this.isOpen ? 'hide' : 'show']();
    }

    /**
     * コンテンツを開く
     */
    show(): void {
        if (this._content === null || this._isTransition) {
            return;
        }

        this.removeStickyPosition();

        this._isTransition = true;
        this._content.classList.add(CLASS_NAME_TRANSITION);

        // アニメーション
        if (this._slideDirection === 'vertical') {
            heightGrowTransition(this._content, CLASS_NAME_SHOW);
        } else if (this._slideDirection === 'horizontal') {
            widthGrowTransition(this._content, CLASS_NAME_SHOW);
        }

        // aria-*属性操作
        this._element.setAttribute('aria-expanded', 'true');

        if (this._controlText) {
            this._controlText.innerText = CONTROL_TEXT_CLOSE;
        }

        this._element.focus();
    }

    /**
     * コンテンツを閉じる
     */
    hide(): void {
        if (this._content === null || this._isTransition) {
            return;
        }

        this.setStickyPosition();

        this._isTransition = true;
        this._content.classList.add(CLASS_NAME_TRANSITION);

        // アニメーション
        if (this._slideDirection === 'vertical') {
            heightShrinkTransition(this._content);
        } else if (this._slideDirection === 'horizontal') {
            widthShrinkTransition(this._content);
        }

        // aria-*属性操作
        this._element.setAttribute('aria-expanded', 'false');

        if (this._controlText) {
            this._controlText.innerText = CONTROL_TEXT_OPEN;
        }
    }

    /**
     * 位置調整
     */
    setStickyPosition(): void {
        if (!this._stickyContent || this._isTransition || !mediaQuery.matches) {
            return;
        }

        setStyle(this._stickyContent, {
            top: `${window.scrollY}px`,
            transform: 'none',
        });
    }

    /**
     * 位置調整のスタイル削除
     */
    removeStickyPosition(): void {
        if (!this._stickyContent) {
            return;
        }

        removeStyle(this._stickyContent, ['top', 'transform']);
    }
}

class actionOpen implements ActionInterface {
    componentName: string;
    commands: Array<string>;
    isSuccess: boolean;

    constructor() {
        this.componentName = SlideNav.componentName;
        this.commands = ['open'];
        this.isSuccess = false;
    }

    getActionMessage(): string {
        return this.isSuccess ? 'Open the navigation' : '';
    }

    getReplyMessage(): string {
        return this.isSuccess ? 'ナビゲーションを開きました。' : '既にナビゲーションが開いています。';
    }

    action(component: SlideNav): void {
        this.isSuccess = !component.isOpen;

        if (this.isSuccess) {
            component.show();
        }
    }
}

class actionClose implements ActionInterface {
    componentName: string;
    commands: Array<string>;
    isSuccess: boolean;

    constructor() {
        this.componentName = SlideNav.componentName;
        this.commands = ['close'];
        this.isSuccess = false;
    }

    getActionMessage(): string {
        return this.isSuccess ? 'Close the navigation' : '';
    }

    getReplyMessage(): string {
        return this.isSuccess ? 'ナビゲーションを閉じました。' : '既にナビゲーションが閉じています。';
    }

    action(component: SlideNav): void {
        this.isSuccess = component.isOpen;

        if (this.isSuccess) {
            component.hide();
        }
    }
}

actionMap.set(new actionOpen());
actionMap.set(new actionClose());

export default SlideNav;
