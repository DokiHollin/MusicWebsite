


import { makeAutoObservable ,action, observable } from 'mobx';
import { Navigate, RouteObject } from 'react-router-dom';
import { load } from '../router/MyRouter';
import React from "react";
import exp from "constants";
import { Song } from 'src/model/song';
import { updateClick } from 'src/api/music';
import defaultSong from 'src/assets/music/Music/Brea-My-Heart-Dua-Lipa/Break My Heart.png'

class PlayerStore {
  @observable playedSeconds = 0;
  @observable playing = false;
  @observable volume = 0.5;
  @observable duration = 0;
  @observable isCreator = false;
  @observable isLightMode = false;
  @observable showPlayScreen = false;
  @observable currentSong : Song = { Album: 0,
    MusicID: 0,
    Musician: 0,
    Only_for_vip: false,
    S3Image: '',
    S3Info: '',
    S3Lrc: '',
    S3MV: '',
    S3Music: '',
    album_name: '',
    artist_name: '',
    click_count: 0,
    duration: '03:51',
    is_active: false,
    music_name: 'music name',
    name: 'artist name',
  };
  @observable isMyListPage = false;


  constructor() {
    makeAutoObservable(this);


    const currentSongJ = localStorage.getItem('currentSong')
    console.log(currentSongJ)
    this.currentSong = currentSongJ ? JSON.parse(currentSongJ) : []
    const tempMusic : Song ={ Album: 0,
      MusicID: 0,
      Musician: 0,
      Only_for_vip: false,
      S3Image: 'https://elec3609.s3.ap-southeast-2.amazonaws.com/%E5%85%89%E8%BE%89%E5%B2%81%E6%9C%88/ghsy.jpg',
      S3Info: '',
      S3Lrc: 'https://elec3609.s3.ap-southeast-2.amazonaws.com/%E5%85%89%E8%BE%89%E5%B2%81%E6%9C%88/ghsy.lrc',
      S3MV: '',
      S3Music: 'https://elec3609.s3.ap-southeast-2.amazonaws.com/%E5%85%89%E8%BE%89%E5%B2%81%E6%9C%88/ghsy.mp3',
      album_name: '',
      artist_name: 'BYOND',
      click_count: 0,
      duration: '03:51',
      is_active: false,
      music_name: '光辉岁月',
      name: 'artist name',
    };
    if(currentSongJ === null){
      this.currentSong = tempMusic
    }
    fetch('/agreement.txt')
    .then(response => response.text())
    .then(data => {
        // Store into storage
        localStorage.setItem('agreement',data);
    });
    const isMyListPageJ = localStorage.getItem('isMyListPage')
    this.isMyListPage = isMyListPageJ ? JSON.parse(isMyListPageJ) : []

  }


  setPlayedSeconds(seconds: number) {
    this.playedSeconds = seconds;
    localStorage.setItem('currentPlayedSeconds', JSON.stringify(this.playedSeconds))
  }

  togglePlaying(playing: boolean) {
    this.playing = playing;
    localStorage.setItem('currentPlaying', JSON.stringify(this.playing))
  }

  setVolume(volume: number) {
    this.volume = volume;
    localStorage.setItem('currentVolume', JSON.stringify(this.volume))
  }


  setDuration(duration: number) {
    this.duration = duration;
    localStorage.setItem('currentDuration', JSON.stringify(this.duration))
  }

  setExpanded(showPlayScreen: boolean){
    this.showPlayScreen = showPlayScreen;
    localStorage.setItem('showPlayScreen', JSON.stringify(this.showPlayScreen))
  }

  setLightMode(isLightMode: boolean){
    this.isLightMode = isLightMode;
    localStorage.setItem('isLightMode', JSON.stringify(this.isLightMode))
  }
  secondsToMinSec(seconds: number) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    // 确保秒数始终为两位
    let secStr = sec < 10 ? '0' + sec : sec;

    return `${min}:${secStr}`;
  }
  // @action
  // setCurrentSong(song: Song){
  //   let audio = new Audio(song.S3Music);
  //   let stringDuration: string;
  //   audio.addEventListener('loadedmetadata', function() {
  //       let duration = audio.duration;
  //       console.log(secondsToMinSec(duration));
  //       stringDuration = secondsToMinSec(duration)
  //       console.log('the time length of the song is: ' + stringDuration)
  //   });

  //   // 之前提供的转换函数
  //   function secondsToMinSec(seconds: number) {
  //       let min = Math.floor(seconds / 60);
  //       let sec = Math.floor(seconds % 60);
  //       let secStr = sec < 10 ? '0' + sec : sec;
  //       return `${min}:${secStr}`;
  //   }

  //   const temp : Song ={
  //     Album: song.Album,
  //     MusicID: song.MusicID,
  //     Musician: song.Musician,
  //     Only_for_vip: song.Only_for_vip,
  //     S3Image: song.S3Image,
  //     S3Info: song.S3Info,
  //     S3Lrc: song.S3Lrc,
  //     S3MV: song.S3MV,
  //     S3Music: song.S3Music,
  //     album_name: song.album_name,
  //     artist_name: song.artist_name,
  //     click_count: song.click_count,
  //     duration: song.duration,
  //     is_active: song.is_active,
  //     music_name: song.music_name,
  //     name: song.artist_name,
  //   };
  //   //this.secondsToMinSec((new Audio(song.S3Music)).duration),
    
  //   this.currentSong = temp;
  //   localStorage.setItem('currentSong', JSON.stringify(temp))
  //   this.togglePlaying(true);
  //   if(song.MusicID){
  //     updateClick(song.MusicID);
  //     // console.log('counter++')
  //   }else{
  //     // console.log('l ' + song.MusicID )
  //   }
    
  // }
  @action
