import { useEffect, useState } from 'react';
import './index.scss';
// import { connect } from 'react-redux';
import pubsub from 'pubsub-js';
// import { useHistory } from 'react-router-dom';
import { Modal, Button, Popconfirm, message } from 'antd';

import TransparentBox1 from 'src/components/transparentBox1';
import TransparentButton from 'src/components/transparentButton';
import BlackUpload from 'src/components/Upload';

// import { nextSong } from '@/redux/modules/musicPlayer/actions';
// import { changeBG } from '@/redux/modules/layouts/bg/action';

import { OPENERIGHTDRAWER } from 'src/constant/PubSub';
import { BACKGROUND } from 'src/constant/LocalStorage';
import UserContext from 'src/store/UserContext';
import axios from 'axios';
import { runInAction } from 'mobx';
import { Spin} from 'antd';
import {getRandom} from 'src/api/music'
import PlayerContext from 'src/store/PlayerContext';
import { useBG } from 'src/screen/layout/bg/BGContext';
import ImageBase64ToBlobServer from 'src/utils/ImageBase64ToBlobServer';
import bg from 'src/assets/images/bg/bg.jpg'
interface RTProps {
  name: string

}

function RightFunctionList(props: RTProps) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { bgPath, setBgPath } = useBG();
  const openRightDrawerToken = (data: boolean) => {
    pubsub.publish(OPENERIGHTDRAWER, data);
  };

  const confirmClearBG = () => {
    localStorage.removeItem(BACKGROUND);


      setBgPath(bg);
    
    // setBgPath('src/assets/imagges/bg/bg.jpg');
    // props.changeBG();
  };
  
  // const history = useHistory()
  async function getRandoms(){

    setIsLoading(true);

    try {
      const response = await getRandom();
      console.log(response.data);
      // 这里处理数据...
    } catch (error) {
      console.error("Error fetching and using random:", error);
    } finally {
      setIsLoading(false);
    }
  }

 

  return (
    <TransparentBox1 title="Functionality List">
      <div className="right_function_list">
        {isLoading && (
          <div className="loading-container">
            <Spin tip="Loading..." />
          </div>
        )}
        <TransparentButton onClick={() => getRandoms()}>
          Random Play Song
        </TransparentButton>
        {UserContext.isLoggedIn && (
          <TransparentButton onClick={() => PlayerContext.setExpanded(true)}>
          
          Current Song Info
        </TransparentButton>
        )}
        
        <TransparentButton
          onClick={() => {
            // if (true) history.push('/music');
            PlayerContext.setIsMyListPage(true)
          }}
        >
          Visit Current PlayList
        </TransparentButton>
        <TransparentButton onClick={() => setShowModal(true)}>
          Change Image
        </TransparentButton>
        <Modal
          visible={showModal}
          onOk={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
          title="Change BG Image"
          className="black_modal"
          okText="Confirm"
          cancelText="Cancel"
          okButtonProps={{
            className: 'yellow_button',
            type: 'text',
          }}
          cancelButtonProps={{
            className: 'yellow_button negative',
            type: 'text',
          }}
        >
          <BlackUpload />
          <span className="illustration">
             Note: Images are stored in the browser’s local storage. It is not recommended to upload images that are too large. It is recommended to upload images within 1MB.
             Within, maximum
             1.5MB, you can clear the image through the button below. If you encounter a white or black screen after uploading the image, you can try refreshing the web page.
          </span>
          <Popconfirm
          
            placement="left"
            title="You sure to return default？"
            onConfirm={() => confirmClearBG()}
            
            okText="YES"
            cancelText="NO"
            icon={<i className="iconfont icon-24gl-warningCircle" />}
          >
         
            <Button className={'yellow_button negative'}>Restore Default</Button>
          </Popconfirm>
        </Modal>
      </div>
    </TransparentBox1>
  );
}


export default RightFunctionList