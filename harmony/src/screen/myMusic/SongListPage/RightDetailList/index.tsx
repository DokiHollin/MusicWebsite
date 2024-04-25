import * as React from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import './index.scss';

import TopInfo from './TopInfo/index';
import BottomList from './BottomList';
import AlbumContext from 'src/store/AlbumStore';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';
import { toJS } from 'mobx';

interface RightDetailListProps {}

interface RightDetailListState {
  spinning: boolean;
}
const currentDetailList = [
  {
      id: 1,
      ar: [
          { name: 'Artist1' },
          { name: 'Artist2' }
      ]
  },
  {
      id: 2,
      ar: [
          { name: 'Artist3' }
      ]
  },
  {
      id: 3,
      ar: []
  },
  {
      id: 4,
      ar: [
          { name: 'Artist4' },
          { name: 'Artist5' },
          { name: 'Artist6' }
      ]
  }
];

// useEffect(()=>{
//   if()
// },[])

console.log(' 44444' + AlbumContext.albumSongs)
@observer
class RightDetailList extends React.Component<
  RightDetailListProps,
  RightDetailListState
> {

  state = {
    spinning: false,
  };
  
  render() {
    return (
      <div className="right_detail_list">
        <Spin
          spinning={this.state.spinning}
          indicator={
            <LoadingOutlined style={{ fontSize: 24, color: '#fff' }} />
          }
        >
          <TopInfo 
                // playSongList={yourPlaySongListValue}
                currentDetailListInfo={toJS(AlbumContext.selectedAlbum)}
                name={'123'}
                description={'123'}
                currentListId={'1'}
            />

          <BottomList currentDetailList = {AlbumContext.albumSongs} />
        </Spin>
      </div>
    );
  }
}


export default RightDetailList