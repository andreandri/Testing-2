const RestaurantList = {
  async render() {
    return `
     <section id="homePage">
        <section class="hero">
          <picture>
            <source media="(max-width: 600px)" srcset="/images/heros/hero-image_2-small.jpg">
            <source media="(min-width: 601px)" srcset="/images/heros/hero-image_2-large.jpg">
            <img src="public/images/heros/hero-image_2-large.jpg" alt="Delicious Food" class="hero-img" tabindex="0">
          </picture>
        </section>
        <header class="main-header">
          <h1 class="main-title" tabindex="0">List Restaurant</h1>
        </header>
        <div id="loadingSpinner" class="loading-spinner" style="display: none;">
          <div class="spinner"></div>
        </div>
        <div id="restaurantList" class="restaurant-list" tabindex="-1"></div>
      </section>
    `;
  },

  async afterRender() {
    const restaurantListElement = document.getElementById('restaurantList');
    const loadingSpinner = document.getElementById('loadingSpinner');

    const showLoading = () => {
      loadingSpinner.style.display = 'flex';
    };

    const hideLoading = () => {
      loadingSpinner.style.display = 'none';
    };

    showLoading();

    try {
      const response = await fetch('https://restaurant-api.dicoding.dev/list');
      const data = await response.json();

      if (data.restaurants && data.restaurants.length > 0) {
        restaurantListElement.innerHTML = data.restaurants.map((restaurant) => `
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
      } else {
        restaurantListElement.innerHTML = '<p>No restaurants available.</p>';
      }
    } catch (error) {
      console.error('Error loading restaurant list:', error);
      restaurantListElement.innerHTML = '<p>Error loading restaurant list.</p>';
    } finally {
      hideLoading();
    }
  }
};

export default RestaurantList;




const displayRestaurantList = async () => {
  const loadingSpinner = document.getElementById('loadingSpinner');
  const restaurantListElement = document.getElementById('restaurantList');

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
    const response = await fetch('https://restaurant-api.dicoding.dev/list');
    const data = await response.json();

    restaurantListElement.innerHTML = data.restaurants.map((restaurant) => `
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
  } catch (error) {
    console.error('Error loading restaurant list:', error);
    restaurantListElement.innerHTML = '<p>Error loading restaurant list.</p>';
  } finally {
    hideLoading(); // Make sure to hide loading spinner in all cases
  }
};
