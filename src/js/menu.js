const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuOpenButton = document.querySelector('.mobile-menu-open-btn');
const mobileMenuCloseButton = document.querySelector('.mobile-menu-close-btn');

mobileMenuOpenButton.addEventListener('click', () => {
  mobileMenu.classList.add('is-open');
});

mobileMenuCloseButton.addEventListener('click', () => {
  mobileMenu.classList.remove('is-open');
});
