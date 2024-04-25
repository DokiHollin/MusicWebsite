import React, {useCallback, useEffect, useRef, useState} from 'react';
import 'src/style/homepage.css'

import logo from "../resource/logo.png";
import ReactPlayer from "react-player/lazy";
import "bootstrap-icons/font/bootstrap-icons.css";
import {useNavigate} from "react-router-dom";
import {
    PauseCircleOutlined,
    PlayCircleOutlined,
    SearchOutlined,
    StepBackwardOutlined,
    StepForwardOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import PlayerContext from "src/store/PlayerContext";
import Queue, {PlayMode} from '../main/Queue';
import { Observer, observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import CustomReactPlayer from 'src/component/MusicPlayer/CustomerMusicPlayer';
import Modal from 'react-modal';
// import Tmp from "../main/Tmp";
import MainPageHeader from 'src/component/header/MainPageHeader';

import BG from '../layout/bg/index'
import CustomerBar from 'src/component/MusicPlayer/CustomerBar'
import IndexPage from './IndexPage/index';
import { TransitionGroup,CSSTransition } from 'react-transition-group';
import SongPage from './SongListPage/index';
import 'src/style/myMusic/myMusicMiddle.css'
import { useBG } from '../layout/bg/BGContext';
import { BACKGROUND } from 'src/constant/LocalStorage';
import ImageBase64ToBlobServer from 'src/utils/ImageBase64ToBlobServer';


function MyMusic() {
  const { bgPath } = useBG();
  const { setBgPath } = useBG();
  useEffect(() => {
    // 当组件加载时，从localStorage获取背景
    const savedBackground = localStorage.getItem(BACKGROUND);
    if (savedBackground) {
      const blobUrl = ImageBase64ToBlobServer(savedBackground);
      if (blobUrl) {
        setBgPath(blobUrl);
      }
    }
  }, []); // 注意这个空数组，确保此副作用只在组件挂载时运行
    return (
        
      <div className="myMusic-container" >
            {/* Top Section */}
            <MainPageHeader></MainPageHeader>
            <BG path={bgPath} mask={false} filter={false} pathChangeId={1} />
            {!PlayerContext.showPlayScreen && (
            //mask是暗度，filter是是否模糊
                // <BG path='' mask={false} filter={false} pathChangeId={1} />
                <TransitionGroup
                  className="middle_content" //css for the homepage middle
                  childFactory={(child) =>
                    React.cloneElement(child, { classNames: 'page' })
                  }
                >
                  <CSSTransition
                  
                  key={PlayerContext.isMyListPage ? 'SongPage' : 'IndexPage'}
                    timeout={800}
                  >
                    {
                      !PlayerContext.isMyListPage 
                      ? <IndexPage /> 
                      : <SongPage userInfo={{}} />
                    }

                    
                  </CSSTransition>
                </TransitionGroup>
            )
            
            }
               
            
          
            <CustomerBar></CustomerBar>
        </div>

    );
}
export default observer(MyMusic)