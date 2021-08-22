import { MAJOR_BREAKPOINT } from './config';

const mediaQuery = window.matchMedia(`(min-width: ${MAJOR_BREAKPOINT + 1}px)`);

export {
    mediaQuery
};
