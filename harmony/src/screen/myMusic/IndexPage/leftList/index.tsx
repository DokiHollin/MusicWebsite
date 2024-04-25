import './index.scss';
import TransparentBox1 from 'src/components/transparentBox1';
import PlayList from 'src/components/MusicPlayer/playList/index';
import { useEffect } from 'react';
import axios from 'axios';
import UserContext from 'src/store/UserContext';
import { message } from 'antd';
import { observer } from 'mobx-react-lite';
import PlayerContext from 'src/store/PlayerContext';
import { toJS } from 'mobx';

function LeftList(props: any) {
  let playQueue: {
    id: any; // 转换为字符串，以匹配你给出的示例
    name: any;
  }[] = [
  ];
  console.log(UserContext.random)
  console.log(toJS(UserContext.playingQueue).songs)
  if(Array.isArray(UserContext.playingQueue.songs) &&  UserContext.playingQueue !== null){
    try{
      playQueue = toJS(UserContext.playingQueue).songs.map((item: { MusicID: { toString: () => any; }; music_name: any; }) => ({
        id: item.MusicID.toString(),  // 转换为字符串，以匹配你给出的示例
        name: item.music_name
      }));
    }catch{
      playQueue = toJS(UserContext.playingQueue).songs.map((item: any) => ({
        id: item.id,  // 转换为字符串，以匹配你给出的示例
        name: item.name
      }));
    }
    
  }
  
  const current = {
    
      id: PlayerContext.currentSong.MusicID,
      name: PlayerContext.currentSong.music_name,
    
  }
  // console.log(temp)

  
  const currentSong = {
    id: "3",
    name: "Song 3",
    artist: "Artist 3", // 这是一个额外的字段，你可以根据需要增加或移除字段
    album: "Album 3"
  };
  
  return (
    <div className="left_list h100">
      <TransparentBox1 title="Playing Queue">
        <PlayList hideButton={true} currentSong={current} playQueue={playQueue} disabledDragable={false} />
      </TransparentBox1>
    </div>
  );
}

export default observer(LeftList);
