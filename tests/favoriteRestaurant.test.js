import { addFavorite, removeFavorite, isFavorite } from '../src/scripts/favoriteDatabase';
import Detail from '../src/scripts/view/detail-resto';

const { getAllFavorites } = require('../src/scripts/favoriteDatabase');

// Mock API fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        restaurant: {
          id: 'rqdv5juczeskfw1e867',
          name: 'Test Restaurant',
          description: 'Delicious Food',
          pictureId: '01',
          city: 'City Test',
          rating: 4.5,
          menus: {
            foods: [{ name: 'Pizza' }, { name: 'Burger' }],
            drinks: [{ name: 'Coffee' }, { name: 'Tea' }],
          },
          customerReviews: [
            { name: 'John', review: 'Great food!', date: '2023-11-15' },
          ],
        },
      }),
  })
);

describe('Favorite Restaurant Integration Test', () => {
  const restaurantData = {
    id: 'rqdv5juczeskfw1e867',
    name: 'Test Restaurant',
    description: 'Delicious Food',
    pictureId: '01',
    city: 'City Test',
    rating: 4.5,
  };

  beforeEach(async () => {
    await removeFavorite(restaurantData.id);
  });

  afterEach(async () => {
    await removeFavorite(restaurantData.id);
    jest.clearAllMocks(); // Bersihkan mock fetch setelah setiap pengujian
  });

  it('should be able to add a restaurant to favorites', async () => {
    await addFavorite(restaurantData);

    const isFavoriteRestaurant = await isFavorite(restaurantData.id);
    expect(isFavoriteRestaurant).toBe(true);
  });

  it('should be able to remove a restaurant from favorites', async () => {
    await addFavorite(restaurantData);
    await removeFavorite(restaurantData.id);

    const isFavoriteRestaurant = await isFavorite(restaurantData.id);
    expect(isFavoriteRestaurant).toBe(false);
  });

  it('should not add a restaurant again if it is already in favorites', async () => {
    await addFavorite(restaurantData);
    await addFavorite(restaurantData);

    const allFavorites = await getAllFavorites();
    const favoriteRestaurantCount = allFavorites.filter((restaurant) => restaurant.id === restaurantData.id).length;

    expect(favoriteRestaurantCount).toBe(1);
  });

  it('should display the correct favorite button text', async () => {
    document.body.innerHTML = await Detail.render();
    await Detail.afterRender();

    const favoriteButton = document.getElementById('favoriteButton');
    expect(favoriteButton).not.toBeNull(); // Pastikan tombol ada

    // Pastikan tombol default ke "Tambah ke Favorit"
    expect(favoriteButton.innerText).toBe('Tambah ke Favorit');

    // Simulasikan menambahkan restoran ke favorit
    favoriteButton.click();
    await addFavorite(restaurantData); // Pastikan logika data sinkron
    expect(favoriteButton.innerText).toBe('Hapus dari Favorit');

    // Simulasikan menghapus restoran dari favorit
    favoriteButton.click();
    await removeFavorite(restaurantData.id); // Pastikan logika data sinkron
    expect(favoriteButton.innerText).toBe('Tambah ke Favorit');
  });
});
