import BaseComponent from './baseComponent';
import actionMap, { ActionInterface } from '../core/actionMap';
import { easeInOutQuad } from '../utility/easing';
import { SCROLL_SPEED } from '../core/config';

/**
 * スクロール操作
 */
class Scroller extends BaseComponent {
    static componentName = 'scroller';
    private _target: HTMLElement|null;
    private _startPosition: number;
    private _endPosition: number;
    private _distance: number;
    private _startTimestamp: number;
    private _timeLapse: number;
    private _animationInterval: number;
    private _speed: number;

    constructor() {
        super();
        this._target = null;
        this._startPosition = 0;
        this._endPosition = 0;
        this._distance = 0;
        this._startTimestamp = 0;
        this._timeLapse = 0;
        this._animationInterval = 0;
        this._speed = 0;
    }

    /**
     * スクロール先へフォーカスを移動
     */
    private _adjustFocus(): void {
        if (this._target) {
            this._target.focus();

            if (document.activeElement !== this._target) {
                this._target.tabIndex = -1;
                this._target.focus();
                this._target.removeAttribute('tabindex');
            }
        }
    }

    /**
     * スクロールを停止する
     * @param position スクロールの現在地
     */
    private _stopAnimateScroll(position: number): void {
        const documentHeight = document.documentElement.scrollHeight;
        const currentLocation = window.scrollY;

        // 終了位置（ターゲットの位置 or ドキュメントの最後）に到達している場合
        if (position === this._endPosition ||
            currentLocation === this._endPosition ||
            ((this._startPosition < this._endPosition && window.innerHeight + currentLocation) >= documentHeight)) {

            // スクロール終了
            window.cancelAnimationFrame(this._animationInterval);
            this._adjustFocus();

            // リセット
            this._startTimestamp = 0;
            this._animationInterval = 0;
        }
    }

    /**
     * スクロールアニメーション
     * @param timestamp 経過時間
     */
    private _loopAnimateScroll(timestamp: DOMHighResTimeStamp): void {
        if (!this._startTimestamp) {
            this._startTimestamp = timestamp;
        }

        // 経過時間の加算
        this._timeLapse += timestamp - this._startTimestamp;

        // 経過時間から位置算出
        const percentage = Math.min(1, (this._timeLapse / this._speed));
        const position = this._startPosition + (this._distance * easeInOutQuad(percentage));

        // スクロール位置の更新
        window.scrollTo(0, Math.floor(position));

        this._stopAnimateScroll(position);

        // 終了判定でなければ処理継続
        if (this._startTimestamp) {
            this._startTimestamp = timestamp;
            this._animationInterval = requestAnimationFrame(this._loopAnimateScroll.bind(this));
        }
    }

    /**
     * スクロールする
     * @param target スクロール先の要素
     * @param speed スクロールスピード
     */
    scroll(target: HTMLElement|number, speed: number = SCROLL_SPEED): void {
        // スクロール中であれば処理しない
        if (this._animationInterval) {
            return;
        }

        if (typeof target === 'number') {
            this._target = null;
            this._endPosition = target;
        } else {
            const stickyHeader = document.querySelector('.l-header');
            const headerHeight = stickyHeader?.clientHeight || 0;

            this._target = target;
            this._endPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        }

        this._startPosition = window.scrollY;
        this._distance = this._endPosition - this._startPosition;
        this._timeLapse = 0;
        this._speed = speed;

        // prefers-reduced-motion が設定されている場合、アニメーションなし
        if (window.matchMedia('(prefers-reduced-motion)').matches) {
            window.scrollTo(0, Math.floor(this._endPosition));

            return;
        }

        requestAnimationFrame(this._loopAnimateScroll.bind(this));
    }
}

const pageScroller = new Scroller();

class actionTop implements ActionInterface {
    componentName: string;
    commands: Array<string>;
    isSuccess: boolean;

    constructor() {
        this.componentName = Scroller.componentName;
        this.commands = ['top'];
        this.isSuccess = false;
    }

    getActionMessage(): string {
        return this.isSuccess ? 'Scroll to top' : '';
    }

    getReplyMessage(): string {
        return this.isSuccess ? 'ページ最上部までスクロールしました。' : '既にページ最上部までスクロールしています。';
    }

    action(): void {
        this.isSuccess = window.scrollY > 0;

        if (this.isSuccess) {
            pageScroller.scroll(0);
        }
    }
}

class actionUp implements ActionInterface {
    componentName: string;
    commands: Array<string>;
    isSuccess: boolean;

    constructor() {
        this.componentName = Scroller.componentName;
        this.commands = ['up'];
        this.isSuccess = false;
    }

    getActionMessage(): string {
        return this.isSuccess ? 'Scroll up' : '';
    }

    getReplyMessage(): string {
        return this.isSuccess ? '上にスクロールしました。' : 'これ以上は上にスクロールできません。';
    }

    action(): void {
        this.isSuccess = window.scrollY > 0;

        if (this.isSuccess) {
            const targetPosition = Math.max(window.scrollY - 300, 0);

            pageScroller.scroll(targetPosition);
        }
    }
}

class actionDown implements ActionInterface {
    componentName: string;
    commands: Array<string>;
    isSuccess: boolean;

    constructor() {
        this.componentName = Scroller.componentName;
        this.commands = ['down'];
        this.isSuccess = false;
    }

    getActionMessage(): string {
        return this.isSuccess ? 'Scroll down' : '';
    }

    getReplyMessage(): string {
        return this.isSuccess ? '下にスクロールしました。' : 'これ以上は下にスクロールできません。';
    }

    action(): void {
        this.isSuccess = (window.innerHeight + window.scrollY) < document.documentElement.scrollHeight;

        if (this.isSuccess) {
            const targetPosition = Math.max(window.scrollY + 300, 0);

            pageScroller.scroll(targetPosition);
        }
    }
}

actionMap.set(new actionTop());
actionMap.set(new actionUp());
actionMap.set(new actionDown());

export default Scroller;
export {
    pageScroller,
}
