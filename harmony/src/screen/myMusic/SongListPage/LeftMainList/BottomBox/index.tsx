import * as React from 'react';
import './index.scss';
import { connect } from 'react-redux';
import { Input, Modal, Spin, message } from 'antd';
import {
  LoadingOutlined,
  SwapOutlined,
  PlaySquareOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { getUserMusicList } from 'src/api/SongList';

import WhiteScrollBar from 'src/components/WhiteScrollBar';
import BlackListItem from 'src/components/BlackListItem';
import simplifySongListResult from 'src/utils/SongList/simplifySongList';
import { useEffect, useState } from 'react';

import AlbumContext from 'src/store/AlbumStore';
import { getAlbumById } from 'src/api/album';
import {deleteListById,getListSongById} from 'src/api/SongList'
import AddMusicModal from 'src/components/addMusicModal';
import { observer } from 'mobx-react';
import UserContext from 'src/store/UserContext';
import { useNavigate, useNavigation } from 'react-router-dom';
// import { NORMAL_SONGLIST, SongListId } from '@/redux/modules/SongList/constant';

interface BottomBoxProps {
  isLogin: boolean;
  showSubscribeList: boolean;
  currentListId: 1;

  userInfo: { [propName: string]: any };
  selfCreateList: { [propName: string]: any }[];
  subscribeList: { [propName: string]: any }[];
  setTitle: any;

}

interface BottomBoxState {
  showSubscribeList: boolean;
  spinning: boolean;
  currentId: number | null; 
  isModalVisible: boolean;  // 之前添加的属性
  songListTitle: string;  // 添加此行

  contextMenuVisible:boolean;
  contextMenuX: any;
  contextMenuY: any;
  selectedPlaylistId: any;

}

// const [currentId, setCurrentId] = useState(null);
class BottomBox extends React.Component<BottomBoxProps, BottomBoxState> {
  state = {
    showSubscribeList: false,
    spinning: false,
    currentId: null,
    isModalVisible: false,
    songListTitle: '',
    

    contextMenuVisible: false,
    contextMenuX: 0,
    contextMenuY: 0,
    selectedPlaylistId: null
    
  };
  
 
  showContextMenu = (e: { preventDefault: () => void; clientX: any; clientY: any; }, playlistId: any) => {
    
    e.preventDefault();
    console.log('u just right click on ' + playlistId )    
    this.setState({
          contextMenuVisible: true,
          contextMenuX: e.clientX,
          contextMenuY: e.clientY,
          selectedPlaylistId: playlistId
      });
  }

  hideContextMenu = () => {
      this.setState({
          contextMenuVisible: false,
          contextMenuX: 0,
          contextMenuY: 0,
          selectedPlaylistId: null
      });
  }

  handleDelete = () => {
    const { selectedPlaylistId } = this.state;
    if (selectedPlaylistId) {
        deleteListById(selectedPlaylistId);
    }
    this.hideContextMenu();
  }

  handleKeyPress = (e: { key: string; }) => {
      if (e.key === 'Enter') {
          // 这里可以处理保存inputValue到其他地方的逻辑
          // ...
          if(this.props.selfCreateList.length >= 5){
            message.warning('Normal user can only have maximum 5 lists');
          }else{
            this.props.setTitle(this.state.songListTitle)
            this.setState({
              songListTitle: ''
            });
          }
        
      }
  }
  handleInputChange = (e: { target: { value: any; }; }) => {
    this.setState({
      songListTitle: e.target.value
    });
  }
  
  showModal = () => {
    this.setState({
      isModalVisible: true
    });
  }
  
  hideModal = () => {
    this.setState({
      isModalVisible: false
    });
  }
  changeShowListMode = () => {
    // this.props.changeShowSubscribeList();
  };
  judgeShowList = () => {
    const list = this.props.showSubscribeList
      ? this.props.subscribeList
      : this.props.selfCreateList;
    if(list[0]){
      if(list[0].album_id){
        return list.map((val) => (

          <BlackListItem
            key={val.album_id}
            iconBefore={<PlaySquareOutlined />}
            onClick={() => {
              console.log('change song' + val.album_id);
              // Set currentId in the component's state
              this.setState({ currentId: val.album_id });
              
              AlbumContext.setLoadingAlbum(true);
              // Update the current album
              AlbumContext.setCurrentAlbum(val);
            
              // Handle the promise from getAlbumById
              getAlbumById(val.album_id)
                .then(albumSongs => {
                  AlbumContext.setAlbumSongs(albumSongs);
                  console.log(AlbumContext.albumSongs);
                  AlbumContext.setLoadingAlbum(false);
                
                })
                .catch(error => {
                  console.error("Failed to fetch album songs:", error);
                  AlbumContext.setLoadingAlbum(false);
                  
                });
            }}
            className={this.state.currentId === val.album_id ? 'active' : undefined}
          >
            <span>{val.album_name}</span>
          </BlackListItem>
        ));
      }
    }
    return list.map((val) => (

      <BlackListItem
        key={val.Playlist_ID}
        iconBefore={<PlaySquareOutlined />}
        keys={val.Playlist_ID}
        onClick={() => {
          console.log('change song' + val.Playlist_ID);
          // Set currentId in the component's state
          this.setState({ currentId: val.Playlist_ID });
          
          AlbumContext.setLoadingAlbum(true);
          // Update the current album
          AlbumContext.setCurrentAlbum(val);
        
          // Handle the promise from getAlbumById
          getListSongById(val.Playlist_ID)
            .then(albumSongs => {
              console.log("123132" + albumSongs)
              AlbumContext.setAlbumSongs(albumSongs);
              console.log(AlbumContext.albumSongs);
              AlbumContext.setLoadingAlbum(false);
            
            })
            .catch(error => {
              console.error("Failed to fetch album songs:", error);
              AlbumContext.setLoadingAlbum(false);
              
            });
            
        }}
        className={this.state.currentId === val.Playlist_ID ? 'active' : undefined}
      >
        <span>{val.Playlist_Name}</span>
      </BlackListItem>
    ));
    
  };
  createSongList = () => {

    if(this.props.isLogin){
      this.showModal();
    }
  };
  
  render() {
    return (
      <div className="bottom_box">
        <Spin
          spinning={this.state.spinning}
          indicator={
            <LoadingOutlined style={{ fontSize: 24, color: '#fff' }} />
          }
        >

          <div className="title">User PlayList</div>
          <div className="mode_switch">
            <div className="mode_text">
              {this.props.showSubscribeList ? 'Subscribed List' : 'My PlayList'}
            </div>
            {UserContext.isLoggedIn && (
              <div className="switch">
              {/* <ReloadOutlined onClick={() => this.createSongList()} /> */}
              {this.props.showSubscribeList ? <></> : 
              <div className="modal-outside">
                <input 
                    type="text" 
                    id="add" 
                    placeholder='enter new name'
                    value={this.state.songListTitle} 
                    onChange={this.handleInputChange}
                    onKeyPress={this.handleKeyPress} 
                />
                <span className='bar'></span>
                <span className='bar2'></span>
              </div>
              }
         
              <SwapOutlined onClick={this.changeShowListMode} />
              </div>
            )}
              
          </div>
          <div className="bottom_box_list_container">
            {this.props.isLogin ? (
              <WhiteScrollBar fullHeight>{this.judgeShowList()}</WhiteScrollBar>
            ) : (
              <div className="login_tip">
                {/* <span className="underline_button" onClick={this.judgeModal}> */}
                <span className="underline_button" onClick={()=>(message.warning('Please use right header to login!!'))}>
                  Login
                </span>
                &nbsp;for more information
              </div>
            )}
              
          </div>
        </Spin>
      </div>
    );
  }

}


export default observer(BottomBox)