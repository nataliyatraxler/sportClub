import iconsSVG from '../img/icons.svg';

class Modal {
    constructor(content, parentModal = null) {
        this.parentModal = parentModal;
        this.backdrop = document.createElement('div');
        this.backdrop.classList.add('backdrop');

        this.modal = document.createElement('div');
        this.modal.classList.add('modal');

        this.content = document.createElement('div');
        this.content.classList.add('modal-content');
        this.content.innerHTML = content;

        this.closeButton = document.createElement('button');
        this.closeButton.innerHTML = ` 
        <svg width="12" height="12">
            <use class="modal-close-icon" href="${iconsSVG}#icon-close-modal"></use>
        </svg>
    `;
        this.closeButton.classList.add('close-modal-btn');

        this.modal.appendChild(this.content);
        this.modal.appendChild(this.closeButton);
        this.backdrop.appendChild(this.modal);

        this.handleClose = this.closeModal.bind(this);

        // Add event listener to close modal when clicking on close button
        this.closeButton.addEventListener('click', this.handleClose);

        // Add event listener to close modal when clicking on backdrop
        this.backdrop.addEventListener('click', this.handleClose);

        // Add event listener to close modal when pressing the ESC key
        document.addEventListener('keydown', this.handleClose);

        document.body.appendChild(this.backdrop);
    }

    openModal() {

        if (this.parentModal) {
            this.parentModal.backdrop.classList.remove('is-open');
        } else {
            // Avoid scrollbar jumping  when modal is opened
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        

        document.body.classList.add('modal-no-scroll');
        this.backdrop.classList.add('is-open');
    }

    toggleModalVisibility() {
        this.backdrop.classList.toggle('is-open');
    }

    closeModal(event) {

        if (
            !event ||
            (event.type === 'keydown' && event.key !== 'Escape') ||
            !this.backdrop.classList.contains('is-open') ||
            event.target.closest('.modal-content')
        ) {
            return;
        }

        // Remove event listeners
        document.removeEventListener('keydown', this.handleClose);

        // Remove modal from the DOM
        this.backdrop.classList.remove('is-open');
        
        if (this.parentModal) {
            this.parentModal.backdrop.classList.add('is-open');
        } else {
            document.body.classList.remove('modal-no-scroll');
            document.body.style.paddingRight = '';
        }
        
        const exerciseId = sessionStorage.getItem('favorites2del');
        if (exerciseId) {
            // Remove exercise from favorites list if it's open
            const favoritesList = document.querySelector('.favorites');
            if (favoritesList) {
                const exerciseCard = favoritesList.querySelector(`.exercise-card[data-id="${exerciseId}"]`);
                if (exerciseCard) {
                    exerciseCard.remove();
                }
            }
            sessionStorage.removeItem('favorites2del');
        }
        
        this.backdrop.remove();
    }
}

export default Modal;
