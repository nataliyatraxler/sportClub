function replaceInnerHtmlWithLoader(element) {
    element.innerHTML = `<div class="loader"></div>`;
}

function appendLoaderToElement(element) {
    element.insertAdjacentHTML('beforeend', '<div class="loader"></div>');
}

function removeLoaderFromElement(element) {
    const loader = element.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
}

export {
    replaceInnerHtmlWithLoader,
    appendLoaderToElement,
    removeLoaderFromElement,
};