setCurrentSong(song: Song) {
    let audio = new Audio(song.S3Music);

    audio.addEventListener('loadedmetadata', () => { // 使用箭头函数以保留this的引用
        let duration = audio.duration;
        console.log(secondsToMinSec(duration));
        let stringDuration = secondsToMinSec(duration);
        console.log('the time length of the song is: ' + stringDuration);

        const temp : Song = {
            ...song,  // 使用展开运算符复制所有的song属性
            duration: stringDuration,
        };

        this.currentSong = temp;
        localStorage.setItem('currentSong', JSON.stringify(temp))
        this.togglePlaying(true);
        if(song.MusicID) {
            updateClick(song.MusicID);
            // console.log('counter++')
        } else {
            // console.log('l ' + song.MusicID )
        }
    });

    // 之前提供的转换函数
    function secondsToMinSec(seconds: number) {
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        let secStr = sec < 10 ? '0' + sec : sec;
        return `${min}:${secStr}`;
    }

    // 如果立即需要某些逻辑（例如开始音频加载），你可以在此处放置，但与duration相关的逻辑应放在上面的回调中
}


  setIsMyListPage(isMyListPage: boolean){
    this.isMyListPage = isMyListPage;
    localStorage.setItem('isMyListPage', JSON.stringify(this.isMyListPage))
  }

  // 动态路由：组合静态 + 动态部分
  get routes() {
    const staticRoutes: RouteObject[] = [
      { path: '/login', element: load('login/Login') },
      { path: '/vip', element: load('profile/vip') },
      { path: '/login', element: load('Login') },
      { path: '/edit-profile', element: load('profile/EditProfile') },
      { path: '/playscreen', element: load('PlayScreen'), children: [] },
      { path: '/registration', element: load('login/Registration') },
      { path: '/forgot', element: load('login/Forgot') },
      { path: '/verify', element: load('login/Verify') },
      { path: '/search', element: load('Search') },
      { path: '/album/:albumId', element: load('Album') },
      { path: '/artist/:artistId', element: load('Artist') },
      { path: '/playscreen', element: load('playscreen'), children: [] },
      { path: '/', element: load('main/Homepage') },
      { path: '/creatorCenter', element: load('musician/creatorCenter') },
      { path: '/applyArtistPreSite', element: load('musician/ApplyArtistPreSite') },
      { path: '/applyForm', element: load('musician/ApplyForm') },
      { path: '/myMusic', element: load('myMusic/MyMusic') },
      {
        path: '/menuPage',
        element: load('MenuPage'),
        children: [
          { path: 'becomeMusician', element: load('layout/becomeMusician') },
          { path: 'contact', element: load('layout/contact') },
          { path: 'organization', element: load('layout/organization') },
          { path: 'whatNext', element: load('layout/whatNext') },
          // 你可以继续添加其他子路由
        ]
      },
      { path: '/uploadSong', element: load('uploadMusic/UploadSong')},
      { path: '/admin', element: load('admin/Admin')},
      { path: '/profile', element: load('profile/Profile') },
      { path: '/profile/:userId', element: load('profile/Profile') },
      { path: '/Followers/:userId', element: load('profile/Followers') },
      { path: '/Following/:userId', element: load('profile/Following') },
      { path: '/Moments', element: load('profile/Moments') },
      { path: '/songList', element: load('songList/index') },
      { path: '/*', element: <Navigate to={'/404'}></Navigate> },
    ]


    return staticRoutes
  }

  reset() {

    localStorage.removeItem('playedSeconds')
    this.playedSeconds = 0

    localStorage.removeItem('playing')
    this.playing = false

    localStorage.removeItem('volume')
    this.volume = 0

    localStorage.removeItem('duration')
    this.duration = 0

    localStorage.removeItem('isCreator')
    this.isCreator = false

    localStorage.removeItem('isLightMode')
    this.isLightMode = false

    localStorage.removeItem('showPlayScreen')
    this.showPlayScreen = false

    localStorage.removeItem('currentSong')
    this.currentSong  = { Album: 0,
      MusicID: 0,
      Musician: 0,
      Only_for_vip: false,
      S3Image: '',
      S3Info: '',
      S3Lrc: '',
      S3MV: '',
      S3Music: '',
      album_name: '',
      artist_name: '',
      click_count: 0,
      duration: '03:51',
      is_active: false,
      music_name: 'music name',
      name: 'artist name',
    };

    localStorage.removeItem('isMyListPage')
    this.isMyListPage = false



  }
}


const PlayerContext = new PlayerStore();
export default PlayerContext;

