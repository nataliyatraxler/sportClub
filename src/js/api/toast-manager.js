import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const rootStyles = getComputedStyle(document.documentElement);

const popupBgColor = rootStyles.getPropertyValue('--color-popup-bg').trim();
const popupTxtColor = rootStyles.getPropertyValue('--color-popup-txt').trim();
const popupMainColor = rootStyles.getPropertyValue('--color-popup-main').trim();
const popupLineColor = rootStyles.getPropertyValue('--color-popup-line').trim();

class ToastManager {
    constructor() {
        iziToast.settings({
            timeout: 5000,
            resetOnHover: true,
            position: 'topLeft',
            transitionIn: 'fadeInDown',
            transitionOut: 'fadeOutUp',
            progressBar: true,
            progressBarColor: popupLineColor,
            backgroundColor: popupBgColor,
            titleColor: popupMainColor,
            messageColor: popupTxtColor,
            theme: 'dark',
        });
    }

    success(title, message) {
        iziToast.success({
            title: title,
            message: message,
        });
    }

    error(title, message) {
        iziToast.error({
            title: title,
            message: message,
        });
    }

    warning(title, message) {
        iziToast.warning({
            title: title,
            message: message,
        });
    }

    settings(settings) {
        iziToast.settings(settings);
    }
}

const toastManager = new ToastManager();

export default toastManager;