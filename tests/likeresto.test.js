import { addFavorite, removeFavorite, isFavorite, getAllFavorites } from '../src/scripts/favoriteDatabase';

describe('Favorite Restaurant Integration Test', () => {
  const restaurantData = {
    id: 'rqdv5juczeskfw1e867',
    name: 'The Best Restaurant',
    city: 'Jakarta',
    rating: 4.5,
    pictureId: '1',
  };

  beforeEach(async () => {
    // Kosongkan data favorit sebelum setiap tes
    const favorites = await getAllFavorites();
    for (const favorite of favorites) {
      await removeFavorite(favorite.id);
    }
  });

  test('Should be able to add a restaurant to favorites', async () => {
    await addFavorite(restaurantData);

    const isFavorited = await isFavorite(restaurantData.id);
    expect(isFavorited).toBeTruthy();
  });

  test('Should be able to remove a restaurant from favorites', async () => {
    await addFavorite(restaurantData);
    await removeFavorite(restaurantData.id);

    const isFavorited = await isFavorite(restaurantData.id);
    expect(isFavorited).toBeFalsy();
  });

  test('Should not contain the restaurant in favorites after removal', async () => {
    await addFavorite(restaurantData);
    await removeFavorite(restaurantData.id);

    const favorites = await getAllFavorites();
    expect(favorites).not.toContainEqual(restaurantData);
  });

  test('Should contain the restaurant in favorites after adding', async () => {
    await addFavorite(restaurantData);

    const favorites = await getAllFavorites();
    expect(favorites).toContainEqual(restaurantData);
  });
});
