
import 'src/style/homepage.css'
import 'src/style/profile/Followers.css'
import "bootstrap-icons/font/bootstrap-icons.css";

import {observer } from 'mobx-react-lite';
import MainPageHeader from 'src/component/header/MainPageHeader';
import CustomerBar from 'src/component/MusicPlayer/CustomerBar'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { message } from "antd";
import UserContext from "src/store/UserContext";
import {useNavigate, useParams} from "react-router-dom";

function Followers() {

    const navigate = useNavigate();

    const [followersData, setFollowersData] = useState([{
        profile_picture : '',
        username : [],
        id : 0
    }]);

    const config = {
        headers: {
            Authorization: `token ${UserContext.token}`
        }
    };

    const { userId } = useParams(); // Get the userId from the URL parameter

    useEffect(() => {
        axios.get("http://3.26.210.47/api/user/" + userId + "/followers/", config)
            .then(response => {
                const followersData = response.data;
                setFollowersData(followersData);
                console.log(followersData);
            })
            .catch(error => {
                message.error("Failed to fetch user followings list!");
            });
    }, [UserContext.isLoggedIn, UserContext.userID, UserContext.token]);
    

    const data = followersData.map((user, index) => ({
        id : user.id,
        name: user.username.toString(),
        imageSrc: user.profile_picture,
      }));

    if (followersData.length === 0) {
        // Data is still loading, you can render a loading indicator here
        return (<div>Currently no-one is following you...</div>);
    }

    return (
        <div className="container">
            <MainPageHeader></MainPageHeader>
            
            {/* Middle Section */}
            <div className="b">
                <div className="middle-top-left"></div>
                <div className="middle-top-center">
                    <h2 className='follower-followers'>Followers</h2>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="middle-top-right"></div>
                
            <CustomerBar></CustomerBar>
            </div>
        </div>
    );
}
export default observer(Followers)
