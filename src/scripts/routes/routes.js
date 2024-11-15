import ListResto from '../view/list-resto';
import Favorite from '../view/favorite';
import Detail from '../view/detail-resto';

const routes = {
  '/': ListResto,
  '/favorite': Favorite,
  '/detail/:id': Detail,
};

export default routes;
