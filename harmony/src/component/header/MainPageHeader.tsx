import iconE from "../../resource/iconERemovedBG.png"
import logo from "../../resource/logo.png";
import { LeftOutlined, MailOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import '../../style/header/mainPageHeader.css'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PlayerContext from "../../store/PlayerContext";
import UserContext from "src/store/UserContext";
import axios from "axios";
import { message } from "antd";
import { observer } from "mobx-react-lite";
import anoImage from 'src/assets/images/bg/anon.jpg'


function MainPageHeader(){
    //==============测试用
    const [showDropdown, setShowDropdown] = useState(false);

    //=========


    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchClick = async () => {
        navigate('/search', { state: { searchTerm } }); // Passing searchTerm to the search page
    };

    const navigate = useNavigate();

    const userId = UserContext.userID;

    const config = {
        headers: {

            Authorization: `token ${UserContext.token}`

        }
    };

    const [userData, setUserData] = useState({
        bio: [],
        followers_count: [],
        following_count: [],
        follows: [],
        gender : [],
        profile_picture : '',
        username : []
    });

    useEffect(() => {
        // Replace the API URL with your actual backend API endpoint
        if (UserContext.isLoggedIn && userId) {
            axios.get("http://3.26.210.47/api/user/" + UserContext.userID + '/profile' + '/', config)
                .then(response => {
                    const profileData = response.data;
                    // Update the state with the fetched user data
                    setUserData(profileData);
                    console.log(profileData);
                })
                .catch(error => {
                    message.error("Failed to fetch user profile!");
                });
        }
    }, [UserContext.isLoggedIn, userId, UserContext.token]);
    
    const handleLogout = () => {
        UserContext.logout();
        navigate('/');
      };
    
    return(
        <div className="main-top">
                    <div className="main-top-upper">
                        <div className="main-left">
                            <img src={logo} alt="Logo" className="main-homepage-logo" />

                            <div className="main-center">
                                <button className="main-btn" onClick={()=>{navigate('/')}}>Discover Music</button>
                                <button className="main-btn" onClick={()=>{navigate('/myMusic')}}>My Music</button>
                                {/* <button className="main-btn">AI Generation</button> */}

                            </div>
                        </div>

                        <div className="main-right">
                            <div className='searchComponent'>
                                <div className="mian-search-bar">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => { if (e.key === 'Enter') handleSearchClick();}}
                                    />
                                </div>
                                <button className="mian-search-button" onClick={handleSearchClick}>
                                        <SearchOutlined className="mian-search-icon"/>
                                </button>
                            </div>
                            <div className="btn-container-test" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                                <button className="main-btn" onClick={() => navigate('/creatorCenter')}>Creator Center</button>
                                {showDropdown && (
                                    <div className="dropdown-menu-test">
                                        {/* <button onClick={() => {
                                            PlayerContext.isCreator = !PlayerContext.isCreator;
                                            setShowDropdown(false); // Optionally, close the dropdown after the action
                                        }}>
                                            改变是否为creator （测试用）
                                        </button> */}
                                    </div>
                                )}
                            </div>
                            
                            {UserContext.isLoggedIn ? (
                                <div className="dropdown-mainpage">
                                    {userData.profile_picture ? (
                                        <img src={userData.profile_picture} alt="Your Profile" />
                                    ) : (
                                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png' alt="Default Profile" />
                                    )}
                                    <div className="dropdown-content-mainpage">
                                        <div className="desc-mainpage">
                                            <button className="profile-btn" onClick={() => navigate('/profile' +"/" + userId)}>
                                               
                                                <img src={userData.profile_picture || anoImage} alt="Your Profile" />
                                        
                                                
                                                Profile
                                            </button>
                                            <button className="profile-btn-vip" onClick={() => navigate('/vip')}>
                                                <img src={"https://cdn-icons-png.flaticon.com/512/4730/4730393.png"} alt={"vip"} />
                                                VIP
                                            </button>
                                            <button className="profile-btn" onClick={handleLogout} >
                                                <img src={"https://static-00.iconduck.com/assets.00/log-out-icon-1024x1024-7mbxqtxd.png"} alt={"logout"} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button className="main-homepage-login-btn" onClick={() => navigate('/login')}>Login</button>
                            )}
                        </div>
                    </div>
            </div>
    )

}

export default observer(MainPageHeader)
