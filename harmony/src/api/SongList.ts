import UserContext from 'src/store/UserContext';
import {request} from 'src/utils/request';

export function getUserMusicList(uid: number) {
  return request({
    method: 'GET',
    url: '/user/playlist',
    // params: { uid, limit: 100 },
  });
}

export function getDetailList(
  id: number | string,
  offset?: number,
  limit: number = 20,
) {
  return request({
    method: 'GET',
    url: '/playlist/track/all',
    // params: { id, offset, limit },
  });
}

/**
 * 搜索api
 * @param keyword 搜索关键字
 * @param type 搜索类型
 */
export function searchSong(
  keywords: string,
  type:
    | 1
    | 10
    | 100
    | 1000
    | 1002
    | 1004
    | 1006
    | 1099
    | 1014
    | 1018
    | 2000 = 1,
  offset?: number,
  limit: number = 20,
) {
  return request({
    method: 'GET',
    url: '/search',
    // params: { keywords, type, offset, limit },
  });
}

export function getPersonalFMList() {
  return request({
    method: 'GET',
    url: '/personal_fm',
  });
}

//====================
export async function getUserPlayList(id: number) {
  try {
    const response = await request({
      method: 'GET',
      url: `playlist/${id}/playlists/`,
      headers: {
        'Authorization': `token ${UserContext.token}`
      }
    });

    console.log(response.data); // 这里你可以直接访问数据
  //   runInAction(()=>{
  //     UserContext.setQueue(response.data)
  //   })
  //   runInAction(()=>{
  //     UserContext.setRandom(response.data)
  //   })

    return response.data; // 如果后续操作还需要数据，你可以返回它，否则这一行是可选的

  } catch (error) {
    console.error("Error fetching and using random:", error);
    // throw error; // 抛出错误以供外部捕获，如果需要的话
  }
}

export async function createUserPlayList(id: number, name: string, desc:string) {
  try {
    const response = await request({
      method: 'POST',
      url: `playlist/create/`,
      headers: {
        'Authorization': `token ${UserContext.token}`
      },
      data: {
        User_ID: id,
        Playlist_Name:name,
        Description:desc,
      }
      
    });

    console.log(response.data); // 这里你可以直接访问数据
  //   runInAction(()=>{
  //     UserContext.setQueue(response.data)
  //   })
  //   runInAction(()=>{
  //     UserContext.setRandom(response.data)
  //   })

    return response.data; // 如果后续操作还需要数据，你可以返回它，否则这一行是可选的

  } catch (error) {
    console.error("Error fetching and using random:", error);
    // throw error; // 抛出错误以供外部捕获，如果需要的话
  }
}
export function getListSongById(id: number) {
  return request({
    method: 'GET',
    url: `playlist/${id}/musics/`,
    headers: {
      'Authorization': `token ${UserContext.token}`  
    },
  });
}

export function deleteListById(id: number) {
  return request({
    method: 'DELETE',
    url: `playlist/${id}/delete/`,
    headers: {
      'Authorization': `token ${UserContext.token}`  
    },
  });
}

export async function addMusicIntoPlayList(musicId: number, playListId: number) {
  try {
    const response = await request({
      method: 'POST',
      url: `playlist/add_music/`,
      headers: {
        'Authorization': `token ${UserContext.token}`
      },
      data: {
        music_id: musicId,
        playlist_id:playListId,

      }
      
    });

    console.log(response.data); // 这里你可以直接访问数据

    return response.data; // 如果后续操作还需要数据，你可以返回它，否则这一行是可选的

  } catch (error) {
    console.error("Error fetching and using random:", error);

  }
}

export async function getUserFav(id: number) {
  try {
    const response = await request({
      method: 'GET',
      url: `user/${id}/favorites/`,
      headers: {
        'Authorization': `token ${UserContext.token}`
      }
    });

    console.log(response.data); // 这里你可以直接访问数据
  //   runInAction(()=>{
  //     UserContext.setQueue(response.data)
  //   })
  //   runInAction(()=>{
  //     UserContext.setRandom(response.data)
  //   })

    return response.data; // 如果后续操作还需要数据，你可以返回它，否则这一行是可选的

  } catch (error) {
    console.error("Error fetching and using random:", error);
    // throw error; // 抛出错误以供外部捕获，如果需要的话
  }
}