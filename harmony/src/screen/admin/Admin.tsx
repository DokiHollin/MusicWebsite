import React, {useEffect, useState} from "react";
import "src/style/Admin.css";
import { useNavigate } from "react-router-dom";
import UploadMusicList from "./UploadMusicList";
import UserList from "./UserList";
import SongList from "./SongList";
import {Divider} from "antd";
import * as get from "../api/apiService";
import Post from "./Post";
import UserContext from "../../store/UserContext";
import userContext from "../../store/UserContext";
import {miniSerializeError} from "@reduxjs/toolkit";

type Music = {
    Album: number;
    MusicID: number;
    Musician: number;
    Only_for_vip: boolean;
    S3Image: string;
    S3Info: string;
    S3Lrc: string;
    S3MV: string | null;
    S3Music: string;
    album_name: string;
    artist_name: string;
    click_count: number;
    duration: string;
    is_active: boolean;
    music_name: string;
};

type User = {
    'MusicianID': number;
    'MusicianName': string;
    'RealName': string;
    'PhoneNumber': number;
    'OutsidePlatform': string;
    'Nickname': string;
    'PlatformFollowers': number;
}

// Three different responsibility for admin
enum Type {
    UploadMusic,
    User,
    Song,
    Post,
}

function Admin() {
    const [currentType, setCurrentType] = useState(Type.UploadMusic);
    const navigate = useNavigate();
    const [submittedMusicList, setSubmittedMusicList] = useState<Music[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [songs, setSongs] = useState<Music[]>([]);
    const token = UserContext.token;

    // const sampleUsers: User[] = [
    //     {
    //         userName: "User A",
    //         userID: "id_1",
    //         reason: "Spamming",
    //         isLock: false,
    //     },
    //     {
    //         userName: "User B",
    //         userID: "id_2",
    //         reason: "",
    //         isLock: false,
    //     },
    // ];

    // music submitted by musician
    const submittedMusic = async() => {
        try {
            const music = await get.getUploadMusic(token);
            setSubmittedMusicList(music);
            // console.log(submittedMusicList[0].MusicID);
            console.log("GETTING MUSIC");
        } catch (error) {
            // @ts-ignore
            setErrorMessage(error.message || 'An error occurred during get.');
        }
    }

    const getMusician = async() => {
        try {
            const musician = await get.getMusician();
            setUsers(musician);
            console.log(musician);
            console.log("Get");
        } catch (error) {
            // @ts-ignore
            // setErrorMessage(error.message || 'An error occurred during get.');
        }
    }

    useEffect(() => {
        // Call the function initially
        submittedMusic();
        getMusician();
        // Set an interval to call the function every 3 seconds
        const interval = setInterval(submittedMusic, 3000);
        const interval2 = setInterval(getMusician, 3000);
        // Clear the interval when the component is unmounted
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="admin">
            <div className="admin-header">
                <div className="button-group">
                    <button onClick={() => {
                        setCurrentType(Type.UploadMusic);
                        submittedMusic();
                    }} className='admin_button'>Upload Music</button>
                    {/*<Divider type='vertical' className='admin_divider'/>*/}
                    <button onClick={() => setCurrentType(Type.User)} className='admin_button'>User</button>
                    {/*<Divider type='vertical' className='admin_divider'/>*/}
                    <button onClick={() => setCurrentType(Type.Song)} className='admin_button'>Song</button>
                    {/*<Divider type='vertical' className='admin_divider'/>*/}
                    <button onClick={() => setCurrentType(Type.Post)} className='admin_button'>Post</button>
                </div>
                <button className='admin_button' onClick={() => {
                    navigate('/')
                    userContext.logout();
                    window.location.reload()
                }}>Logout</button>
            </div>


            <div className="middle-section">
                <input className='admin-input' type="text" placeholder="Search..." />
                <button className='admin-ob'>Search</button>
            </div>

            <div className="bottom-section">
                {currentType === Type.UploadMusic && <UploadMusicList musicList={submittedMusicList} token={token} />}
                {currentType === Type.User && <UserList users={users} />}
                {currentType === Type.Song && <SongList songs={[]} />}
                {currentType === Type.Post && <Post token={token}/>}
            </div>
        </div>
    );
}

export default Admin;
