/**
 * 属性値の'true'をboolean型で返す
 * 'true'以外の文字列はすべてfalseとなる
 * @param element 対象要素
 * @param attribute 対象属性
 */
const toBoolAttribute = (element: Element, attribute: string): boolean => {
    const bool = element.getAttribute(attribute);

    if (!bool) {
        return false;
    }

    return bool.toLowerCase() === 'true';
};

/**
 * 強制リフロー
 * @param element 対象要素
 */
const reflow = (element: HTMLElement): void => {
    element.offsetHeight;
};

/**
 * スタイルの設定
 * @example
 * ```
 * setStyle(this._content, 'height', '100px');
 * ```
 * ```
 * setStyle(this._content, {
 *     'height', '100px'
 * });
 * ```
 * @param element 対象要素
 * @param style CSSプロパティまたはプロパティと値のオブジェクト
 * @param value CSSプロパティの値
 */
const setStyle = <T>(element: HTMLElement|null, style: string|T, value?: string): void => {
    if (!element) {
        return;
    }

    if (typeof style === 'string') {
        value && element.style.setProperty(style, value);
    } else {
        Object.entries(style).forEach(([property, value]) => {
            element.style.setProperty(property, value);
        });
    }
};

/**
 * スタイルの削除
 * @example
 * ```
 * setStyle(this._content, 'height');
 * ```
 * ```
 * setStyle(this._content, ['height', 'width']);
 * ```
 * @param element 対象要素
 * @param style CSSプロパティまたはプロパティの配列
 */
const removeStyle = (element: HTMLElement|null, style: string|string[]): void => {
    if (!element) {
        return;
    }

    if (typeof style === 'string') {
        element.style.removeProperty(style);
    } else {
        style.forEach((property) => {
            element.style.removeProperty(property);
        });
    }
};

/**
 * 高さ関連のCSSプロパティに設定されていた値をリセット
 * @param element 対象要素
 */
const removeHeightStyle = (element: HTMLElement|null): void => {
    if (!element) {
        return;
    }

    removeStyle(element, 'height');
    removeStyle(element, 'padding-top');
    removeStyle(element, 'padding-bottom');
}

/**
 * 幅関連のCSSプロパティに設定されていた値をリセット
 * @param element 対象要素
 */
 const removeWidthStyle = (element: HTMLElement|null): void => {
    if (!element) {
        return;
    }

    removeStyle(element, 'width');
    removeStyle(element, 'padding-left');
    removeStyle(element, 'padding-right');
}

/**
 * 高さを0からデフォルト値まで遷移させる
 * @param element 対象要素
 * @param showClassName 表示用のclass属性値
 */
const heightGrowTransition = (element: HTMLElement, showClassName: string): void => {
    // height、paddingの初期値
    setStyle(element, 'height', '0');
    setStyle(element, 'padding-top', '0');
    setStyle(element, 'padding-bottom', '0');

    element.classList.add(showClassName);

    // リフロー
    reflow(element);

    // 値設定
    setStyle(element, 'height', `${element.scrollHeight}px`);
    removeStyle(element, 'padding-top');
    removeStyle(element, 'padding-bottom');
};

/**
 * 高さをデフォルト値から0まで遷移させる
 * @param element 対象要素
 */
const heightShrinkTransition = (element: HTMLElement): void => {
    // heightの初期値
    setStyle(element, 'height', `${element.scrollHeight}px`);

    // リフロー
    reflow(element);

    // 値設定
    setStyle(element, 'height', '0');
    setStyle(element, 'padding-top', '0');
    setStyle(element, 'padding-bottom', '0');
};

/**
 * 幅を0からデフォルト値まで遷移させる
 * @param element 対象要素
 * @param showClassName 表示用のclass属性値
 */
 const widthGrowTransition = (element: HTMLElement, showClassName: string): void => {
    // width、paddingの初期値
    setStyle(element, 'width', '0');
    setStyle(element, 'padding-left', '0');
    setStyle(element, 'padding-right', '0');

    element.classList.add(showClassName);

    // リフロー
    reflow(element);

    // 値設定
    setStyle(element, 'width', `${element.scrollWidth}px`);
    removeStyle(element, 'padding-left');
    removeStyle(element, 'padding-right');
};

/**
 * 幅をデフォルト値から0まで遷移させる
 * @param element 対象要素
 */
const widthShrinkTransition = (element: HTMLElement): void => {
    // widthの初期値
    setStyle(element, 'width', `${element.scrollWidth}px`);

    // リフロー
    reflow(element);

    // 値設定
    setStyle(element, 'width', '0');
    setStyle(element, 'padding-left', '0');
    setStyle(element, 'padding-right', '0');
};

export {
    toBoolAttribute,
    reflow,
    setStyle,
    removeStyle,
    removeHeightStyle,
    removeWidthStyle,
    heightGrowTransition,
    heightShrinkTransition,
    widthGrowTransition,
    widthShrinkTransition,
}
