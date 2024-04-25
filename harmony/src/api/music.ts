import { runInAction } from 'mobx';
import UserContext from 'src/store/UserContext';
import {request} from 'src/utils/request';

export function getSongInfo(id: number) {
  return request({
    method: 'GET',
    url: `/music/${id}/s3info/`,
    headers: {
      'Authorization': `token ${UserContext.token}`
    }
  });
}

export function getSongByID(id: number) {
  return request({
    method: 'GET',
    url: `/music/${id}/`,
    headers: {
      'Authorization': `token ${UserContext.token}`
    }
  });
}

export function getSongFile(id: number) {
  return request({
    method: 'GET',
    url: `/music/${id}/s3music/`,
    headers: {
      'Authorization': `token ${UserContext.token}`
    }
  });
}

export function getLyric(id: number) {
  return request({
    method: 'GET',
    url: `/music/${id}/s3lyric/`,
    headers: {
      'Authorization': `token ${UserContext.token}`
    }
  });
}

export function getSongImage(id: number) {
  return request({
    method: 'GET',
    url: `/music/${id}/s3image/`,
    headers: {
      'Authorization': `token ${UserContext.token}`
    }
  });
}

// export function addPlayList(data: object) {
//   return request({
//     method: 'POST',
//     url: '/api/addPlayList',
//     data,
//   });
// }

export function getSongDetails(id: number) {
  return request({
    method: 'GET',
    url: `/music/${id}/details/`,
    headers: {
      'Authorization': `token ${UserContext.token}`
    },
  });
}

export async function getRandom() {
  try {
    const response = await request({
      method: 'GET',
      url: `/music/random-music/`,
      headers: {
        'Authorization': `token ${UserContext.token}`
      }
    });

    console.log(response.data); // 这里你可以直接访问数据
    runInAction(()=>{
      UserContext.setQueue(response.data)
    })
    runInAction(()=>{
      UserContext.setRandom(response.data)
    })

    return response.data; // 如果后续操作还需要数据，你可以返回它，否则这一行是可选的

  } catch (error) {
    console.error("Error fetching and using random:", error);
    throw error; // 抛出错误以供外部捕获，如果需要的话
  }
}

export function removeFav(userId: number, muscId: number) {
  return request({
    method: 'DELETE',
    url: `user/remove-favorite-music/`,
    headers: {
      'Authorization': `token ${UserContext.token}`
    },
    data: {
      user_id: userId,
      music_id:muscId,

    }
  });
}
export function addFav(userId: number, muscId: number) {
  return request({
    method: 'POST',
    url: `user/add_favorite/`,
    headers: {
      'Authorization': `token ${UserContext.token}`
    },
    data: {
      user_id: userId,
      music_id:muscId,

    }
  });
}

export function updateClick(muscId: number) {
  return request({
    method: 'POST',
    url: `music/update_click_count/`,
    data: {
      MusicID: muscId,
    }
  });
}
