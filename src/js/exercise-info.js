import api from './api/your-energy-api';
import modal from './modal';
import RatingForm from './rating-form';
import iconsSVG from '../img/icons.svg';
import setTime from '../js/timer-info.js';


function showExersiceInfoModal(exerciseId) {
    fetchExerciseInfoById(exerciseId).then(exerciseInfo => {
        const content = buildExerciseInfoHTML(exerciseInfo);
        const exerciseModal = new modal(content);

        const addToFavoriteBtn = exerciseModal.modal.querySelector('.add-to-favorite-btn');
        const giveRatingBtn = exerciseModal.modal.querySelector('.give-rating-btn');
        const startBtn = exerciseModal.modal.querySelector('.start-btn');
        const timer = exerciseModal.modal.querySelector('.timer');


        let startTime;
        let stopTime;
        let intervalId;

        addToFavoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isFavorite(exerciseId)) {
                removeFromFavorites(exerciseId);
            } else {
                addToFavorites(exerciseId);
            }
            // Update the button text and icon
            addToFavoriteBtn.innerHTML = getAddedToFavoritesBtnHTML(exerciseId);
        });
        giveRatingBtn.addEventListener('click', (e) => {
            exerciseModal.toggleModalVisibility();
            const ratingForm = new RatingForm(exerciseId, exerciseModal);
        });

        startBtn.addEventListener('click', (e) => {
            if (startBtn.classList.contains('start-btn')) {
                startBtn.classList.remove('start-btn');
                startBtn.classList.add('stop-btn');
                startBtn.textContent = 'STOP';
                startTime = Date.now();
                intervalId = setInterval(() => {
                    const currentTime = Date.now();
                    timer.textContent = formatTime(Math.floor((currentTime - startTime) / 1000));
                }, 1000);
            }
            else {
                startBtn.classList.remove('stop-btn');
                startBtn.classList.add('start-btn');
                startBtn.textContent = 'START';
                stopTime = Date.now();

                clearInterval(intervalId);
                const timeDiff = stopTime - startTime;
                const seconds = Math.floor(timeDiff / 1000);

                const savedTimer = Number(localStorage.getItem('timer')) || 0;
                localStorage.setItem('timer', savedTimer + seconds);
                const savedCalories = Number(localStorage.getItem('burntCalories')) || 0;
                localStorage.setItem('burntCalories', savedCalories + seconds * (exerciseInfo.burnedCalories || 0));
                localStorage.setItem('lastUpdate', new Date().toDateString());
                setTime()
            }
        });

        exerciseModal.openModal();
    });
}

function buildExerciseInfoHTML(exerciseInfo) {
    return `
        <div class="exercise-info__wrapper">
            <img class="exercise-info__img" src="${exerciseInfo.gifUrl}" alt="${exerciseInfo.name}" width="270" height="259">
            <div class="exercise-info__content">
                <h3 class="exercise-info__title">${exerciseInfo.name}</h3>
                <div class="exercise-info__rating">
                    ${getRatingStarsHTML(exerciseInfo.rating)}
                </div>
                <ul class="exercise-info__params">
                    ${buildExerciseInfoParamsHTML(exerciseInfo)}
                </ul>
               <p class="exercise-info__description">${exerciseInfo.description}</p>
            </div>

            <div class="exercise-btn-block">
                <div class="timer-block">
                    <button class="exercise-info__button time-btn start-btn">START</button>
                    <p class="timer"></p>
                </div>

                <div class="exercise-info__actions">
                    <button class="exercise-info__button add-to-favorite-btn" data-id="${exerciseInfo._id}">
                        ${getAddedToFavoritesBtnHTML(exerciseInfo._id)}
                    </button>
                    <button class="exercise-info__button give-rating-btn">Give a rating</button>
                </div>
            </div>
        </div>
    `;
}

function buildExerciseInfoParamsHTML(exerciseInfo) {
    const params = [];

    if (exerciseInfo.target) {
        params.push(`<li><span>Target</span><span class="details-target">${exerciseInfo.target}</span></li>`);
    }

    if (exerciseInfo.bodyPart) {
        params.push(`<li><span>Body Part</span><span class="details-body-part">${exerciseInfo.bodyPart}</span></li>`);
    }

    if (exerciseInfo.equipment) {
        params.push(`<li><span>Equipment</span> ${exerciseInfo.equipment}</li>`);
    }

    if (exerciseInfo.popularity) {
        params.push(`<li><span>Popular</span> ${exerciseInfo.popularity}</li>`);
    }

    if (exerciseInfo.burnedCalories) {
        params.push(`<li><span>Burned Calories</span><span class="details-calories">${exerciseInfo.burnedCalories}</span></li>`);
    }

    return params.join('');
}

