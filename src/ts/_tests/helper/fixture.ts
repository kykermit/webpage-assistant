const FIXTURE_ELEMENT_ID = 'fixture';
const FIXTURE_STYLE_ID = 'fixture-style';

const getFixtureElement = (): HTMLElement => {
    let fixture = document.getElementById(FIXTURE_ELEMENT_ID);

    if (!fixture) {
        fixture = document.createElement('div');

        fixture.setAttribute('id', FIXTURE_ELEMENT_ID)
        document.body.appendChild(fixture);
    }

    return fixture;
};

const clearFixtureElement = (): void => {
    const fixture = getFixtureElement();

    fixture.innerHTML = '';
};

const getFixtureStyle = (): HTMLStyleElement => {
    let fixture = document.getElementById(FIXTURE_STYLE_ID);

    if (!fixture || !(fixture instanceof HTMLStyleElement)) {
        fixture = document.createElement('style');

        fixture.setAttribute('id', FIXTURE_STYLE_ID)
        document.body.appendChild(fixture);
    }

    return fixture as HTMLStyleElement;
};

const clearFixtureStyle = (): void => {
    const fixture = getFixtureElement();

    fixture.innerHTML = '';
};

export {
    getFixtureElement,
    clearFixtureElement,
    getFixtureStyle,
    clearFixtureStyle,
}
