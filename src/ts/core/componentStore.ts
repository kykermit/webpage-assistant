import BaseComponent from '../component/baseComponent';

type ComponentData = {
    component: BaseComponent;
    element: HTMLElement;
};

const store = new Map<string, Array<ComponentData>>();

/**
 * コンポーネントのインスタンス集約オブジェクト
 */
const componentStore = {

    /**
     * コンポーネントのインスタンスを保持
     * @param name コンポーネント名
     * @param component コンポーネントのインスタンス
     * @param element 機能構築の起点となっているHTML要素
     */
    set (name: string, component: BaseComponent, element: HTMLElement): void {
        if (name === '') {
            return;
        }

        const componentRecords = store.get(name);

        if (componentRecords) {
            componentRecords.push({
                component,
                element
            });
        } else {
            store.set(name, [{
                component,
                element
            }]);
        }
    },

    /**
     * コンポーネントのインスタンスを取得
     * @param name コンポーネント名
     * @param element 機能構築の起点となっているHTML要素
     * @returns コンポーネントのインスタンス
     */
    get <T extends BaseComponent>(name: string, element: HTMLElement): T|null {
        const componentRecords = store.get(name);

        const targetRecords = componentRecords?.filter((componentData) => {
            return componentData.element === element;
        });

        return targetRecords ? targetRecords[0].component as T : null;
    },

    /**
     * コンポーネントのインスタンスリストを取得
     * @param name コンポーネント名
     * @returns コンポーネントのインスタンス配列
     */
    getComponentList <T extends BaseComponent>(name: string): Array<T>|undefined {
        const componentRecords = store.get(name);
        const components = componentRecords?.map<T>((componentData) => {
            return componentData.component as T;
        });

        return components;
    },

    /**
     * コンポーネントのインスタンスを全て削除
     */
    clear (): void {
        store.clear();
    },
};

export default componentStore;
