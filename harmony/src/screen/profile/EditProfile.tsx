import "bootstrap-icons/font/bootstrap-icons.css";
import {useState, useRef, useEffect} from "react";
import { Observer, observer } from 'mobx-react-lite';
import MainPageHeader from 'src/component/header/MainPageHeader';
import CustomerBar from 'src/component/MusicPlayer/CustomerBar'

import 'src/style/profile/EditProfile.css';

import axios from "axios";
import { message } from "antd";
import UserContext from "src/store/UserContext";


function EditProfile() {

    const [userData, setUserData] = useState({
        bio: '',
        gender : '',
        profile_picture : '',
        username : ''
    });
  
    const userId = UserContext.userID;

    const config = {
        headers: {

            Authorization: `token ${UserContext.token}`

        }
    };


    const [selectedImage, setSelectedImage] = useState<File | null>(null);;

    const submit = () => {
        const formData = new FormData();
        formData.append('bio', userData.bio);
        formData.append('username', userData.username);
        fetch("http://3.26.210.47/api/user/edit-profile-detail/", {
            method: 'POST',
            body: formData,
            headers : {
                Authorization: `token ${UserContext.token}`,
            },
        }).then((response) => {
            // Handle success response (if any)
            console.log("Submited new bio and username success");
        })
        .catch((error) => {
            // Handle any errors
            console.error("Error submitting:", error);
        });

        // if (selectedImage != null) {
        //     const formData = new FormData();
        //     formData.append('profile_picture', selectedImage);

        //     fetch("http://3.26.210.47/api/user/edit-profile-detail-picture/", {
        //         method: 'POST',
        //         body: formData,
        //         headers : {
        //             Authorization: `token ${UserContext.token}`,
        //         },
        //     }).then((response) => {
        //         // Handle success response (if any)
        //         console.log("Profile picture uploaded successfully");
        //     })
        //     .catch((error) => {
        //         // Handle any errors
        //         console.error("Error uploading profile picture:", error);
        //     });
        // }
        if (selectedImage != null) {
            const formData = new FormData();
            formData.append('profile_picture', selectedImage);
        
            fetch("http://3.26.210.47/api/user/edit-profile-detail-picture/", {
                method: 'POST',
                body: formData,
                headers : {
                    Authorization: `token ${UserContext.token}`,
                },
            }).then((response) => {
                // Handle success response (if any)
                message.success("Profile picture uploaded successfully");
        
                // 更新状态以显示新的图片
                return response.json();  // 确保你的后端在上传成功后返回新图片的URL
            })
            .then(data => {
                if (data && data.profile_picture) {
                    setUserData(prevUserData => ({
                        ...prevUserData,
                        profile_picture: data.profile_picture
                    }));
                }
            })
            .catch((error) => {
                // Handle any errors
                console.error("Error uploading profile picture:", error);
            });
        }
        
      
    };

    useEffect(() => {
        // Replace the API URL with your actual backend API endpoint
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
    }, [UserContext.isLoggedIn, userId, UserContext.token]);

    const user = {
        avatar: 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
    };

    return (
        <div className="container">
            <MainPageHeader></MainPageHeader>

            {/* Middle Section */}
            <div className="middle">
                {/* Middle Top Section */}
                <div className="top">
                    <div className='top-profile'>
                        <h1><strong>Edit Profile</strong></h1>
                        <p>Your profile is how other users see you across the site. It's up to you how much or how little information you choose to provide.</p>
                    </div>
                </div>
                <div className="bot">
                    <div className="left-bot">
                    </div>
                    <div className='profile-pic-column'>
                        <div className="profile-pic">
                            {userData.profile_picture ? (
                                <img src={userData.profile_picture} alt="Your Profile" />
                            ) : (
                                <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png' alt="Default Profile" />
                            )}
                        </div>
                        <input type="file" name = "myImage" accept="image/*" onChange={
                            (event) => {
                            if (event.target.files && event.target.files[0]) {
                                console.log(event.target.files[0]);
                                setSelectedImage(event.target.files[0]);
                            }
                            }} />
                        
                    </div>
                    <div className="center-bot">
                        <div className='block'>
                            <h3>Enter your new username:</h3>    
                            <form>
                                <label>
                                    <input type="text" name="newUsername" value={userData.username} onChange={
                                        (event) => {
                                            if (event.target.value != null) {
                                                setUserData(prevUserData => ({
                                                    ...prevUserData, // Spread the previous userData
                                                    username: event.target.value, // Update the 'username' property
                                                }));
                                            }
                                        }}/>
                                </label>
                            </form>
                        </div>
                        <div className='block'>
                            <h3>Biography:</h3>
                            <textarea name="message" id="message" cols={100} rows={15} value={userData.bio} onChange={
                                (event) => {
                                    if (event.target.value != null) {
                                        setUserData(prevUserData => ({
                                            ...prevUserData, // Spread the previous userData
                                            bio: event.target.value, // Update the 'username' property
                                        }));
                                    }
                                }}>
                            </textarea>
                        </div>
                        
                        <br></br>
                        <button type="button" onClick={submit}>Submit</button>
                    </div>
                    <div className="right-bot">
                        
                    </div>
                </div>
            </div>

            <div className="middle-bot">
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;</span>
            </div>

            <CustomerBar></CustomerBar>
        </div>
    );
}
export default observer(EditProfile)
