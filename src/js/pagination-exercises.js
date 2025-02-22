let currentFetchMethod = null;

function resetCurrentPage() {
    currentPageSearch = 1;
    currentPageCategory = 1;
    currentPageExercises = 1;
}
function resetCurrentPageFilter() {
    currentPageCategory = 1;
}
function changeFetchMethod(newMethod) {
    if (currentFetchMethod !== newMethod) {
        resetCurrentPage();
        currentFetchMethod = newMethod;
    }
}
let currentPageSearch = 1;

function setCurrentPageSearch(page) {
    currentPageSearch = page;
}

function getCurrentPageSearch() {
    return currentPageSearch;
}

async function renderPaginationButtonsSearch(
    totalPages,
    fetchDataFunction,
    ...fetchDataParams
) {
    renderPagination(
        totalPages,
        fetchDataFunction,
        setCurrentPageSearch,
        getCurrentPageSearch,
        ...fetchDataParams
    );
}

// Пагінація для пошуку за категорією
let currentPageCategory = 1;
function setCurrentPageCategory(page) {
    currentPageCategory = page;
}

function getCurrentPageCategory() {
    return currentPageCategory;
}

async function renderPaginationButtonsCategory(
    totalPages,
    fetchDataFunction,
    ...fetchDataParams
) {
    renderPagination(
        totalPages,
        fetchDataFunction,
        setCurrentPageCategory,
        getCurrentPageCategory,
        ...fetchDataParams
    );
}

// Пагінація для пошуку за іншим параметром (наприклад, за м'язами чи обладнанням)
let currentPageExercises = 1;
function setCurrentPageExercises(page) {
    currentPageExercises = page;
}

function getCurrentPageExercises() {
    return currentPageExercises;
}

async function renderPaginationButtonsExercises(
    totalPages,
    fetchDataFunction,
    ...fetchDataParams
) {
    renderPagination(
        totalPages,
        fetchDataFunction,
        setCurrentPageExercises,
        getCurrentPageExercises,
        ...fetchDataParams
    );
}

// Загальна функція рендеру пагінації
function renderPagination(
    totalPages,
    fetchDataFunction,
    setCurrentPage,
    getCurrentPage,
    ...fetchDataParams
) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    const currentPage = getCurrentPage();

    const prevButton = createPrevButton();
    pagination.appendChild(prevButton);

    const maxVisibleButtons = 5;
    let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    if (endPage - startPage + 1 < maxVisibleButtons) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            addEllipsis();
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            addEllipsis();
        }
        addPageButton(totalPages);
    }

    const nextButton = createNextButton();
    pagination.appendChild(nextButton);

    function addPageButton(pageNumber) {
        const button = document.createElement('button');
        button.textContent = pageNumber;
        button.classList.add('page-button');
        if (pageNumber === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', async () => {
            setCurrentPage(pageNumber);
            await fetchDataFunction(...fetchDataParams);
            renderPagination(
                totalPages,
                fetchDataFunction,
                setCurrentPage,
                getCurrentPage,
                ...fetchDataParams
            );
        });
        pagination.appendChild(button);
    }

    function addEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.classList.add('ellipsis');
        pagination.appendChild(ellipsis);
    }

    function createPrevButton() {
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '←';
        prevButton.classList.add('page-button');
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', async () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                await fetchDataFunction(...fetchDataParams);
                renderPagination(
                    totalPages,
                    fetchDataFunction,
                    setCurrentPage,
                    getCurrentPage,
                    ...fetchDataParams
                );
            }
        });
        return prevButton;
    }

    function createNextButton() {
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '→';
        nextButton.classList.add('page-button');
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', async () => {
            if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                await fetchDataFunction(...fetchDataParams);
                renderPagination(
                    totalPages,
                    fetchDataFunction,
                    setCurrentPage,
                    getCurrentPage,
                    ...fetchDataParams
                );
            }
        });
        return nextButton;
    }
}

export {
    renderPaginationButtonsSearch,
    renderPaginationButtonsCategory,
    renderPaginationButtonsExercises,
    getCurrentPageSearch,
    getCurrentPageCategory,
    getCurrentPageExercises,
    changeFetchMethod,
    resetCurrentPageFilter,
};
