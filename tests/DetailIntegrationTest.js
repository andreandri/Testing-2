// DetailIntegrationTest.js
import { addFavorite, removeFavorite, isFavorite } from '../src/scripts/favoriteDatabase';
import Detail from '../src/scripts/view/detail-resto';

describe('Integration Test - Favorite Restaurant', () => {
  const restaurant = {
    id: 'restaurant-1',
    name: 'Test Restaurant',
    city: 'Test City',
    pictureId: 'test-picture',
    rating: 4.5,
    description: 'Test Description',
  };

  beforeEach(() => {
    document.body.innerHTML = Detail.render();
  });

  afterEach(async () => {
    await removeFavorite(restaurant.id); // Bersihkan data setelah setiap tes
  });

  test('Menambahkan restoran ke favorit', async () => {
    await Detail.afterRender();

    const favoriteButton = document.getElementById('favoriteButton');
    favoriteButton.click(); // Klik untuk menambahkan ke favorit

    expect(await isFavorite(restaurant.id)).toBeTruthy(); // Harus true setelah ditambahkan
    expect(favoriteButton.innerText).toBe('Hapus dari Favorit'); // Tombol harus berubah menjadi "Hapus dari Favorit"
  });

  test('Menghapus restoran dari favorit', async () => {
    await addFavorite(restaurant); // Tambahkan ke favorit dulu
    await Detail.afterRender();

    const favoriteButton = document.getElementById('favoriteButton');
    favoriteButton.click(); // Klik untuk menghapus dari favorit

    expect(await isFavorite(restaurant.id)).toBeFalsy(); // Harus false setelah dihapus
    expect(favoriteButton.innerText).toBe('Tambah ke Favorit'); // Tombol harus berubah menjadi "Tambah ke Favorit"
  });
});
