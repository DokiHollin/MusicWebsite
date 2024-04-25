import 'src/style/homepage.css'
import 'src/style/profile/Following.css'
import { Observer, observer } from 'mobx-react-lite';
import MainPageHeader from 'src/component/header/MainPageHeader';
import CustomerBar from 'src/component/MusicPlayer/CustomerBar'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { message } from "antd";
import UserContext from "src/store/UserContext";
import {useParams, useNavigate} from "react-router-dom";

function Following() {

    const { userId } = useParams();
    const currentUserID = UserContext.userID;
    const isCurrentUserProfile = currentUserID === userId;

    const navigate = useNavigate();

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

    const handleUnfollow = (followerUserId : number) => {
        // Make an API request to follow the user with `followerUserId`
        axios.post("http://3.26.210.47/api/user/unfollow/" + followerUserId + "/", followerUserId, config)
            .then((response) => {
                // Handle the success response (e.g., update the UI)
                // Remove the unfollowed user from the state
                const updatedFollowingData = followingData.filter(user => user.id !== followerUserId);
                setFollowingData(updatedFollowingData);
                console.log(`Successfully unfollowed user with ID ${followerUserId}`);
            })
            .catch((error) => {
                // Handle any errors (e.g., show an error message)
                console.error(`Error following user: ${error}`);
            });
    };

    useEffect(() => {
        axios.get("http://3.26.210.47/api/user/" + userId + "/following-users/", config)
            .then(response => {
                const followingData = response.data;
                setFollowingData(followingData);
                console.log(followingData);
            })
            .catch(error => {
                message.error("Failed to fetch user followings list!");
            });
    }, [UserContext.isLoggedIn, UserContext.userID, UserContext.token]);
    

    const data = followingData.map((user, index) => ({
        id : user.id,
        name: user.username.toString(),
        imageSrc: user.profile_picture,
      }));

    if (followingData.length === 0) {
        // Data is still loading, you can render a loading indicator here
       
    
        return (<div>Currently not following anyone...</div>);
    }

    

    return (
        <div className="container">
            <MainPageHeader></MainPageHeader>
            
            {/* Middle Section */}
            <div className="b">
                <div className="middle-top-left"></div>
                <div className="middle-top-center">
                    <h2 className='following-followers'>Following</h2>
                    <table className="bordered-table">
                        <thead>
                            <tr>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user) => (
                                <tr>
                                    <td >
                                    <div>
                                        <img src={user.imageSrc} alt={user.name} />
                                        <span onClick={() => navigate('/profile' +"/" + user.id)}>{user.name}</span>
                                    </div>
                                    </td>
                                    {isCurrentUserProfile ? (
                                        <td>
                                            <button onClick={() => handleUnfollow(user.id)}>Unfollow</button>
                                        </td>
                                    ) : null} 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="middle-top-right"></div>
                
            </div>
            
            <CustomerBar></CustomerBar>
            
        </div>
    );
}
export default observer(Following)
