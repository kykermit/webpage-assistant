import componentStore from '../core/componentStore';

/**
 * Webpage assistantコンポーネント
 */
abstract class BaseComponent {
    static componentName: string;

    /**
     * 継承先のstaticメンバーを取得
     */
    get static(): typeof BaseComponent {
        return this.constructor as typeof BaseComponent;
    }

    /**
     * Storeにインスタンスを格納する
     * @param element 機能構築の起点となっているHTML要素
     */
    setStore(element: HTMLElement): void {
        componentStore.set(this.static.componentName, this, element);
    }
}

export default BaseComponent;
