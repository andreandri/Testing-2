import { addFavorite, removeFavorite, isFavorite } from '../favoriteDatabase';

const Detail = {
  async render() {
    return `
      <section id="detailPage">
        <div id="restaurantDetailContainer">
          <div id="loadingSpinner" class="loading-spinner" style="display: none;">
            <div class="spinner"></div>
          </div>
          <div id="restaurantDetail" class="restaurant-detail"></div>
          <div id="reviewFormContainer">
            <h3>Tambahkan Review Anda</h3>
            <form id="reviewForm">
              <input type="text" id="reviewName" placeholder="Nama" required />
              <textarea id="reviewContent" placeholder="Tulis review Anda" required></textarea>
              <button type="submit">Kirim Review</button>
            </form>
          </div>
          <div id="reviewListContainer">
            <h3>Reviews</h3>
            <div id="reviewList" class="review-list"></div>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const url = window.location.hash;
    const restaurantId = url.split('/')[2];
    const restaurantDetail = document.getElementById('restaurantDetail');
    const reviewListElement = document.getElementById('reviewList');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Show loading spinner
    const showLoading = () => {
      loadingSpinner.style.display = 'flex';
    };

    // Hide loading spinner
    const hideLoading = () => {
      loadingSpinner.style.display = 'none';
    };

    // Fetch detail restoran
    const fetchRestaurantDetail = async () => {
      showLoading();
      try {
        const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${restaurantId}`);
        const data = await response.json();
        hideLoading();

        if (data && data.restaurant) {
          const restaurant = data.restaurant;
          restaurantDetail.innerHTML = `
            <h2>${restaurant.name}</h2>
            <img src="https://restaurant-api.dicoding.dev/images/large/${restaurant.pictureId}" alt="Image of ${restaurant.name}" loading="lazy" />
            <p><strong>Address:</strong> ${restaurant.address}</p>
            <p><strong>City:</strong> ${restaurant.city}</p>
            <p>${restaurant.description}</p>
            <h3>Menu</h3>
            <p><strong>Foods:</strong> ${restaurant.menus.foods.map((food) => food.name).join(', ')}</p>
            <p><strong>Drinks:</strong> ${restaurant.menus.drinks.map((drink) => drink.name).join(', ')}</p>
            <button id="favoriteButton" class="favorite-button">Add to Favorite</button>
          `;

          // Tampilkan daftar review
          reviewListElement.innerHTML = restaurant.customerReviews.map((review) => `
            <div class="review-item">
              <p><strong>${review.name}</strong></p>
              <p>${review.review}</p>
              <p><em>${review.date}</em></p>
            </div>
          `).join('');

          // Setup tombol favorite
          const favoriteButton = document.getElementById('favoriteButton');
          if (await isFavorite(restaurantId)) {
            favoriteButton.innerText = 'Hapus dari Favorit';
          }
          favoriteButton.addEventListener('click', async () => {
            if (await isFavorite(restaurantId)) {
              await removeFavorite(restaurantId);
              favoriteButton.innerText = 'Tambah ke Favorit';
            } else {
              await addFavorite(restaurant);
              favoriteButton.innerText = 'Hapus dari Favorit';
            }
          });
        } else {
          restaurantDetail.innerHTML = '<p>Detail restoran tidak ditemukan.</p>';
        }
      } catch (error) {
        console.error('Error fetching restaurant detail:', error);
        restaurantDetail.innerHTML = '<p>Terjadi kesalahan saat memuat detail restoran.</p>';
        hideLoading();
      }
    };

    // Panggil fetchRestaurantDetail untuk pertama kali
    await fetchRestaurantDetail();

    // Fungsi untuk mengirim review ke API
    const addReview = async (reviewData) => {
      showLoading();
      try {
        const response = await fetch('https://restaurant-api.dicoding.dev/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData),
        });

        if (response.ok) {
          await fetchRestaurantDetail(); // Refresh detail restoran untuk memperbarui daftar review
        } else {
          console.error('Failed to add review');
        }
      } catch (error) {
        console.error('Error adding review:', error);
      }
      hideLoading();
    };

    // Event listener untuk form submit
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const reviewerName = document.getElementById('reviewName').value;
      const reviewContent = document.getElementById('reviewContent').value;

      if (reviewerName && reviewContent) {
        const reviewData = {
          id: restaurantId,
          name: reviewerName,
          review: reviewContent,
        };

        // Kirim review ke API
        await addReview(reviewData);

        // Kosongkan form setelah review berhasil ditambahkan
        reviewForm.reset();
      }
    });
  }
};

export default Detail;
