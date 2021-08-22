import { getFixtureElement, clearFixtureElement } from './helper/fixture';
import BaseComponent from '../component/baseComponent';
import componentStore from '../core/componentStore';

class testComponent extends BaseComponent {}

describe('componentStore', () => {
    const TEST_NAME = 'test';
    const COMPONENT_1 = new testComponent();
    const COMPONENT_2 = new testComponent();
    let fixture: HTMLElement;

    beforeAll(() => {
        fixture = getFixtureElement();
    });

    afterEach(() => {
        clearFixtureElement();
    });

    afterEach(() => {
        componentStore.clear();
    });

    it('コンポーネント名が空文字ではレコードの登録はできない', () => {
        componentStore.set('', COMPONENT_1, fixture);

        const value = componentStore.get('', fixture);

        expect(value).toBeNull();
    });

    it('コンポーネント名とHTMLElementで登録されているインスタンスを取得できる', () => {
        componentStore.set(TEST_NAME, COMPONENT_1, fixture);

        const value = componentStore.get(TEST_NAME, fixture);

        expect(value).toBe(COMPONENT_1);
    });

    it('コンポーネント名で登録されているインスタンス配列を取得できる', () => {
        componentStore.set(TEST_NAME, COMPONENT_1, fixture);
        componentStore.set(TEST_NAME, COMPONENT_2, fixture);

        const value = componentStore.getComponentList(TEST_NAME);

        expect(value).toEqual([COMPONENT_1, COMPONENT_2]);
    });
});
