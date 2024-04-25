import React, { useEffect } from 'react';
import '../style/homepage.css'
import logo from "../resource/logo.png";
import volumeIcon from "../resource/volume.png";
import mute from "../resource/mute.png";
import ReactPlayer from "react-player/lazy";
import "bootstrap-icons/font/bootstrap-icons.css";
import {useNavigate} from "react-router-dom";
import {useState, useRef} from "react";
import {PlayCircleOutlined, StepBackwardOutlined, StepForwardOutlined, UnorderedListOutlined, SearchOutlined, PauseCircleOutlined} from "@ant-design/icons";
import PlayerContext from "../store/PlayerContext";
import { Observer, observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import CustomReactPlayer from './CustomerMusicPlayer';

function EditProfile() {
    // const { playerState, setPlayerState } = useContext(PlayerContext);
    const playerStore = PlayerContext;
    const navigate = useNavigate();
    const songUrl = playerStore.currentSong.S3Image;
    const playerRef = useRef<ReactPlayer>(null);
    const [previousVolume, setPreviousVolume] = useState(0.5);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    const toggleMute = () => {
        if(playerStore.volume > 0) {
            setPreviousVolume(playerStore.volume);
            playerStore.volume = 0;
        } else {
            playerStore.volume = previousVolume;
        }
    }


    const handleSearchClick = () => {
        navigate('./search');
    }

    const handlePlayPause = () => {

        runInAction(() => {
            playerStore.togglePlaying(!playerStore.playing)
        });

    }

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        runInAction(() => {
            playerStore.volume = parseFloat(event.target.value);
        });

    };

    const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPlayedSeconds = parseFloat(event.target.value);

        runInAction(() => {
            playerStore.playedSeconds = newPlayedSeconds;
        });
        if (playerRef.current) {
            playerRef.current.seekTo(newPlayedSeconds, 'seconds');
        }
    }


    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
    }
    useEffect(() => {
        // 当组件首次挂载时，设置 ReactPlayer 的初始位置
        if (playerRef.current && playerStore.playedSeconds > 0) {
            playerRef.current.seekTo(playerStore.playedSeconds, 'seconds');
        }
    }, []);
    function handlePlay() {
        runInAction(() => {
            playerStore.playing = true
        })
        console.log('playingg')


    }
    function handlePause() {
        runInAction(() => {
            playerStore.playing = false
        })

    }

    const [username, setUsername] = useState('JohnDoe'); // Initial username
    const [profilePicture, setProfilePicture] = useState('https://example.com/default-profile.png'); // Initial profile picture URL

    const handleSave = () => {
        // Here, you can save the updated username and profile picture to your backend or storage.
        // You can make an API call to update the user's information.

        // For this example, we'll just log the changes.
        console.log('Updated Username:', username);
        console.log('Updated Profile Picture:', profilePicture);
    };

    return (
        <div className="container">
            {/* Top Section */}
            <div className="top">
                <div className="top-upper">
                    <div className="left">
                        <img src={logo} alt="Logo" className="logo" />
                    </div>
                    <div className="center">
                        <button className="btn">Discover Music</button>
                        <button className="btn">My Music</button>
                        <button className="btn">AI Generation</button>
                        <div className="search-bar">
                            <button className="search-button" onClick={handleSearchClick}>
                                <SearchOutlined className="search-icon"/>
                            </button>
                            <input
                                type="text"
                                placeholder="Search..."
                                onKeyPress={(e) =>
                                { if (e.key === 'Enter') handleSearchClick();}}
                            />
                        </div>
                    </div>
                    <div className="right">
                        <div className="dropdown">
                            <img src='https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=' alt="Cinque Terre" width="100" height="50" />
                            <div className="dropdown-content">
                                <div className="desc">
                                    <button className="profile-btn" onClick={() => navigate('/profile')}>Your Profile</button>
                                    <button className="profile-btn" onClick={() => navigate('/vip')}>VIP</button>
                                    <button className="profile-btn">Notification Center</button>
                                    <button className="profile-btn">Logout</button>
                                </div>
                            </div>
                        </div>
                        
                        <button className="btn">Creator Center</button>
                        <button className="btn" onClick={() => navigate('/login')}>Login</button>
                    </div>
                </div>
                <div className="top-lower">
                   
                </div>
            </div>

            {/* Middle Section */}
            <div className="middle">
                {/* Middle Top Section */}
                <div className="middle-top">
                    <div className="left">左 1/5</div>
                    <div>
                        <h1>Edit Profile</h1>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input
                            type="text"
                            id="username"
                            value={username}
                            />
                        </div>
                        <div>
                            <label htmlFor="profilePicture">Profile Picture URL:</label>
                            <input
                            type="text"
                            id="profilePicture"
                            value={profilePicture}
                            />
                        </div>
                        <button onClick={handleSave}>Save</button>
                    </div>
                    <div className="right">右 1/5</div>
                </div>

                {/* Middle Bottom Section */}
                <div className="middle-bottom">
                    <div className="main">主 4/5</div>
                    <div className="sidebar">边 1/5</div>
                </div>
            </div>

            <div className="bottom">
                {/* Song progress bar */}
                <div className="progress-time-bar">
                    <input
                        type="range"
                        style={{
                            background: `linear-gradient(to right, pink 0%, pink ${(playerStore.playedSeconds / playerStore.duration) * 100}%, #e0e0e0 ${(playerStore.playedSeconds / playerStore.duration) * 100}%, #e0e0e0 100%)`
                        }}
                        value={playerStore.playedSeconds}
                        max={playerStore.duration}
                        onChange={handleProgressChange}
                    />
                </div>


                {/* Bottom Controls */}
                <div className="bottom-controls">

                    {/* Left Section: Song Image and Info */}
                    <div className="left-controls">
                        <button className="image-btn" onClick={() => navigate('/playscreen')}>
                            <img src="https://elec3609.s3.ap-southeast-2.amazonaws.com/%E5%85%89%E8%BE%89%E5%B2%81%E6%9C%88/ghsy.jpg" alt="Currently Playing Song" />
                        </button>
                        <div className="song-info">
                            <div className="song-title-artist">
                                <span className="song-name">Song Name</span> -- <button className="artist-btn">Artist</button>
                            </div>
                            <div className="progress-time-info">
                                <span>{formatTime(playerStore.playedSeconds)}</span> / <span>{formatTime(playerStore.duration)}</span>
                            </div>
                        </div>
                    </div>

                    {/*player component*/}
                    <CustomReactPlayer styleType="B" songUrl={songUrl} handlePlay={handlePlay} handlePause={handlePause} playerRef={playerRef} onReady={function (): void {

                    } } onSeek={function (): void {

                    } } onSeeked={function (): void {

                    } } onStart={function (): void {

                    } } onEnded={function (): void {
                        console.log('testing')
                    } }  />

                    {/* Center Section: Playback Controls */}
                    <div className="center-controls">
                        <button className="image-btn"><StepBackwardOutlined className="antd-btn"/></button>
                        <button className="image-btn" onClick={handlePlayPause}>
                            {playerStore.playing ? <PauseCircleOutlined  className="antd-btn"/> : <PlayCircleOutlined  className="antd-btn"/>}
                        </button>
                        <button className="image-btn"><StepForwardOutlined className="antd-btn"/></button>
                    </div>

                    {/* Right Section: Queue Order, Queue and Volume */}
                    <div className="right-controls"  onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                        <button className="image-btn"><i className="bi bi-shuffle boot-icon" ></i></button>
                        <button className="image-btn"><UnorderedListOutlined className='antd-btn'/></button>
                        {showVolumeSlider &&
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={playerStore.volume}
                                onChange={handleVolumeChange}
                                className="volume-control"
                                style={{
                                    background: `linear-gradient(to right, pink 0%, pink ${(playerStore.volume) * 100}%, #e0e0e0 ${(playerStore.volume) * 100}%, #e0e0e0 100%)`
                                }}
                            />}
                        <button className="image-btn" onClick={toggleMute}>
                            <i className={playerStore.volume === 0 ? "bi bi-volume-mute boot-icon" : "bi bi-volume-up boot-icon"}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default observer(EditProfile)