function getRatingStarsHTML(rating) {
    const stars = [];

    // Format rating text to 1 decimal place
    rating = rating.toFixed(1);

    const ratingInt = Math.floor(rating);
    const ratingDecimal = rating - ratingInt;

    // Add rating text
    const ratingText = `<span class="exercise-info__rating-text">${rating}</span>`;

    // Fill full stars
    for (let i = 0; i < ratingInt; i++) {
        stars.push(
            `<svg width="18" height="18">
                <use class="rating-star__full" href="${iconsSVG}#icon-star-18"></use>
            </svg>`
        );
    }

    // Add half star if rating has decimal part
    if (ratingDecimal > 0) {
        const percent = ratingDecimal * 100;
        stars.push(
            `<svg width="18" height="18">
                <defs>
                    <linearGradient id="myGradient">
                        <stop offset="${percent}%" stop-color="var(--color-stars-full)" />
                        <stop offset="0%" stop-color="var(--color-stars-empty)" />
                    </linearGradient>
                </defs>
                <use class="rating-star" href="${iconsSVG}#icon-star-18" fill="url('#myGradient')"></use>
            </svg>`
        );
    }

    // Fill the rest of the stars with empty stars
    while (stars.length < 5) {
        stars.push(
            `<svg width="18" height="18">
                <use class="rating-star__empty" href="${iconsSVG}#icon-star-18"></use>
            </svg>`
        );
    }

    return `${ratingText}<div class="exercise-info__rating-stars">${stars.join('')}</div>`;
}

function addToFavorites(exerciseId) {
    // Get data from local storage
    const favorites = localStorage.getItem('favorites');
    if (!favorites) {
        // Add exercise to favorites
        localStorage.setItem('favorites', JSON.stringify([exerciseId]));
    } else {
        // Parse favorites
        const favoritesArr = JSON.parse(favorites);

        // Check if exercise is already in favorites
        if (favoritesArr.includes(exerciseId)) {
            return;
        }

        // Add exercise to favorites
        favoritesArr.push(exerciseId);
        localStorage.setItem('favorites', JSON.stringify(favoritesArr));
    }
    sessionStorage.removeItem('favorites2del');
}

function removeFromFavorites(exerciseId, force = false) {
    // Get data from local storage
    const favorites = localStorage.getItem('favorites');
    if (!favorites) {
        return;
    }

    // Parse favorites
    const favoritesArr = JSON.parse(favorites);

    // Remove exercise from favorites
    const updatedFavorites = favoritesArr.filter(id => id !== exerciseId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    // Mark to Remove exercise from favorites list if it's open
    const favoritesList = document.querySelector('.favorites');
    if (favoritesList) {
        if (force) {
            const exerciseCard = favoritesList.querySelector(`.exercise-card[data-id="${exerciseId}"]`);
            if (exerciseCard) {
                exerciseCard.remove();
            }
        } else
            sessionStorage.setItem('favorites2del', exerciseId);
    }
}

function isFavorite(exerciseId) {
    // Get data from local storage
    const favorites = localStorage.getItem('favorites');

    if (!favorites) {
        return false;
    }

    const favoritesArr = JSON.parse(favorites);

    return favoritesArr.includes(exerciseId);
}

function getAddedToFavoritesBtnHTML(exerciseId) {
    const isFav = isFavorite(exerciseId);

    return `
        ${isFav ? 'Remove from favorites' : 'Add to favorites'}
        <svg width="20" height="20">
            <use class="modal-close-icon" href="${iconsSVG}#${isFav ? 'icon-trash' : 'icon-heart'}"></use>
        </svg>
    `;
}

async function fetchExerciseInfoById(id) {
    return await api.getExerciseById(id);
}


function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    // padStart добавляет ведущий ноль если число меньше 10
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export { showExersiceInfoModal, removeFromFavorites };