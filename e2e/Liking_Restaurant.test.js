Feature('Favorite a Restaurant');

Scenario('should allow the user to like and unlike a restaurant', ({ I }) => {
  // Buka halaman utama aplikasi
  I.amOnPage('/');

  // Buka halaman detail restoran pertama
  I.click('.restaurant-item a');

  // Pastikan halaman detail terbuka
  I.seeInCurrentUrl('/#/detail/');
  I.seeElement('#restaurantDetailContainer');

  // Tombol menyukai restoran (Add to Favorite)
  I.seeElement('#favoriteButton');
  I.click('#favoriteButton');

  // Pastikan tombol berubah menjadi "Hapus dari Favorit"
  I.see('Hapus dari Favorit', '#favoriteButton');

  // Kembali ke halaman favorit
  I.amOnPage('/#/favorite');

  // Pastikan restoran yang disukai muncul di daftar favorit
  I.seeElement('.restaurant-item');

  // Buka kembali detail restoran dari daftar favorit
  I.click('.restaurant-item a');

  // Pastikan tombol favorit di detail restoran
  I.see('Hapus dari Favorit', '#favoriteButton');
  I.click('#favoriteButton');

  // Pastikan tombol berubah menjadi "Tambah ke Favorit" setelah batal suka
  I.see('Tambah ke Favorit', '#favoriteButton');

  // Kembali ke halaman favorit untuk memastikan restoran sudah tidak ada
  I.amOnPage('/#/favorite');
  I.dontSeeElement('.restaurant-item');
});
