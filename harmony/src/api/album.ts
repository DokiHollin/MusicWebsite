import { runInAction } from 'mobx';
import UserContext from 'src/store/UserContext';
import {request} from 'src/utils/request';

export async function getUserAlbums(id: number) {
    try {
      const response = await request({
        method: 'GET',
        url: `album/musician/${id}/albums/`,
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
  export function getAlbumById(id: number) {
    return request({
      method: 'GET',
      url: `album/list-music-by-album/${id}/`,
      headers: {
        'Authorization': `token ${UserContext.token}`  
      },
    });
  }
  export async function getAlumsByUserID(id: number) {
    try {
      const response = await request({
        method: 'GET',
        url: `album/musician/${id}/albums/`,
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
 