document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeText.textContent = 'NIGHT';
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeText.textContent = 'DAY';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeText.textContent = 'Night';
            localStorage.setItem('theme', 'dark');
        }
    });
});
