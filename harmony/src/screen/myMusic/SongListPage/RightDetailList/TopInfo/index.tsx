import * as React from 'react';
import { connect } from 'react-redux';
import { PlaySquareOutlined } from '@ant-design/icons';
import './index.scss';

import SongListCoverImg from './CoverImg';
import TransparentButton2 from 'src/components/transparentButton2';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { observer } from 'mobx-react';
import UserContext from 'src/store/UserContext';
import AlbumContext from 'src/store/AlbumStore';
import { toJS } from 'mobx';
import { message } from 'antd';
// import { playSongList } from '@/redux/modules/SongList/action';

interface TopInfoProps {
  // playSongList: Function;
  currentDetailListInfo: { [propName: string]: any };
  name: string;
  description: string;
  currentListId: string | number | any;
}

interface TopInfoState {}
@observer
class TopInfo extends React.Component<TopInfoProps, TopInfoState> {
  state = {};
  render() {
    const selectAlbum = toJS(this.props.currentDetailListInfo)
      ? this.props.currentDetailListInfo
      : {
          id: -2,
          name: 'Search Result',
          cancelRenderOperation: true,
        };
        console.log(selectAlbum)

    if(selectAlbum.first_song_image){
      return (
        <TransitionGroup
          className="h30 por"
          childFactory={(child) =>
            React.cloneElement(child, { classNames: 'info' })
          }
        >
          <CSSTransition
            key={
              this.props.currentListId.id
                ? this.props.currentListId.id
                : this.props.currentListId
            }
            timeout={1200}
            appear={true}
          >
            <div className="top_info">
          
              <SongListCoverImg
              style={{ backgroundImage: `url(${selectAlbum.first_song_image})` }}
              />
            
            <div className="operation_box">
              <div className="text">
                <div className="title">{selectAlbum.Playlist_Name}</div>
                <div className="description">{selectAlbum.Description}</div>
              </div>
              <div
                className="operation"
                // onClick={() => this.props.playSongList(undefined, _.id)}
                onClick={() => 
                  (JSON.parse(JSON.stringify(AlbumContext.albumSongs)).data ? UserContext.setQueue(JSON.parse(JSON.stringify(AlbumContext.albumSongs)).data) : UserContext.setQueue(toJS(AlbumContext.albumSongs))
                    ,message.success('change queue successfully')
                  )}
              >
                {selectAlbum.cancelRenderOperation ? undefined : (
                  <TransparentButton2 iconBefore={<PlaySquareOutlined />}>
                    Set to play Queue
                  </TransparentButton2>
                )}
              </div>
            </div>
         
              
            </div>
          </CSSTransition>
        </TransitionGroup>
      );
    }else{
      return (
        <TransitionGroup
          className="h30 por"
          childFactory={(child) =>
            React.cloneElement(child, { classNames: 'info' })
          }
        >
          <CSSTransition
            key={
              this.props.currentListId.id
                ? this.props.currentListId.id
                : this.props.currentListId
            }
            timeout={1200}
            appear={true}
          >
            <div className="top_info">
          
              <SongListCoverImg
              style={{ backgroundImage: `url(${selectAlbum.album_picture_url})` }}
              />
            
            <div className="operation_box">
              <div className="text">
                <div className="title">{selectAlbum.album_name}</div>
                <div className="description">{selectAlbum.bio}</div>
              </div>
              <div
                className="operation"
                // onClick={() => this.props.playSongList(undefined, _.id)}
                onClick={() => 
                  (JSON.parse(JSON.stringify(AlbumContext.albumSongs)).data ? UserContext.setQueue(JSON.parse(JSON.stringify(AlbumContext.albumSongs)).data) : UserContext.setQueue(toJS(AlbumContext.albumSongs))
                    ,message.success('change queue successfully')
                  )}
              >
                {selectAlbum.cancelRenderOperation ? undefined : (
                  <TransparentButton2 iconBefore={<PlaySquareOutlined />}>
                    Set to play Queue
                  </TransparentButton2>
                )}
              </div>
            </div>
         
              
            </div>
          </CSSTransition>
        </TransitionGroup>
      );
    }
    
  }
}


export default TopInfo
