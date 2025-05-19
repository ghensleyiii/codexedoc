// Hamburger menu toggle for left menu
const hamburgerLeft = document.querySelector('.hamburger-left');
const navMenuLeft = document.querySelector('.nav-menu-left');

hamburgerLeft.addEventListener('click', () => {
  hamburgerLeft.classList.toggle('active');
  navMenuLeft.classList.toggle('active');
  const isExpanded = hamburgerLeft.getAttribute('aria-expanded') === 'true';
  hamburgerLeft.setAttribute('aria-expanded', !isExpanded);
});

// Hamburger menu toggle for right menu
const hamburgerRight = document.querySelector('.hamburger-right');
const navMenuRight = document.querySelector('.nav-menu-right');

hamburgerRight.addEventListener('click', () => {
  hamburgerRight.classList.toggle('active');
  navMenuRight.classList.toggle('active');
  const isExpanded = hamburgerRight.getAttribute('aria-expanded') === 'true';
  hamburgerRight.setAttribute('aria-expanded', !isExpanded);
});

// Close menus when clicking a link
document.querySelectorAll('.nav-menu-left a, .nav-menu-right a').forEach(link => {
  link.addEventListener('click', () => {
    hamburgerLeft.classList.remove('active');
    navMenuLeft.classList.remove('active');
    hamburgerLeft.setAttribute('aria-expanded', 'false');
    hamburgerRight.classList.remove('active');
    navMenuRight.classList.remove('active');
    hamburgerRight.setAttribute('aria-expanded', 'false');
  });
});

// Categories toggle for all sections
document.querySelectorAll('.toggle-categories').forEach(button => {
  const targetId = button.getAttribute('aria-controls');
  const container = document.getElementById(targetId);
  const categories = container.querySelector('.categories');

  button.addEventListener('click', () => {
    container.classList.toggle('expanded');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);

    if (container.classList.contains('expanded')) {
      container.style.maxHeight = `${categories.scrollHeight}px`;
    } else {
      container.style.maxHeight = '0px';
    }
  });
});
