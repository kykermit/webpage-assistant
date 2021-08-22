import componentStore from './componentStore';
import actionMap from './actionMap';
import AlertToast from '../component/alertToast';

const FAILED_MESSAGE = 'アクションの実行に失敗しました。';
const alertElement = document.getElementById('assistant-alert');

/**
 * APIとの連携
 */
const assistant = {
    /**
     * WebSocket接続
     * @param url 接続先URL
     */
    connect (url: string): void {
        const ws = new WebSocket(url);

        ws.addEventListener('open', this.openHandler);
        ws.addEventListener('message', this.messageHandler);
        ws.addEventListener('error', this.errorHandler);
        ws.addEventListener('close', this.closeHandler.bind(this, url));
    },

    /**
     * WebSocket接続完了時の処理
     */
    openHandler (): void {
        console.log('connected');
    },

    /**
     * WebSocketからデータ受信時の処理
     * @param event イベントオブジェクト
     */
    messageHandler (this: WebSocket, event: MessageEvent<string>): void {
        const parseData = JSON.parse(event.data);
        const { text, id, imageUrl } = parseData;
        const actionStrategy = actionMap.get(text);
        let actionMessage = '';
        let replyMessage = '';

        if (actionStrategy) {
            const components =
            componentStore.getComponentList(actionStrategy.componentName);

            if (components?.length) {
                components.forEach((component) => {
                    actionStrategy.action(component);
                });
            } else {
                actionStrategy.action();
            }

            actionMessage = actionStrategy.getActionMessage();
            replyMessage = actionStrategy.getReplyMessage();
        }

        if (alertElement && actionMessage) {
            const alertComponent =
            componentStore.get<AlertToast>(AlertToast.componentName, alertElement);

            alertComponent?.alert(actionMessage, 'Assistant action', imageUrl);
        }

        if (!replyMessage) {
            replyMessage = FAILED_MESSAGE;
        }

        this.send(JSON.stringify({
            replyMessage,
            id,
        }));
    },

    /**
     * WebSocket接続エラー時の処理
     */
    errorHandler (event: Event): void {
        console.error('WebSocket error observed:', event);
    },

    /**
     * WebSocket接続終了時の処理
     * @param url 再接続先URL
     */
    closeHandler (url: string): void {
        console.log('disconnected');

        this.connect(url);
    }
};

export default assistant;
