import React, { createRef, Fragment } from 'react';
import { Popconfirm } from 'antd';
import './index.scss';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';

import { Scrollbars } from 'react-custom-scrollbars';

import TransparentButton from 'src/components/transparentButton';

// import {
//   changeSong,
//   changeAllQueue,
//   removeFromQueue,
// } from '@/redux/modules/musicPlayer/actions';
import { connect } from 'react-redux';
import UserContext from 'src/store/UserContext';
import PlayerContext from 'src/store/PlayerContext';
import { Song } from 'src/model/song';
import { toJS } from 'mobx';

interface RightPlayListProps {
  // changeAllQueue: Function;
  // changeSong: Function;
  // removeFromQueue: Function;
  playQueue: any;
  currentSong: { [propName: string]: any };
  hideButton?: boolean;
  disabledDragable?: boolean;
}

interface RightPlayListState {}

class RightPlayList extends React.Component<
  RightPlayListProps,
  RightPlayListState
> {
  scrollEle = createRef<HTMLDivElement>();

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Scrollbars
          renderTrackVertical={(props) => (
            <div {...props} className="white_scroll_track-vertical" />
          )}
          renderThumbVertical={(props) => (
            <div {...props} className="white_scroll_thumb-vertical" />
          )}
          className="right_play_list white_scroll"
        >
          <Droppable droppableId="rightPlayListDrop" direction="vertical">
            {(provided) => (
              <ul
                className="right_play_list_container"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {this.props.playQueue.map((val: any, i: number) => (
                  <Draggable
                    draggableId={val.name}
                    index={i}
                    key={val.id}
                    isDragDisabled={this.props.disabledDragable}
                  >
                    {(provided) => (
                      <li
                        key={val.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        // onDoubleClick={() => this.props.changeSong(val.id)}
                        onDoubleClick={() => 
                          // console.log('change song of id '+val.id)
                         UserContext.setQueueCurrent(val.id)
                        }
                        className={`right_play_list_item ${
                          this.props.currentSong &&
                          val.id == this.props.currentSong.id
                            ? 'active'
                            : ''
                        } ${val.invalid ? 'invalid' : ''}`}
                      >
                        <span className="song_title">{val.name}</span>
                        {this.props.hideButton ? null : (
                          <div className="function_button">
                            <TransparentButton>
                              <i
                                // onClick={() => this.props.changeSong(val.id)}
                                onClick={() => console.log('change song of id '+val.id)}
                                className="button iconfont icon-24gl-play"
                              ></i>
                            </TransparentButton>
                            <TransparentButton>
                              <Popconfirm
                                placement="left"
                                title="确认移除吗？"
                                onConfirm={() => this.removeFromQueue(val.id)}
                                okText="YES"
                                cancelText="NO"
                                icon={
                                  <i className="iconfont icon-24gl-warningCircle" />
                                }
                              >
                                <i className="button iconfont icon-24gl-trash2"></i>
                              </Popconfirm>
                            </TransparentButton>
                          </div>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </Scrollbars>
      </DragDropContext>
    );
  }

  componentDidMount() {
    const wrapper = document.getElementById('rightPlayList');
  }

  onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const source = result.source.index,
      end = result.destination?.index;
    if (typeof end != 'undefined') {
      let newPlayQueue = [...this.props.playQueue];
      newPlayQueue.splice(end, 0, ...newPlayQueue.splice(source, 1));

      let modifiedPlayQueue = newPlayQueue.map(item => ({
        MusicID: item.id,
        music_name: item.name
      }));

      // Reorder the songs in UserContext.playingQueue based on the order in modifiedPlayQueue
      // 获取原始的歌曲列表
      const originalSongs = toJS(UserContext.playingQueue.songs);

      // 根据 modifiedPlayQueue 中的 MusicID 顺序重新排序 originalSongs
      let reorderedSongs = modifiedPlayQueue.map((modifiedItem: { MusicID: number; }) => {
        return originalSongs.find(originalItem => originalItem.MusicID === Number(modifiedItem.MusicID));
    }).filter((song): song is Song => Boolean(song));  // 使用类型守卫确保过滤掉所有 undefined 值

      // 日志输出以供检查
      console.log("modifiedPlayQueue:", modifiedPlayQueue);
      console.log("UserContext.playingQueue.songs:", originalSongs);
      console.log("Reordered songs:", reorderedSongs);

      //如果 reorderedSongs 的长度与 originalSongs 相同，那么我们知道所有歌曲都已匹配并已重新排序
      if (reorderedSongs.length === originalSongs.length) {
          UserContext.playingQueue.songs = reorderedSongs;
      } else {
          
      }

    }
  };

  removeFromQueue = (n: number) => {
    // this.props.removeFromQueue(n);
    console.log('remove from queue logic for ' + n)
  };
}

export default RightPlayList
