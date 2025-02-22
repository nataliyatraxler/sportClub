import { renderGroupListByFilter } from './group-list';
import { resetCurrentPageFilter } from './pagination-exercises';
const buttons = Array.from(document.querySelectorAll('.exercises-menu-button'));

const execisesMenuButtonHandler = element => {
    const sectionTitle = document.querySelector('.section-title');
    const exercisesForm = document.querySelector('.exercises-form');

    sectionTitle.innerHTML = 'Exercises';
    buttons.forEach(el => {
        el.classList.remove('active');
    });
    element.classList.add('active');
    exercisesForm.classList.add('visually-hidden');
    resetCurrentPageFilter(); //Added By Ruslan Isupov Скидання сторінки до 1 при натисканні на фільтр категорії ;
    renderGroupListByFilter(element.textContent);
};

buttons.forEach(el =>
    el.addEventListener('click', () => execisesMenuButtonHandler(el))
);
