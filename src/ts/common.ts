import { WEBHOOK_URL } from './core/config';
import assistant from './core/assistant';
import SlideNav from './component/slideNav';
import ScrollLink from './component/scrollLink';
import AlertToast from './component/alertToast';
import ScrollEffect from './component/scrollEffect';

assistant.connect(WEBHOOK_URL);

SlideNav.create('.js-slide-nav');
ScrollLink.create('.js-scroll');
AlertToast.create('.js-alert-toast');
ScrollEffect.create('.js-navtop');
