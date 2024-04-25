import * as React from 'react';
import { connect } from 'react-redux';
import { Input, InputRef, message,Button } from 'antd';
// import { history } from 'umi';
import './index.scss';

import { LeftOutlined } from '@ant-design/icons'; // 导入左箭头图标
import {
  CaretRightOutlined,
  HeartOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import BlackListItem from 'src/components/BlackListItem';
import PlayerContext from 'src/store/PlayerContext';
import UserContext from 'src/store/UserContext';
import { getUserFav } from 'src/api/SongList';
import AlbumContext from 'src/store/AlbumStore';
import image from 'src/assets/images/bg/fav.png'

interface TopBoxProps {
  userInfo?: { [propName: string]: any };
  currentListId: 1
  favoriteMusic: { [propName: string]: any } | null;
}

interface TopBoxState {}
const Favjson = {
  "album_id": 999,
  "musician": UserContext.userID,  
  "album_name": "My Favorite",
  "release_date": "1",
  "genre": "fav",
  "album_picture_url": image,  // 您没有提供值，因此这里是空字符串
  "bio": "favorite",                
  "musician_name": "zechao"       
}

class TopBox extends React.Component<TopBoxProps, TopBoxState> {
  state = {};

  InputRef: React.RefObject<InputRef> | null = React.createRef<InputRef>();

  judgeActive = (id: string): string => {
    let cId = this.props.currentListId;
    // return cId.type === id ? 'active' : '';
    return '1'
  };

  goSearch = () => {
    if (this.InputRef?.current!.input!.value.length) {
      message.success('Still in developing')
    } else {
      message.warning('Cannot be empty');
    }
  };

  render() {
    return (
      <div className="top_box">
        <Button 
          icon={<LeftOutlined />} 
          onClick={() => PlayerContext.setIsMyListPage(false)}
          style={{
              background: 'none',      // 移除背景
              border: 'none',          // 移除边框
              color: 'inherit',        // 使用父级元素的文字颜色
              marginRight: '15vw', 
              marginTop: '-10%',
              boxShadow: 'none'        // 移除阴影
          }}
        >
            Back
        </Button>
      {UserContext.isLoggedIn && (
        <div> 
            <Input
          className="black_input_addon"
          placeholder="Search..."
          ref={this.InputRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') this.goSearch();
          }}
          addonAfter={<SearchOutlined onClick={() => this.goSearch()} />}
        ></Input>
        <BlackListItem
          iconBefore={<SearchOutlined />}
          // className={this.judgeActive(SEARCH_KEYWORD)}
          // onClick={() => this.props.changeSongListId({ type: SEARCH_KEYWORD })}
          // onClick={()=>PlayerContext.setIsMyListPage(false)}
          onClick={()=>message.success('Still in developing')}
        >
          <span>Search</span>
        </BlackListItem>
        <BlackListItem
          iconBefore={<HeartOutlined />}
          className={this.judgeActive("FAVORITE")}
    
          onClick={() =>{
  
           AlbumContext.setLoadingAlbum(true);
            const list = getUserFav(Number(UserContext.userID));
            
            list.then(data => {
                console.log(data);  // 输出 fetch 返回的实际数据
                // If you want to update the AlbumContext with this data, you can do it here
                UserContext.setMyFav(data)
               
                AlbumContext.setCurrentAlbum(Favjson)
                AlbumContext.setAlbumSongs(data)
                console.log(AlbumContext.albumSongs)
                // console.log(JSON.parse(JSON.stringify(data)))
                console.log(AlbumContext.selectedAlbum)
                AlbumContext.setLoadingAlbum(false);
            });
            

          }}
        >
          <span>My Fav</span>
        </BlackListItem>
        <BlackListItem
          iconBefore={<CaretRightOutlined />}
          onClick={() => {
            // if (this.props.currentSong) history.push('/music');
            
              // if (true) history.push('/music');
            PlayerContext.setExpanded(true)
   
          }}
        >
          <span >Now Playing</span>
        </BlackListItem>

        </div>
      )}
        
      </div>
    );
  }
}


export default TopBox