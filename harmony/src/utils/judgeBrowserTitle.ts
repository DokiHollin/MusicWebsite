import { createHashHistory } from 'history';
import setBrowserTitle from './setBrowserTitle';

export default function judgeBrowserTitle(title?: string) {
  const history = createHashHistory();
  const pathArray = history.location.pathname.split('/');
  pathArray.shift();
  switch (pathArray[0]) {
    case 'SongList':
      setBrowserTitle('Song List');
      break;
    case 'music':
      if (title) setBrowserTitle(title);
      else setBrowserTitle('Song Informations');
      break;

    default:
      setBrowserTitle("Music Website");
      break;
  }
}
