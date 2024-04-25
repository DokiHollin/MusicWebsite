// export default LeftMainList;
import * as React from 'react';
import BottomBox from './BottomBox';
import './index.scss';
import TopBox from './TopBox';
import UserContext from 'src/store/UserContext';
import { getUserAlbums} from 'src/api/album';
import {createUserPlayList, getUserPlayList} from 'src/api/SongList';
import { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';

interface LeftMainListProps {
  currentId: string | number;
}

const LeftMainList: React.FC<LeftMainListProps> = ({ currentId }) => {
  const [currentListId, setCurrentListId] = useState<string | number>('current');
  const [dataList, setDataList] = useState<{ [propName: string]: any }[]>([]);
  // const userContext = useContext(UserContext);
  const [bottomBoxState, setBottomBoxState] = useState('');
  // const [updateData, setUpdateData] = useState(false);

  useEffect(() => {
    async function fetchData() {
      
      const list = await getUserPlayList(Number(UserContext.userID));
      //这个getuseralbum其实是拿取musician的
      UserContext.setUpdate(false)
      if(!list){
        setDataList([]);
      }else{
        setDataList(list);
      }
      
    }
    fetchData();
  }, [UserContext.updateList]);

  useEffect(() => {
    async function addList() {
      console.log(bottomBoxState)
      // const list = await getUserPlayList(Number(UserContext.userID));
      
      const resp = await createUserPlayList(Number(UserContext.userID),bottomBoxState,'');
      
      console.log(resp)
      UserContext.setUpdate(true)
    }
    if(bottomBoxState !== ''){
      addList();
    }
    
  }, [bottomBoxState]);
  

  return (
    <div className="left_main_list">
      <TopBox 
         userInfo={['1']}
         currentListId={1}
         favoriteMusic={['1']}
      />
      <div className="row_split_line1"></div>
      <BottomBox 
        isLogin={UserContext.isLoggedIn}
        showSubscribeList={false}
        currentListId={1}
        userInfo={['1']}
        selfCreateList={dataList}
        subscribeList={[]}
        setTitle={setBottomBoxState}
      />
    </div>
  );
}

export default observer(LeftMainList);
