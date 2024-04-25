import { Navigate, useNavigate } from "react-router-dom"
import PlayerContext from "../../store/PlayerContext"
import logo from 'src/resource/logo.png';
import iconE from 'src/resource/iconE.png';

import imgae from 'src/resource/szc.png';
import 'src/style/musicCenter.css'
import Icon, { CommentOutlined, DownloadOutlined, HeartFilled, LikeOutlined, PlayCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Tooltip, Avatar } from 'antd';
import { MailOutlined, EditOutlined, DeleteOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import MusicCenterHeader from 'src/component/header/MusicCenterHeader'
import Loading from '../loading/index'
import UserContext from "src/store/UserContext";
import React from "react";

export default function CreatorCenter(){
  const [justApproved, setJustApproved] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  console.log('123')
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = UserContext.token;
        console.log('123')
        console.log(token)
        const url = 'http://3.26.210.47/api/user/is_musician/' + UserContext.userID + '/';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': 'token ' + token,
          },
        });

        if (!response.ok) {
          // Handle error as needed
          console.log('response not ok')
        }else{
          console.log('success verify musician')
        }

        const data = await response.json();
        console.log(data)
        setJustApproved(data.is_musician);
      } catch (error) {
        console.log('There has been a problem with your fetch operation:', error);
      } finally {
        setIsLoading(false);
      }
    };

      fetchData();
    }, [UserContext.userID, UserContext.token]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!justApproved) {
      return <Navigate to='/ApplyArtistPreSite'></Navigate>;
    }

    return (
      <div className="musician-center">
 
       <Loading initState={true}></Loading>
        <MusicCenterHeader></MusicCenterHeader>
  
        <div className="stats-container">
          <h3>Music Data</h3>
          <div className="stats">

            <div className="stat-item">
              <div className="icon"><UserAddOutlined /></div>
              <div className="stat-label">Net increase fans</div>
              <div className="stat-number">100</div>
              
            </div>
            <div className="stat-item">
              <div className="icon"><PlayCircleOutlined /></div>
              <div className="stat-label">Listen counts</div>
              <div className="stat-number">100</div>
              
            </div>
            <div className="stat-item">
              <div className="icon"><LikeOutlined /></div>
              <div className="stat-label">Likes</div>
              <div className="stat-number">100</div>
              
            </div>
            <div className="stat-item">
              <div className="icon"><CommentOutlined /></div>
              <div className="stat-label">Comments</div>
              <div className="stat-number">100</div>

            </div>
            <div className="stat-item">
              <div className="icon"><HeartFilled /></div>
              <div className="stat-label">Favor</div>
              <div className="stat-number">100</div>
              
            </div>
            <div className="stat-item">
              <div className="icon"><DownloadOutlined /></div>
              <div className="stat-label">Download</div>
              <div className="stat-number">100</div>
              
            </div>
    
          </div>
        </div>  
      
        <div className="comments-container">
          <h3>Comment</h3>
          <div className="comments-and-songs">
            <div className="comment">
              <Avatar>Name</Avatar>
              <div>Name</div>
              <div>comment date</div>
              <div>GOOD GOOD</div>
            </div>
            <div className="comment">
              <Avatar>Name</Avatar>
              <div>Name</div>
              <div>comment date</div>
              <div>GOOD GOOD</div>
            </div>
            <div className="comment">
              <Avatar>Name</Avatar>
              <div>Name</div>
              <div>comment date</div>
              <div>GOOD GOOD</div>
            </div>
          </div>
        </div>
            {/* </div> */}
            <div className="center-upload-container">
              <h3>Uploaded Music</h3>
              <div className="uploaded-songs">
                <div className="song">
                  <img src={imgae} alt="Song1" />
                  <div>Song1</div>
                  <div className="song-actions">
                    <EditOutlined />
                    <DeleteOutlined />
                  </div>
                </div>
                <div className="song">
                  <img src={imgae} alt="Song1" />
                  <div>Song1</div>
                  <div className="song-actions">
                    <EditOutlined />
                    <DeleteOutlined />
                  </div>
                </div>
                <div className="song">
                  <img src={imgae} alt="Song1" />
                  <div>Song1</div>
                  <div className="song-actions">
                    <EditOutlined />
                    <DeleteOutlined />
                  </div>
                </div>
              </div>
            </div>
          {/* </div> */}
      </div>
    
           
  
       
    );
}