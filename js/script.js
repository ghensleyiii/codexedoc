function toggleNav() {
  const outerGrid = document.querySelector('.outer-grid');
  outerGrid.classList.toggle('outer-grid-expanded');

  const nav = document.querySelector('nav');
  nav.classList.toggle('hide-nav');
};

/*
**************************************************
CHANGE THEME
**************************************************
*/

window.onload = function () {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  }
  updateAllImages(savedTheme || 'light');
};

function toggleTheme() {
  const html = document.documentElement;
  let newTheme;

  if (html.classList.contains('dark-theme')) {
    html.classList.remove('dark-theme');
    newTheme = 'light';
  } else {
    html.classList.add('dark-theme');
    newTheme = 'dark';
  }

  localStorage.setItem('theme', newTheme);

  updateAllImages(newTheme);
}

function updateAllImages(theme) {
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    let src = img.getAttribute('src');

    if (theme === 'dark' && src.includes('light')) {
      src = src.replace('light', 'dark');
    } else if (theme === 'light' && src.includes('dark')) {
      src = src.replace('dark', 'light');
    }

    img.setAttribute('src', src);
  });
}