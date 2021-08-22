import BaseComponent from '../component/baseComponent';

interface ActionInterface {
    componentName: string;
    commands: Array<string>;
    isSuccess: boolean;
    getActionMessage (): string;
    getReplyMessage (): string;
    action (component?: BaseComponent): void;
}

const map = new Map<string, ActionInterface>();

/**
 * Assistantアクションの対応表
 */
const actionMap = {

    /**
     * コマンドに対するアクションデータを格納する
     * @param action Assistantのアクションに関するデータ
     */
    set (action: ActionInterface): void {
        for (const command of action.commands) {
            map.set(command, action);
        }
    },

    /**
     * コマンドに対するアクションデータを取得する
     * @param command コマンドメッセージ
     * @returns コマンドに対するアクションデータ
     */
    get (command: string): ActionInterface|undefined {
        return map.get(command);
    },

    /**
     * コマンド一覧を取得する
     * @returns コマンド一覧
     */
    getCommands (): Array<string> {
        return Array.from(map.keys());
    },

    /**
     * アクションデータを全て削除
     */
     clear (): void {
        map.clear();
    },
}

export default actionMap;
export {
    ActionInterface,
}
