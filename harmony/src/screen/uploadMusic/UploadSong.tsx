import React, { useState, useCallback } from 'react';
import MusicCenterHeader from 'src/component/header/MusicCenterHeader';
import Cropper, { Area } from 'react-easy-crop';
import './uploadCSS.css'
import getCroppedImg from './cropImage';  // Assuming you have a file named cropImage.js
import Modal from 'react-modal';  // 引入一个模态窗口库
import AlbumForm from './AlbumForm'
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import MusicForm from './MusicForm'
export default function UploadSong() {
  const [showUpload, setShowUpload] = useState(false)


    return (
        <div>
            <MusicCenterHeader />
            <div className='upload-container'>
                <button onClick={()=>{setShowUpload(!showUpload)}} className='update-btn'>
                    {showUpload ? "Upload Album" : "Update Single Song"}</button>
                {!showUpload && (
                    <AlbumForm></AlbumForm>
                )}
                {showUpload && (
                    <MusicForm></MusicForm>
                )}
            </div>
        </div>
    );

}
