document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-item .nav-link').forEach(link => {
        const item = link.closest('.nav-item');
        item.classList.toggle(
            'active',
            currentPath.endsWith(link.getAttribute('href').substring(1))
        );
    });
});
