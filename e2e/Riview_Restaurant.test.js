
const assert = require('assert');

Feature('Review a Restaurant');

Before(({ I }) => {
  // Membuka halaman utama
  I.amOnPage('/');
});

Scenario('should allow the user to add a review to a restaurant', async ({ I }) => {
  const reviewName = 'E2E Test User';
  const reviewContent = 'Ini adalah review dari E2E test';

  // Buka halaman detail restoran pertama
  I.seeElement('.restaurant-item a');
  I.click(locate('.restaurant-item a').first());

  // Pastikan halaman detail terbuka
  I.seeInCurrentUrl('/#/detail/');
  I.seeElement('#restaurantDetailContainer');

  // Mengisi form review
  I.fillField('#reviewName', reviewName);
  I.fillField('#reviewContent', reviewContent);
  I.click('Kirim Review');

  // Tunggu hingga review terbaru muncul di daftar review
  I.waitForElement('.review-item', 5);

  // Verifikasi bahwa review terakhir sesuai dengan yang ditambahkan
  const lastReviewText = await I.grabTextFrom(locate('.review-item').last());
  assert(lastReviewText.includes(reviewName), 'Nama reviewer tidak sesuai');
  assert(lastReviewText.includes(reviewContent), 'Konten review tidak sesuai');
});
