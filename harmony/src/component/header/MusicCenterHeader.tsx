import Icon, { CommentOutlined, DownloadOutlined, HeartFilled, LikeOutlined, PlayCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Tooltip, Avatar } from 'antd';
import { MailOutlined, EditOutlined, DeleteOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import logo from "../../resource/logo.png";
import '../../style/header/musicCenterHeader.css';
import { useNavigate } from "react-router-dom";
function MusicCenterHeader(){
    const navigate = useNavigate();
    const accountMenu = (
        <Menu>
          <Menu.Item key="1">Deactive</Menu.Item>
          <Menu.Item key="2">Reactive</Menu.Item>
          <Menu.Item key="3">Delete Account</Menu.Item>
        </Menu>
      );
    return(
        <div className="musicCenter-header">
          <div className="musicCenter-left-section">
              <img className="musicCenter-logo" src={logo}></img>
              <h2 style={{ marginLeft: '10px' , cursor:'pointer'}} onClick={()=>{navigate('/creatorCenter')}}>Musician Center</h2>
              <a href="/" className="musicCenter-mainpage-link">Main Page</a>
              <Button className="musicCenter-upload-btn" type="default" onClick={()=>{navigate('/uploadSong')}}><UploadOutlined  />Upload Song</Button>
          </div>
          <div className="musicCenter-right-icons">
              <Tooltip title="n'th day of becoming a musician">
                  <Avatar style={{ backgroundColor: 'pink'}}>N</Avatar>
              </Tooltip>
              <MailOutlined className="musicCenter-mail-icon" />
              <div className="musicCenter-divider"></div>
              <Dropdown overlay={accountMenu}>
                  <Avatar style={{ backgroundColor: 'gray' , marginRight:'10px'}} icon={<UserOutlined />} />
              </Dropdown>
          </div>
      </div>
    )
}

export default MusicCenterHeader;
