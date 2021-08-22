type HundlerType = <T extends Event>(event?: T) => void;
type eventNameType = 'onScroll' | 'onResize';
type closureType = (callback: () => void) => void;

const store = new Map<eventNameType, Array<HundlerType>>();

const throttle = ((): closureType => {
    let timeoutId = 0;
    const delay = 80; // 60fps * 5

    return (callback) => {
        if (timeoutId === 0) {
            timeoutId = window.setTimeout(() => {
                callback();
                timeoutId = 0; // reset
            }, delay);
        }
    };
})();

const debounce = ((): closureType => {
    let timeoutId = 0;
    const delay = 80; // 60fps * 5

    return (callback) => {
        clearTimeout(timeoutId);

        timeoutId = window.setTimeout(() => {
            callback();
        }, delay);
    };
})();

/**
 * イベント制御用のオブザーバー
 */
const eventObserver = {
    /**
     * イベント登録
     * @param eventName イベント名
     * @param handler イベントハンドラ
     */
    on(eventName: eventNameType, handler: HundlerType): void {
        const handlerRecords = store.get(eventName);

        if (handlerRecords) {
            handlerRecords.push(handler);
        } else {
            store.set(eventName, [handler]);
        }
    },

    /**
     * イベントの実行
     * @param eventName イベント名
     */
    emit<T extends Event>(eventName: eventNameType, event?: T): void {
        const handlerRecords = store.get(eventName);

        handlerRecords?.forEach((handler) => {
            handler(event);
        })
    }
};

window.addEventListener('scroll', (event) => {
    throttle(() => {
        eventObserver.emit('onScroll', event);
    });
}, { passive: true });

window.addEventListener('resize', () => {
    debounce(() => {
        eventObserver.emit('onResize');
    });
}, { passive: true });

export default eventObserver;
