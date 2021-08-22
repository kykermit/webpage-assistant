import BaseComponent from './baseComponent';
import { setStyle } from '../utility';

const CLASS_NAME_ACTIVE = 'is-alert-toast-active';
const CLASS_NAME_HIDE = 'is-alert-toast-hide';

type ConfigType = {
    alertItemSelector: string,
    wrapClassName: string,
    logoClassName: string,
    contentClassName: string,
    titleClassName: string,
    textClassName: string,
};

const config: ConfigType = {
    alertItemSelector: '.alert-toast',
    wrapClassName: 'alert-toast-wrap',
    logoClassName: 'alert-toast_logo',
    contentClassName: 'alert-toast_content',
    titleClassName: 'alert-toast_title',
    textClassName: 'alert-toast_text',
};

/**
 * アラート表示
 */
class AlertToast extends BaseComponent {
    static componentName = 'alertToast';
    private _template: HTMLElement;
    private _wrap: HTMLElement;
    private _config: ConfigType;
    private _alertSet: Set<HTMLElement>;

    /**
     * 機能構築
     * @param selector 機能を構築する対象セレクター
     * @param option 機能拡張オプション
     */
    static create(selector: string, option: Partial<ConfigType> = {}): void {
        document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
            const component = new AlertToast(element, option);

            component.setStore(element);
        });
    }

    /**
     * @param element 機能構築の起点となるHTML要素
     * @param option 機能拡張オプション
     */
    constructor(element: HTMLElement, option: Partial<ConfigType>) {
        super();
        this._template = element;
        this._wrap = document.createElement('div');
        this._config = this._getConfig(option);
        this._alertSet = new Set();

        if (!('content' in element)) {
            return;
        }

        this._setDefault();
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
     * 初期設定
     */
    private _setDefault(): void {
        this._wrap?.classList.add(this._config.wrapClassName);
    }

    /**
     * toastの非表示アニメーション終了時の処理
     */
    private _transitionEndHandler(event: TransitionEvent): void {
        if (event.propertyName !== 'opacity') {
            return;
        }

        (event.target as HTMLElement).remove();
    }

    /**
     * イベント登録
     */
    private _bindEvent(): void {
        this._wrap.addEventListener('transitionend', this._transitionEndHandler);
    }

    /**
     * アラートメッセージを包括している要素の追加/削除
     */
    private _applyVisibleContent(): void {
         if (this._alertSet.size === 0) {
             this._wrap.remove();
         } else {
            document.body.appendChild(this._wrap);
         }
    }

    /**
     * アラートメッセージの要素構築
     * @param message アラートメッセージ
     * @param title アラートメッセージのタイトル
     * @param imageUrl アイコン画像のURL
     * @returns アラートメッセージのHTML要素
     */
    private _buildAlertElement(message: string, title?: string, imageUrl?: string): HTMLElement|null {
        // templage要素以外は処理しない
        if (!('content' in this._template)) {
            return null;
        }

        const toast = (this._template as HTMLTemplateElement).content.cloneNode(true);
        const alert = (toast as HTMLElement).querySelector<HTMLElement>(this._config.alertItemSelector);

        if (!alert) {
            return null;
        }

        alert.setAttribute('role', 'alert');

        this._wrap.appendChild(toast);
        this._alertSet.add(alert);

        // logo
        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;

            img.classList.add(this._config.logoClassName);
            alert.appendChild(img);
        }

        // content
        const content = document.createElement('div');

        content.classList.add(this._config.contentClassName);
        alert.appendChild(content);

        // title
        if (title) {
            const titleElement = document.createElement('span');
            titleElement.innerText = title;

            titleElement.classList.add(this._config.titleClassName);
            content.appendChild(titleElement);
        }

        // text
        const text = document.createElement('span');
        text.innerText = message;

        text.classList.add(this._config.textClassName);
        content.appendChild(text);

        return alert;
    }

    /**
     * 要素構築
     * @param message アラートメッセージ
     * @param title アラートメッセージのタイトル
     * @param imageUrl アイコン画像のURL
     */
    alert(message: string, title?: string, imageUrl?: string): void {
        const alert = this._buildAlertElement(`"${message}"`, title, imageUrl);

        if (!alert) {
            return;
        }

        // アラート表示
        this._applyVisibleContent();
        setTimeout(() => {
            alert?.classList.add(CLASS_NAME_ACTIVE);
        }, 100);

        // アラート非表示
        setTimeout(() => {
            alert?.classList.add(CLASS_NAME_HIDE);
            setStyle(alert, {
                'margin-top': `-${alert?.clientHeight}px`,
                'margin-bottom': '0',
            });
            this._alertSet.delete(alert);

            this._applyVisibleContent();
        }, 4000);
    }
}

export default AlertToast;
