import { runInAction } from 'mobx';
import UserContext from 'src/store/UserContext';
import {request} from 'src/utils/request';

export function getSongByID(ids: number) {
    return request({
      method: 'GET',
      url: '/song/detail',
   
    });
  }