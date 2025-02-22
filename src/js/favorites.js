import '../css/sct-favorites.css';

import {
    replaceInnerHtmlWithLoader,
    removeLoaderFromElement,
} from './loader.js';
import yourEnergy from './api/your-energy-api.js';
import { renderUserListExercises } from './exercises.js';

const favorites = document.querySelector('.favorites');

const paginationContainer = document.querySelector('.pagination');
const exercisesPerPage = screen.width > 767? 10 : 8;
let currentPage = 1;

async function renderExercisesPage(favoritesList, page = 1) {
    const isDesktopView = window.innerWidth >= 1440;

    let currentExercises;

    if (isDesktopView) {
        const startIndex = 0;
        const endIndex = favoritesList.length;
        currentExercises = favoritesList.slice(startIndex, endIndex);
    } else {
        const startIndex = (page - 1) * exercisesPerPage;
        const endIndex = startIndex + exercisesPerPage;
        currentExercises = favoritesList.slice(startIndex, endIndex);
    }

    if (!currentExercises.length) {
        favorites.innerHTML =
            "<p class='no-favorites'>It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.</p>";
        return;
    }
    try {
        const retrievedExercises = await yourEnergy.getExercisesByIdList(
            currentExercises
        );

        renderUserListExercises(favorites, retrievedExercises);
    } finally {
        removeLoaderFromElement(favorites);
    }
}

function renderPagination(favoritesList) {
    const pageCount = Math.ceil(favoritesList.length / exercisesPerPage);
    let paginationMarkup = '';

    for (let i = 1; i <= pageCount; i++) {
        paginationMarkup += `
            <button class="pagination-button ${
                i === currentPage ? 'active' : ''
            }" data-page="${i}">
                ${i}
            </button>
        `;
    }

    paginationContainer.innerHTML = paginationMarkup;

    document.querySelectorAll('.pagination-button').forEach(button => {
        button.addEventListener('click', () => {
            currentPage = Number(button.dataset.page);
            renderExercisesPage(favoritesList, currentPage);
            renderPagination(favoritesList);
        });
    });
}

function renderUserListFavorites(listFavorites) {
    renderExercisesPage(listFavorites, currentPage);
    renderPagination(listFavorites);
}

const favoritesElement = document.querySelector('.favorites');

if (favoritesElement) {
    const favoriteExercises = JSON.parse(localStorage.getItem('favorites'));

    if (favoriteExercises && Array.isArray(favoriteExercises)) {
        replaceInnerHtmlWithLoader(favorites);
        renderUserListFavorites(favoriteExercises);
    } else {
        favorites.innerHTML =
            "<p class='no-favorites'>It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.</p>";
    }
}
