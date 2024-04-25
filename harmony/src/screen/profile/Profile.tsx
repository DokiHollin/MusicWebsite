import "bootstrap-icons/font/bootstrap-icons.css";
import {useNavigate, useParams} from "react-router-dom";
import { Observer, observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { message } from "antd";
import 'src/style/profile/Profile.css';
import UserContext from "src/store/UserContext";

import MainPageHeader from 'src/component/header/MainPageHeader';
import CustomerBar from 'src/component/MusicPlayer/CustomerBar'

function Profile() {

    const navigate = useNavigate();

    const { userId } = useParams(); // Get the userId from the URL parameter
    const currentUserID = UserContext.userID; // Get the current user's ID from the context

    // console.log(userId);
    // console.log(currentUserID);

    const isCurrentUserProfile = (Number(currentUserID) === Number(userId) ? true : false);
    // console.log(currentUserID + 'and ' + userId + 'The answer is :' + isCurrentUserProfile)
    const images = {
        x : "https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png",
        ig : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png",
        facebook : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png",
        map : "https://cdn-icons-png.flaticon.com/512/3082/3082383.png",
        edit : "https://cdn-icons-png.flaticon.com/512/6324/6324826.png",
        level : "data:image/jpeg;base64,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",
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
        moments :'https://static.thenounproject.com/png/4449547-200.png'
    };

    const [userData, setUserData] = useState({
        bio: [],
        followers_count: 0,
        following_count: 0,
        follows: [],
        gender : [],
        profile_picture : '',
        username : [],
        location : ""
    });

    const [followingData, setFollowingData] = useState([{
        profile_picture : '',
        username : [],
        id : 0
    }]);


    const config = {
        headers: {
            Authorization: `token ${UserContext.token}`
        }
    };

    const [isFollowing, setIsFollowing] = useState(false); // Initially assume the user is not following

    const handleFollow = () => {
        // Send an API request to follow the user
        axios.post("http://3.26.210.47/api/user/follow/" + userId + "/", userId, config)
            .then((response) => {
            if (response.status === 200) {
                // Update the state to indicate that the user is now following
                setIsFollowing(true);
            }
            })
            .catch((error) => {
            message.error('Failed to follow the user.');
            });
    };

    const handleUnfollow = () => {
        // Send an API request to unfollow the user
        axios.post("http://3.26.210.47/api/user/unfollow/" + userId + "/", userId, config)
            .then((response) => {
            if (response.status === 200) {
                // Update the state to indicate that the user is now not following
                setIsFollowing(false);
            }
            })
            .catch((error) => {
            message.error('Failed to unfollow the user.');
            });
    };

    // Fetch the current user's following list
    useEffect(() => {
        // Replace this URL with the actual endpoint to fetch the following list of the current user
        axios.get("http://3.26.210.47/api/user/" + currentUserID + "/following-users/", config)
        .then(response => {
            const followingList = response.data;
            // Check if the user being viewed is in the following list
            setFollowingData(followingList);
            const matchingProfile = followingData.find(profile => profile.id.toString() === userId);

            if (matchingProfile != null) {
                setIsFollowing(true);
            } else {
                setIsFollowing(false);
            }
        })
        .catch(error => {
            console.error('Failed to fetch following list:', error);
        });
    }, [userId, config]);
    
    useEffect(() => {
        // Replace the API URL with your actual backend API endpoint
        axios.get("http://3.26.210.47/api/user/" + userId + '/profile' + '/', config)
            .then(response => {
                const profileData = response.data;
                setUserData(profileData);
                console.log(profileData);
            })
            .catch(error => {
                message.error("Failed to fetch user profile!");
            });
    }, [UserContext.isLoggedIn, userId , UserContext.token]);

    if (userData.username.length === 0) {
        return <div>Loading...</div>;
    }

    function followerNavigation(){
        if(userData.followers_count <= 0){

            message.warning('Currently not having any followers...')
        }else{
            navigate('/Followers' +"/" + userId)
        }
        
    }

    function followingNavigation(){
        if(userData.following_count <= 0){
        
            message.warning('Currently not following anyone...')
        }else{
            navigate('/Following' +"/" + userId)
        }
        
    }
    
    return (
        <div>
        {isCurrentUserProfile ? (

            <div className="container-profile">

                <MainPageHeader></MainPageHeader>

                {/* Middle Section */}
                <div className="middle-profile">
                    {/* Middle Top Section */}
                    <div className="middle-top-profile">
                        <div className="profile-left"></div>
                        <div className="user-profile">
                            {userData.profile_picture ? (
                                <img src={userData.profile_picture} alt="Your Profile" />
                            ) : (
                                <img src={images.default} alt="Default Profile" />
                            )}
                        
                        </div>
                        <div className="filler"></div>
                        <div className="profile-center">
                            <div className='display-profile'>
                                <div className='row1'>
                                    <div className='username'>
                                        {userData.username}
                                    </div>
                                </div>
                                <div className='row1'>
                                    <div className='bio'><p>{userData.bio}</p></div>
                                </div>
                                <div className='row2'>
                                    {/* <button className="social-button" onClick={() => navigate('/Followers' +"/" + userId)}>Followers</button>
                                    <button className="social-button" onClick={() => navigate('/Following' + "/" + userId)}>Following</button> */}
                                    <button className="social-button" onClick={() => followerNavigation()}>Followers</button>
                                    <button className="social-button" onClick={() => followingNavigation()}>Following</button>
                                </div>
                                <div className='row2'>
                                    <div className='followers'>{userData.followers_count}</div>
                                    <div className='followers'>{userData.following_count}</div>
                                </div>
                            </div>
                            <div className='center-middle'></div>
                            <div className='profile-right'>
                                <div className='display-profile'>
                                    <div className='row2'>
                                        <span>&nbsp;&nbsp;</span>
                                    </div>
                                    <div className='row2'>
                                        <span>&nbsp;&nbsp;</span>
                                    </div>
                                    <div className='row2'>
                                        <span>&nbsp;&nbsp;</span>
                                    </div>
                                    <div className='row2'>
                                        <span>&nbsp;&nbsp;</span>
                                    </div>
                                    <div className='row2'>
                                        <div className="x">
                                            <img src = {images.map} alt="IP address" />  
                                            <div className="x-content">
                                                <div className="x-desc">
                                                    <p>{userData.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button className="edit-btn" onClick={() => navigate('/edit-profile')}>
                                            <img src = {images.edit} alt="Edit button" />
                                        </button>
                                        {/*
                                        <button className="edit-btn" onClick={() => navigate('/Moments')}>
                                            <img src = {images.moments} alt="Moments button" />
                                        </button>
                                        */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="profile-right">
                        </div>
                        
                    </div>
                    <div className="middle-bot-profile">
                    </div>
                </div>
                
                <CustomerBar></CustomerBar>
            </div>
        ) : (
            <div className="container-profile">

                <MainPageHeader></MainPageHeader>

                {/* Middle Section */}
                <div className="middle-profile">
                    {/* Middle Top Section */}
                    <div className="middle-top-profile">
                        <div className="profile-left"></div>
                        <div className="user-profile">
                            {userData.profile_picture ? (
                                <img src={userData.profile_picture} alt="Your Profile" />
                            ) : (
                                <img src={images.default} alt="Default Profile" />
                            )}
                        </div>
                        <div className="filler"></div>
                        <div className="profile-center">
                            <div className='display-profile'>
                                <div className='row1'>
                                    <div className='username'>
                                        {userData.username}
                                    </div>
                                    <div className='username'>
                                        <img src = {images.level} alt="Your Profile" />
                                        <div className='level'>1</div>
                                    </div>
                                </div>
                                <div className='row1'>
                                    <p>{userData.bio}</p>
                                </div>
                                <div className='row2'>
                                    <button className="social-button" onClick={() => navigate('/Followers' + "/" + userId)}>Followers</button>
                                    <button className="social-button" onClick={() => navigate('/Following' + "/" + userId)}>Following</button>
                                </div>
                                <div className='row2'>
                                    <div className='followers'>{userData.followers_count}</div>
                                    <div className='followers'>{userData.following_count}</div>
                                </div>
                            </div>
                            <div className='center-middle'></div>
                            <div className='profile-right'>
                                <div className='display-profile'>
                                    <div className='row2'>
                                        {isFollowing ? (
                                            <button onClick={handleUnfollow}>Unfollow</button>
                                        ) : (
                                            <button onClick={handleFollow}>Follow</button>
                                        )}
                                    </div>
                                    <div className='row2'>
                                        <span>&nbsp;&nbsp;</span>
                                    </div>
                                    <div className='row2'>
                                        <span>&nbsp;&nbsp;</span>
                                    </div>
                                    <div className='row2'>
                                        <span>&nbsp;&nbsp;</span>
                                    </div>
                                    <div className='row2'>
                                        <span>&nbsp;&nbsp;</span>
                                    </div>
                                    <div className='row2'>
                                        <button className="edit-btn">
                                            <img src = {images.map} alt="IP address" />   
                                        </button>
                                        {/*
                                        <button className="edit-btn" onClick={() => navigate('/Moments')}>
                                            <img src = {images.moments} alt="Moments button" />
                                        </button>
                                        */}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="profile-right">
                        </div>
                        
                    </div>
                    <div className="middle-bot-profile">
                    </div>
                </div>
                
                <CustomerBar></CustomerBar>
            </div>
        )}
        </div>
    );
}

export default observer(Profile);