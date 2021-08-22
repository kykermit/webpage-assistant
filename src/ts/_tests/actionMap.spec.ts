import actionMap, { ActionInterface } from '../core/actionMap';

const TEST_KEYWORDS = ['aaa', 'bbb', 'ccc'];

class ActionTest implements ActionInterface {
    componentName: string;
    commands: Array<string>;
    isSuccess: boolean;

    constructor () {
        this.componentName = '';
        this.commands = TEST_KEYWORDS;
        this.isSuccess = false;
    }

    getActionMessage () {
        return ''
    }

    getReplyMessage () {
        return '';
    }

    action () {
        return;
    }
}

const actionTest = new ActionTest();

describe('actionMap', () => {

    afterEach(() => {
        actionMap.clear();
    });

    it('登録したコマンドに対するアクションデータを取得できる', () => {
        actionMap.set(actionTest);

        const [keyword1, keyword2, keyword3] = TEST_KEYWORDS;

        const value1 = actionMap.get(keyword1);
        const value2 = actionMap.get(keyword2);
        const value3 = actionMap.get(keyword3);

        expect(value1).toBe(actionTest);
        expect(value2).toBe(actionTest);
        expect(value3).toBe(actionTest);
    });

    it('登録していないコマンドではundefinedが返される', () => {
        const value = actionMap.get('dummy');

        expect(value).toBeUndefined();
    });

    it('登録したコマンド一覧の配列が取得できる', () => {
        actionMap.set(actionTest);

        const value = actionMap.getCommands();

        expect(value).toEqual(TEST_KEYWORDS);
    });
});
