import { getFixtureElement, clearFixtureElement, getFixtureStyle, clearFixtureStyle } from './helper/fixture';
import { toBoolAttribute, setStyle, removeStyle, removeHeightStyle, removeWidthStyle, heightGrowTransition, heightShrinkTransition, widthGrowTransition, widthShrinkTransition } from '../utility';

describe('utility', () => {

    describe('toBoolAttribute', () => {
        let fixture: HTMLElement;
        let testElement: HTMLElement;

        beforeAll(() => {
            fixture = getFixtureElement();
        });

        beforeEach(() => {
            fixture.innerHTML = '<div id="test-element" />';
            testElement = document.getElementById('test-element') as HTMLElement;
        });

        afterEach(() => {
            clearFixtureElement();
        });

        it('"true"が設定されている属性値はtrueを返す', () => {
            testElement.setAttribute('aria-expanded', 'true');

            const value = toBoolAttribute(testElement, 'aria-expanded');

            expect(value).toBe(true);
        });

        it('"false"が設定されている属性値はfalseを返す', () => {
            testElement.setAttribute('aria-expanded', 'false');

            const value = toBoolAttribute(testElement, 'aria-expanded');

            expect(value).toBe(false);
        });

        it('""が設定されている属性値はfalseを返す', () => {
            testElement.setAttribute('aria-expanded', '');

            const value = toBoolAttribute(testElement, 'aria-expanded');

            expect(value).toBe(false);
        });

        it('"true"と"false"以外の値が設定されている属性値はfalseを返す', () => {
            testElement.setAttribute('aria-expanded', 'dummy');

            const value = toBoolAttribute(testElement, 'aria-expanded');

            expect(value).toBe(false);
        });

        it('属性が設定されていないfalseを返す', () => {
            const value = toBoolAttribute(testElement, 'aria-expanded');

            expect(value).toBe(false);
        });
    });

    describe('setStyle', () => {
        let fixture: HTMLElement;
        let testElement: HTMLElement;

        beforeAll(() => {
            fixture = getFixtureElement();
        });

        beforeEach(() => {
            fixture.innerHTML = '<div id="test-element" />';
            testElement = document.getElementById('test-element') as HTMLElement;
        });

        afterEach(() => {
            clearFixtureElement();
        });

        it('第2引数に文字列を渡してスタイルを設定', () => {
            setStyle(testElement, 'height', '1000px');

            const value = getComputedStyle(testElement).getPropertyValue('height');

            expect(value).toBe('1000px');
        });

        it('第2引数にオブジェクトを渡して複数スタイルを設定', () => {
            setStyle(testElement, {
                height: '1000px',
                width: '800px',
            });

            const style = getComputedStyle(testElement);
            const height = style.getPropertyValue('height');
            const width = style.getPropertyValue('width');

            expect(height).toBe('1000px');
            expect(width).toBe('800px');
        });

        it('対象要素が存在しない場合はsetProperty()がコールされない', () => {
            const spy = jest.spyOn(testElement.style, 'setProperty');

            setStyle(null, 'height', '1000px');
            expect(spy).not.toBeCalled();

            spy.mockRestore();
        });

        it('第3引数に指定がない場合はsetProperty()がコールされない', () => {
            const spy = jest.spyOn(testElement.style, 'setProperty');

            setStyle(testElement, 'height');
            expect(spy).not.toBeCalled();

            spy.mockRestore();
        });
    });

    describe('removeStyle', () => {
        let testElement: HTMLElement;

        beforeAll(() => {
            const fixture = getFixtureElement();

            fixture.innerHTML = '<div id="test-element" />';
            testElement = document.getElementById('test-element') as HTMLElement;
        });

        afterEach(() => {
            clearFixtureElement();
        });

        it('第2引数に文字列を渡してスタイルを削除', () => {
            testElement.style.setProperty('height', '1000px');

            removeStyle(testElement, 'height');

            const value = getComputedStyle(testElement).getPropertyValue('height');

            expect(value).toMatch(/^(0px)?$/);
        });

        it('第2引数に配列を渡して複数スタイルを削除', () => {
            testElement.style.setProperty('height', '1000px');
            testElement.style.setProperty('width', '800px');

            removeStyle(testElement, ['height', 'width']);

            const style = getComputedStyle(testElement);
            const height = style.getPropertyValue('height');
            const width = style.getPropertyValue('width');

            expect(height).toMatch(/^(0px)?$/);
            expect(width).toMatch(/^(0px)?$/);
        });

        it('対象要素が存在しない場合はremoveProperty()がコールされない', () => {
            const spy = jest.spyOn(testElement.style, 'removeProperty');

            removeStyle(null, 'height');
            expect(spy).not.toBeCalled();

            spy.mockRestore();
        });
    });

    describe('removeHeightStyle', () => {
        let fixture: HTMLElement;
        let testElement: HTMLElement;

        beforeAll(() => {
            fixture = getFixtureElement();
        });

        beforeEach(() => {
            fixture.innerHTML = '<div id="test-element" />';
            testElement = document.getElementById('test-element') as HTMLElement;
        });

        afterEach(() => {
            clearFixtureElement();
        });

        it('height、pading-top、padding-bottomの値が削除される', () => {
            testElement.style.setProperty('height', '1000px');
            testElement.style.setProperty('padding-top', '100px');
            testElement.style.setProperty('padding-bottom', '100px');

            removeHeightStyle(testElement);

            const style = getComputedStyle(testElement);
            const height = style.getPropertyValue('height');
            const paddingTop = style.getPropertyValue('padding-top');
            const paddingBottom = style.getPropertyValue('padding-bottom');

            expect(height).toMatch(/^(0px)?$/);
            expect(paddingTop).toMatch(/^(0px)?$/);
            expect(paddingBottom).toMatch(/^(0px)?$/);
        });

        it('対象要素が存在しない場合はremoveProperty()がコールされない', () => {
            const spy = jest.spyOn(testElement.style, 'removeProperty');

            removeHeightStyle(null);
            expect(spy).not.toBeCalled();

            spy.mockRestore();
        });
    });

    describe('removeWidthStyle', () => {
        let fixture: HTMLElement;
        let testElement: HTMLElement;

        beforeAll(() => {
            fixture = getFixtureElement();
        });

        beforeEach(() => {
            fixture.innerHTML = '<div id="test-element" />';
            testElement = document.getElementById('test-element') as HTMLElement;
        });

        afterEach(() => {
            clearFixtureElement();
        });

        it('width、pading-left、padding-rightの値が削除される', () => {
            testElement.style.setProperty('width', '1000px');
            testElement.style.setProperty('padding-left', '100px');
            testElement.style.setProperty('padding-right', '100px');

            removeWidthStyle(testElement);

            const style = getComputedStyle(testElement);
            const width = style.getPropertyValue('width');
            const paddingTop = style.getPropertyValue('padding-left');
            const paddingBottom = style.getPropertyValue('padding-right');

            expect(width).toMatch(/^(0px)?$/);
            expect(paddingTop).toMatch(/^(0px)?$/);
            expect(paddingBottom).toMatch(/^(0px)?$/);
        });

        it('対象要素が存在しない場合はremoveProperty()がコールされない', () => {
            const spy = jest.spyOn(testElement.style, 'removeProperty');

            removeWidthStyle(null);
            expect(spy).not.toBeCalled();

            spy.mockRestore();
        });
    });

    describe('heightGrowTransition', () => {
        let fixture: HTMLElement;
        let testElement: HTMLElement;
        let fixtureStyle: HTMLStyleElement;

        beforeAll(() => {
            fixture = getFixtureElement();
            fixtureStyle = getFixtureStyle();
        });

        beforeEach(() => {
            fixture.innerHTML = '<div id="test-element" class="test-target" />';
            testElement = document.getElementById('test-element') as HTMLElement;

        });

        afterEach(() => {
            clearFixtureElement();
            clearFixtureStyle();
        });

        it('height、pading-top、padding-bottomの値が0からCSSで設定されている値まで変化する', () => {
            const spy = jest.spyOn(testElement.style, 'setProperty');
            const HEIGHT_STYLE = '1000px';
            const PADDING_TOP_STYLE = '100px';
            const PADDING_BOTTOM_STYLE = '100px';

            fixtureStyle.innerHTML = `.test-target { height: ${HEIGHT_STYLE}; padding-top: ${PADDING_TOP_STYLE}; padding-bottom: ${PADDING_BOTTOM_STYLE}; }`;

            heightGrowTransition(testElement, 'class-name');

            const style = getComputedStyle(testElement);
            const paddingTop = style.getPropertyValue('padding-top');
            const paddingBottom = style.getPropertyValue('padding-bottom');

            expect(spy).toHaveBeenNthCalledWith(1, 'height', '0');
            expect(spy).toHaveBeenNthCalledWith(2, 'padding-top', '0');
            expect(spy).toHaveBeenNthCalledWith(3, 'padding-bottom', '0');
            expect(spy).toHaveBeenNthCalledWith(4, 'height', expect.stringMatching(/^[\d]+px$/));
            expect(paddingTop).toBe(PADDING_TOP_STYLE);
            expect(paddingBottom).toBe(PADDING_BOTTOM_STYLE);
        });

        it('第2引数で指定したclass属性値が設定されている', () => {
            const CLASS_NAME = 'show-class';

            heightGrowTransition(testElement, CLASS_NAME);

            const className = testElement.classList.contains(CLASS_NAME);

            expect(className).toBe(true);
        });
    });

    describe('heightShrinkTransition', () => {
        let fixture: HTMLElement;
        let testElement: HTMLElement;

        beforeAll(() => {
            fixture = getFixtureElement();
        });

        beforeEach(() => {
            fixture.innerHTML = '<div id="test-element" />';
            testElement = document.getElementById('test-element') as HTMLElement;
        });

        afterEach(() => {
            clearFixtureElement();
        });

        it('height、pading-top、padding-bottomの値が0へ変化する', () => {
            const spy = jest.spyOn(testElement.style, 'setProperty');

            heightShrinkTransition(testElement);

            expect(spy).toHaveBeenNthCalledWith(1, 'height', expect.stringMatching(/^[\d]+px$/));
            expect(spy).toHaveBeenNthCalledWith(2, 'height', '0');
            expect(spy).toHaveBeenNthCalledWith(3, 'padding-top', '0');
            expect(spy).toHaveBeenNthCalledWith(4, 'padding-bottom', '0');
        });
    });

    describe('widthGrowTransition', () => {
        let fixture: HTMLElement;
        let testElement: HTMLElement;
        let fixtureStyle: HTMLStyleElement;

        beforeAll(() => {
            fixture = getFixtureElement();
            fixtureStyle = getFixtureStyle();
        });

        beforeEach(() => {
            fixture.innerHTML = '<div id="test-element" class="test-target" />';
            testElement = document.getElementById('test-element') as HTMLElement;

        });

        afterEach(() => {
            clearFixtureElement();
            clearFixtureStyle();
        });

        it('width、pading-left、padding-rightの値が0からCSSで設定されている値まで変化する', () => {
            const spy = jest.spyOn(testElement.style, 'setProperty');
            const WIDTH_STYLE = '1000px';
            const PADDING_LEFT_STYLE = '100px';
            const PADDING_RIGHT_STYLE = '100px';

            fixtureStyle.innerHTML = `.test-target { width: ${WIDTH_STYLE}; padding-left: ${PADDING_LEFT_STYLE}; padding-right: ${PADDING_RIGHT_STYLE}; }`;

            widthGrowTransition(testElement, 'class-name');

            const style = getComputedStyle(testElement);
            const paddingTop = style.getPropertyValue('padding-left');
            const paddingBottom = style.getPropertyValue('padding-right');

            expect(spy).toHaveBeenNthCalledWith(1, 'width', '0');
            expect(spy).toHaveBeenNthCalledWith(2, 'padding-left', '0');
            expect(spy).toHaveBeenNthCalledWith(3, 'padding-right', '0');
            expect(spy).toHaveBeenNthCalledWith(4, 'width', expect.stringMatching(/^[\d]+px$/));
            expect(paddingTop).toBe(PADDING_LEFT_STYLE);
            expect(paddingBottom).toBe(PADDING_RIGHT_STYLE);
        });

        it('第2引数で指定したclass属性値が設定されている', () => {
            const CLASS_NAME = 'show-class';

            widthGrowTransition(testElement, CLASS_NAME);

            const className = testElement.classList.contains(CLASS_NAME);

            expect(className).toBe(true);
        });
    });

    describe('widthShrinkTransition', () => {
        let fixture: HTMLElement;
        let testElement: HTMLElement;

        beforeAll(() => {
            fixture = getFixtureElement();
        });

        beforeEach(() => {
            fixture.innerHTML = '<div id="test-element" />';
            testElement = document.getElementById('test-element') as HTMLElement;
        });

        afterEach(() => {
            clearFixtureElement();
        });

        it('width、pading-left、padding-rightの値が0へ変化する', () => {
            const spy = jest.spyOn(testElement.style, 'setProperty');

            widthShrinkTransition(testElement);

            expect(spy).toHaveBeenNthCalledWith(1, 'width', expect.stringMatching(/^[\d]+px$/));
            expect(spy).toHaveBeenNthCalledWith(2, 'width', '0');
            expect(spy).toHaveBeenNthCalledWith(3, 'padding-left', '0');
            expect(spy).toHaveBeenNthCalledWith(4, 'padding-right', '0');
        });
    });
});
