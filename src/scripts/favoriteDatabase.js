import Dexie from 'dexie';

const db = new Dexie('FavoriteRestaurantDB');
db.version(1).stores({
  favorites: 'id, name, city, rating, pictureId',
});

export const addFavorite = async (restaurant) => {
  await db.favorites.put(restaurant);
};

export const removeFavorite = async (id) => {
  await db.favorites.delete(id);
};

export const isFavorite = async (id) => {
  const restaurant = await db.favorites.get(id);
  return !!restaurant;
};

export const getAllFavorites = async () => {
  return await db.favorites.toArray();
};
