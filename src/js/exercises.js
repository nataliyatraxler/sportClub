import {
    renderPaginationButtonsSearch,
    renderPaginationButtonsExercises,
    getCurrentPageSearch,
    getCurrentPageExercises,
    changeFetchMethod,
} from './pagination-exercises.js';
import yourEnergy from './api/your-energy-api.js';
import toastManager from './api/toast-manager.js';
import { showExersiceInfoModal } from './exercise-info.js';
import iconsSVG from '../img/icons.svg';
import { removeFromFavorites } from './exercise-info.js';

import {
    replaceInnerHtmlWithLoader,
    removeLoaderFromElement,
} from './loader.js';
const exercisesForm = document.querySelector('.exercises-form');

// const notFoundTextEl = document.querySelector('.not-found-text');
const exercises = document.querySelector('.group-list');

let categoryName = 'muscles';
let categoryValue = '';
let keyword = '';

if (exercisesForm) {
    exercisesForm.addEventListener('submit', handlerSearchFormSubmit);
}

function getLimit() {
    return screen.width > 767 ? 10 : 8;
}

function handlerSearchFormSubmit(e) {
    e.preventDefault();

    keyword = e.target.elements.search.value.trim();
    // console.log(keyword);
    if (!keyword) {
        alert('Please, enter a search words');
        return;
    }
    searchListOfExercises();
    e.target.elements.search.value = '';
}

async function searchListOfExercises() {
    const page = getCurrentPageSearch();
    replaceInnerHtmlWithLoader(exercises);

    const limit = getLimit();
    const listOfExercises = await yourEnergy.getExercises({
        page,
        limit,
        [categoryName]: categoryValue,
        keyword,
    });
    /* console.group(
        page,
        'searchListOfExercises',
        categoryName,
        categoryValue,
        keyword,
        listOfExercises,
        listOfExercises.totalPages
    ); // */
    renderUserListExercises(exercises, listOfExercises.results);
    changeFetchMethod('search');
    renderPaginationButtonsSearch(
        listOfExercises.totalPages,
        searchListOfExercises,
        categoryName,
        categoryValue,
        keyword
    );
    removeLoaderFromElement(exercises);
}

async function findListOfExercises(catName, catValue) {
    const page = getCurrentPageExercises();
    switch (catName) {
        case 'muscles':
            categoryName = 'muscles';
            break;
        case 'equipment':
            categoryName = 'equipment';
            break;
        // case 'body parts':
        case 'bodypart':
            categoryName = 'bodypart';
            break;
    }
    categoryValue = catValue;
    replaceInnerHtmlWithLoader(exercises);
    try {
        const limit = getLimit();
        const listOfExercises = await yourEnergy.getExercises({
            page,
            limit,
            [categoryName]: categoryValue,
        });

        // if (listOfExercises.results.length === 0) {
        //     clearMarkup();
        //     // console.log("length",listOfExercises.results.length);
        //     return;
        // }

        exercisesForm.classList.remove('visually-hidden');
        /* console.group(
            page,
            'findListOfExercises',
            categoryName,
            categoryValue,
            listOfExercises,
            listOfExercises.totalPages
        ); // */
        renderUserListExercises(exercises, listOfExercises.results);
        changeFetchMethod('exercises');
        renderPaginationButtonsExercises(
            listOfExercises.totalPages,
            findListOfExercises,
            categoryName,
            categoryValue
        );
    } catch (err) {
        clearMarkup();
        toastManager.error('Error', err);
    } finally {
        removeLoaderFromElement(exercises);
        // console.log('Buy');
        // form.reset();
    }
}

function renderUserListExercises(element, listExercises) {
    const isFavorites = element.classList.contains('favorites');

    const markup = listExercises
        .map(
            exercise => `
<li class="exercise-card" data-id=${exercise._id}>
  <div class="top-row">
  <div class="rating">
        <p class="badge">WORKOUT</p>
        ${
            isFavorites
                ? `
            <button type="button" class="remove-favorite" data-id=${exercise._id}>
                <svg width="16" height="16">
                    <use class="remove-favorite__icon" href="${iconsSVG}#icon-trash"></use>
                </svg>
            </button>`
                : `<div class="rating-star">
                <span class='text-star'>${exercise.rating}</span>
                    <svg class="star-icon" width="18" height="18">
                        <use href="${iconsSVG}#icon-star-18"></use>
                    </svg>
            </div>
        `
        }
        </div>
        <button class="start">
            Start
            <svg class="icon-arrow-right" width="13" height="13">
                    <use href="${iconsSVG}#icon-arrow-right"></use>
                </svg>
        </button>
    </div>
    <div class="exercise-info">
    <div class="icon-wrapper">
    <svg class="arrow-running-icon" width="14" height="16">                     
        <use href="${iconsSVG}#icon-running-stick-figure"></use>
    </svg>
</div>
        <p class="exercise-name">${exercise.name}</p>
    </div>
    <div class="details">
        <p>Burned calories: <span class="details-calories">${
            exercise.burnedCalories
        } / ${exercise.time} min</span></p>
        <p>Body part: <span class="details-calories">${
            exercise.bodyPart
        }</span></p>
        <p>Target: <span class="details-target">${exercise.target}</span></p>
    </div>
</li>`
        )
        .join('');

    element.innerHTML = markup;

    // Add event listeners to the exercise start button
    const exerciseCards = document.querySelectorAll('.exercise-card .start');
    exerciseCards.forEach(card => {
        card.addEventListener('click', handleExerciseStart);
    });

    if (isFavorites) {
        const removeFavoriteButtons =
            document.querySelectorAll('.remove-favorite');
        removeFavoriteButtons.forEach(button => {
            button.addEventListener('click', handleRemoveFavorite);
        });
    }
}

function handleExerciseStart(e) {
    const exerciseId = e.target.closest('.exercise-card').dataset.id;
    showExersiceInfoModal(exerciseId);
}

function handleRemoveFavorite(e) {
    const exerciseCard = e.target.closest('.exercise-card');
    const exerciseId = exerciseCard.dataset.id;
    removeFromFavorites(exerciseId, true);
}

function clearMarkup() {
    exercises.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.exercises-input');
    const clearButton = document.querySelector('.clear-button');

    if (searchInput && clearButton) {
        clearButton.style.display = 'none';

        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() !== '') {
                clearButton.style.display = 'flex';
            } else {
                clearButton.style.display = 'none';
            }
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            findListOfExercises(categoryName, categoryValue);
            clearButton.style.display = 'none';
            searchInput.focus();
        });
    } /* else {
        console.warn('.exercises-input not found');
    } // */
});

export { findListOfExercises, renderUserListExercises };
