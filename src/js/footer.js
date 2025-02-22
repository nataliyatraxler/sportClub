import yourEnergy from './api/your-energy-api.js';
import toastManager from './api/toast-manager.js';

const form = document.querySelector('.footer-form')

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = form.elements.email.value;
    const emailPattern = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (emailPattern.test(email)) {
        try {
            const response = await yourEnergy.orderSubscription(email);
            if (typeof response === 'string') {
                toastManager.error('Error', response);
            } else {
                toastManager.success('Success', 'Subscription successful!');
            }
        } catch (error) {
            toastManager.error('Error', 'Subscription failed: ' + error);
        }
        form.elements.email.value = '';
    } else {
        toastManager.warning(
            'Warning',
            'Please enter a valid email address.',
        );
    }
});
