import 'regenerator-runtime';
import '../styles/main.css';
import swRegister from './utils/sw-register';
import UrlParser from './routes/url-parsel';
import routes from './routes/routes';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

const initializeNavigation = () => {
  const hamburgerButton = document.getElementById('hamburger');
  const navigationMenu = document.getElementById('navigation-menu');

  if (hamburgerButton && navigationMenu) {
    const toggleNavigationMenu = () => {
      navigationMenu.classList.toggle('show');
    };
    hamburgerButton.addEventListener('click', toggleNavigationMenu);
  }
};

const loadPage = async () => {
  const url = UrlParser.parseActiveUrlWithCombiner();
  const page = routes[url];
  const mainContent = document.getElementById('main-content');

  mainContent.innerHTML = ''; // Kosongkan konten lama
  mainContent.innerHTML = await page.render(); // Render konten halaman baru
  await page.afterRender();
};

const skipLinkElem = document.querySelector('.skip-to-content');
skipLinkElem.addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('#main-content').focus();
});

window.addEventListener('load', () => {
  swRegister();
  initializeNavigation();
  loadPage();
});

window.addEventListener('hashchange', loadPage);