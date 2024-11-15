import { getAllFavorites } from '../favoriteDatabase';

const Favorite = {
  async render() {
    return `
      <section id="favoritePage">
        <header class="main-header">
          <h1 class="main-title" tabindex="0">Favorite Restaurants</h1>
        </header>
        <div id="loadingSpinner" class="loading-spinner" style="display: none;">
          <div class="spinner"></div>
        </div>
        <div id="favoriteList" class="restaurant-list" tabindex="-1"></div>
      </section>
    `;
  },

  async afterRender() {
    const favoriteListElement = document.getElementById('favoriteList');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Show loading spinner
    const showLoading = () => {
      loadingSpinner.style.display = 'flex';
    };

    // Hide loading spinner
    const hideLoading = () => {
      loadingSpinner.style.display = 'none';
    };

    showLoading();

    try {
      const favorites = await getAllFavorites();
      hideLoading();

      if (favorites.length === 0) {
        favoriteListElement.innerHTML = '<p>No favorite restaurants found.</p>';
      } else {
        favoriteListElement.innerHTML = favorites.map((restaurant) => `
          <div class="restaurant-item">
            <img class="restaurant-image" src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="Image of ${restaurant.name}" loading="lazy" tabindex="0" />
            <div class="restaurant-content">
              <h2 class="restaurant-name" tabindex="0">${restaurant.name}</h2>
              <p class="restaurant-city" tabindex="0"><strong>City:</strong> ${restaurant.city}</p>
              <p class="restaurant-rating" tabindex="0"><strong>Rating:</strong> ${restaurant.rating}</p>
              <h2><a href="/#/detail/${restaurant.id}">Lihat Detail</a></h2>
            </div>
          </div>
        `).join('');
        favoriteListElement.setAttribute('tabindex', '0'); // Ensure it's focusable when populated
        favoriteListElement.focus();
      }
    } catch (error) {
      hideLoading();
      console.error('Error fetching favorites:', error);
      favoriteListElement.innerHTML = '<p>Failed to load favorite restaurants. Please try again later.</p>';
    }
  }
};

export default Favorite;
