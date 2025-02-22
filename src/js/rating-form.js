import Modal from './modal';
import toastManager from './api/toast-manager.js';
import yourEnergy from './api/your-energy-api.js';
import { showExersiceInfoModal } from './exercise-info.js';
import iconsSVG from '../img/icons.svg';

class RatingForm {
    constructor(exerciseId, parentModal = null) {
        this.exerciseId = exerciseId;
        this.parentModal = parentModal;
        const modalContent = this.getFormHTML(exerciseId);
        this.modal = new Modal(modalContent.outerHTML, parentModal);
        this.modal.openModal();

        // Add event listener to the form
        const form = this.modal.modal.querySelector('.rating-form');
        const rating = form.querySelector('.rating-form__rating');
        form.addEventListener('submit', async (event) => this.handleSubmit(event));
        rating.addEventListener('click', (event) => this.handleRatingClick(event));
    }

    getFormHTML(exerciseId) {
        const formContainer = document.createElement('div');
        formContainer.classList.add('rating-form__container');

        const form = document.createElement('form');
        form.classList.add('rating-form');

        const formContent = `
            <h2 class="rating-form__title">Rating</h2>
            <div class="rating-form__rating">
                <span class="rating-form__value">0.0</span>
                <input type="radio" id="rating-1" class="visually-hidden" name="rating" value="1" required>
                <label for="rating-1">
                    <svg width="24" height="24">
                        <use class="rating-star__empty" href="${iconsSVG}#icon-star-18"></use>
                    </svg>
                </label>
                <input type="radio" id="rating-2" class="visually-hidden" name="rating" value="2" required>
                <label for="rating-2">
                    <svg width="24" height="24">
                        <use class="rating-star__empty" href="${iconsSVG}#icon-star-18"></use>
                    </svg>
                </label>
                <input type="radio" id="rating-3" class="visually-hidden" name="rating" value="3" required>
                <label for="rating-3">
                    <svg width="24" height="24">
                        <use class="rating-star__empty" href="${iconsSVG}#icon-star-18"></use>
                    </svg>
                </label>
                <input type="radio" id="rating-4" class="visually-hidden" name="rating" value="4" required>
                <label for="rating-4">
                    <svg width="24" height="24">
                        <use class="rating-star__empty" href="${iconsSVG}#icon-star-18"></use>
                    </svg>
                </label>
                <input type="radio" id="rating-5" class="visually-hidden" name="rating" value="5" required>
                <label for="rating-5">
                    <svg width="24" height="24">
                        <use class="rating-star__empty" href="${iconsSVG}#icon-star-18"></use>
                    </svg>
                </label>
            </div>
            <input type="email" class="footer-input rating-form__email" name="email" placeholder="Email" required>
            <textarea class="footer-input rating-form__comment" name="comment" placeholder="Your comment" required></textarea>
            <input type="hidden" value="${exerciseId}" name="exerciseId">
            <button type="submit" class="footer-button rating-form__send">Send</button>
            `;

        form.innerHTML = formContent;
        formContainer.appendChild(form);

        return formContainer;
    }
    
    handleRatingClick(event) {
        event.stopPropagation();
        const rating = event.target;
        if (rating.tagName !== 'INPUT') {
            return;
        }

        const ratingValue = rating.value;
        
        // Clear all active stars
        const stars = event.currentTarget.querySelectorAll('label');
        stars.forEach(star => {
            star.classList.remove('active');
        });
    
        // Add active class to the clicked star and all previous stars
        for (let i = 0; i < ratingValue; i++) {
            stars[i].classList.add('active');
        }

        // Update rating value
        const ratingValueElement = event.currentTarget.querySelector('.rating-form__value');
        ratingValueElement.textContent = ratingValue + '.0';
    }

    handleEscapeKey(event) {
        if (event.key === 'Escape') {
            this.modal.closeModal();
            
            // Check if there's a parent modal and toggle its visibility if so
            if (this.parentModal) {
                this.parentModal.toggleModalVisibility();
            }
    
            // Remove the Escape key listener after closing the modal
            document.removeEventListener('keydown', this.handleEsc);
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
    
        const form = e.target;
        const id = form.elements.exerciseId.value;
        const rating = parseInt(form.elements.rating.value);
        const email = form.elements.email.value;
        const comment = form.elements.comment.value;
    
        if (!rating || !email || !comment) {
            toastManager.error('Error:', 'All fields are required');
            return;
        }
    
        if (!email.match(/^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
            toastManager.error('Error:', 'Invalid email');
            return;
        }
    
        try {
            const response = await yourEnergy.addRating(id, rating, email, comment);
    
            if (response instanceof Object) {
                toastManager.success('Success:', 'Rating added successfully');
                this.modal.backdrop.classList.remove('is-open');
                if (this.parentModal) {
                    this.parentModal.closeModal();
                    showExersiceInfoModal(id);
                }
                this.modal.closeModal();
            } else {
                toastManager.error('Error:', response);
            }
    
        } catch (error) {
            toastManager.error('Error:', error);
        }
    }
}

export default RatingForm;
