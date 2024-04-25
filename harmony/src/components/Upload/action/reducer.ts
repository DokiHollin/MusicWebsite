import { BACKGROUND } from 'src/constant/LocalStorage';
import ImageBase64ToBlobServer from 'src/utils/ImageBase64ToBlobServer';

const initUrl = ImageBase64ToBlobServer(localStorage.getItem(BACKGROUND));
const initImg = require('src/assets/images/bg/bg.jpg');

const initState = {
  bgPath: initUrl ? initUrl : require('src/assets/images/bg/bg.jpg'),
  filter: false,
  mask: false,
  pathChangeId: 0,
};

export default function ChangeBG(
  prevState = initState,
  action: { [propName: string]: any },
) {
  const { type, data } = action;
  let newState = { ...prevState };

  switch (type) {
    case 'ChangeBackground':
      if (data) {
        if (prevState.bgPath != data) {
          newState.bgPath = data;
          newState.pathChangeId = +new Date();
        }
      } else {
        const localImg = localStorage.getItem(BACKGROUND);
        if (localImg) {
          newState.bgPath = ImageBase64ToBlobServer(localImg);
        } else {
          newState.bgPath = initImg;
        }
      }
      return newState;
    case 'SwitchFilter':
      newState.filter = data;
      return newState;
    case 'SwitchMask':
      newState.mask = data;
      return newState;
    default:
      return prevState;
  }
}
