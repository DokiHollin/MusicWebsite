import React, { Fragment } from 'react';
import './index.scss';
import { PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';

import { connect } from 'react-redux';

import BlackTable from './BlackTable';
import TransparentButton from 'src/components/transparentButton';

// import { changeSong } from '@/redux/modules/musicPlayer/actions';
import DownloadAudio from 'src/utils/SongList/downloadAudio';
import { debounce, throttle } from 'lodash';
import PlayerContext from 'src/store/PlayerContext';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';

import AlbumContext from 'src/store/AlbumStore';
// import { history } from 'umi';

interface BottomListProps {
  currentDetailList: any[];
  // changeSong: Function;
}

interface BottomListState {}

interface SongListDataType {
  name: string;
  ar: any[];
  key: string | number;
  [propName: string]: any;
  render?: () => {};
}

class BottomList extends React.Component<BottomListProps, BottomListState> {
  state = {};
  debouncedDownloadAudio: (val: any) => void; // 这里定义debouncedDownloadAudio

  constructor(props: BottomListProps) {
    super(props);
    this.state = {};
    this.debouncedDownloadAudio = debounce(this.downloadAudio.bind(this), 2000);
    
  }
  
  downloadAudio(val: any): void {
    DownloadAudio(val);
    console.log('downloading ' + val);
  }
  
  changeSong = (id: number) => {
    // this.props.changeSong(id, () => {
    //   // history.replace('/music/' + id);
    // });
    console.log('changge song')
  };
  // Responsible for the top column name of the list
  render() {
    const columns = [
      {
        title: 'SongName',
        className: 'w50',
        key: 'music_name',
      },
      {
        title: 'Singer',
        className: 'w30',
        key: 'artist_name',
      },
      {
        title: 'Operate',
        className: 'w20',
        key: 'operation',
      },
    ];
    console.log( JSON.parse(JSON.stringify(this.props.currentDetailList)).data)
    let propData = JSON.parse(JSON.stringify(this.props.currentDetailList)).data;

    // Map the data with the album selected
    if(Array.isArray(propData) &&  propData !== null){
      propData = propData.map((val: any) => {
        val.key = val.MusicID;
        val.operation = (
          <Fragment>
            <TransparentButton>
              <PlayCircleOutlined
                onClick={() =>{       
                    console.log('change song')
                    runInAction(()=>{
                      PlayerContext.setCurrentSong(val);
                    })
                    
                 }
                }
              />
            </TransparentButton>
            <TransparentButton>
              {/* <DownloadOutlined
                onClick={() => debounce(DownloadAudio, 2000)(val)}
              /> */}
              <DownloadOutlined
                onClick={() =>  DownloadAudio(val)}
              />
  
            </TransparentButton>
          </Fragment>
        );
        return val;
      });
    }else{
      propData = ''
    }
    

    return (
      <div className="bottom_list">
        <BlackTable
          columns={columns}
          dataSource={propData} // All songs
          itemClassName={'black_list_item_style icon_por use_zebra'}
          useHeader = {true}
          loading = {AlbumContext.loadingAlbum}
          currentListId = {1}
          currentSong = { PlayerContext.currentSong } // The playing Songg
          currentDetailListInfo = {{ trackCount: propData.length }} // The page count
          currentDetailListPage = {1} // Current Page
        />
      </div>
    );
  }

}


export default observer(BottomList);