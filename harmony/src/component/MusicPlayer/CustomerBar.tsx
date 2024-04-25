import React, {useCallback, useEffect, useRef, useState} from 'react';
import 'src/style/bottomBar/customerBar.css'

import logo from "../resource/logo.png";
import ReactPlayer from "react-player/lazy";
import "bootstrap-icons/font/bootstrap-icons.css";
import {useNavigate} from "react-router-dom";
import {
    LockOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    SearchOutlined,
    StepBackwardOutlined,
    StepForwardOutlined,
    UnlockOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import PlayerContext from "src/store/PlayerContext";
import Queue, {PlayMode} from '../../screen/main/Queue';
import { Observer, observer } from 'mobx-react-lite';
import { runInAction, toJS } from 'mobx';
import CustomReactPlayer from 'src/component/MusicPlayer/CustomerMusicPlayer';
import Modal from 'react-modal';
import Tmp from "../../screen/main/Tmp";
import MainPageHeader from 'src/component/header/MainPageHeader';

import BG from 'src/screen/layout/bg/index'
import UserContext from 'src/store/UserContext';
function CustomerBar(){
       //==============测试用
       const [showDropdown, setShowDropdown] = useState(false);

       //=========


       // const { playerState, setPlayerState } = useContext(PlayerContext);
       const playerStore = PlayerContext;
       const navigate = useNavigate();
    //    const songUrl = 'https://elec3609.s3.ap-southeast-2.amazonaws.com/%E5%85%89%E8%BE%89%E5%B2%81%E6%9C%88/ghsy.mp3';
        const songUrl = playerStore.currentSong.S3Music;
        const currentMusicImage = playerStore.currentSong.S3Image;
        // console.log(playerStore.currentSong)
        const playerRef = useRef<ReactPlayer>(null);
       const [previousVolume, setPreviousVolume] = useState(0.5);
       const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    //    const [showPlayScreen, setShowPlayScreen] = useState(false);
       const [showQueueModal, setShowQueueModal] = useState(false);
       const [playMode, setPlayMode] = useState(PlayMode.LIST_REPEAT);
        // const [barLocker, setLocker] = useState(false);
        const [isLocked, setIsLocked] = useState(true);

       const toggleMute = () => {
           if(playerStore.volume > 0) {
               setPreviousVolume(playerStore.volume);
               playerStore.volume = 0;
           } else {
               playerStore.volume = previousVolume;
           }
       }

       function convertToSeconds(duration:any) {
        if(duration){
            const [minutes, seconds] = duration.split(":").map(Number);
            return minutes * 60 + seconds;
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
               console.log(playerStore.volume)
           }
       }, []);
       function handlePlay() {
           runInAction(() => {
               playerStore.playing = true
           })
           console.log('playing')

         
       }
       function handlePause() {
           runInAction(() => {
               playerStore.playing = false
           })

       }

       //用于管理底部滑动
       const [isMouseNearBottom, setIsMouseNearBottom] = useState(false);

       useEffect(() => {
        const handleMouseMove = (e: { clientY: number; }) => {
            if (!isLocked) {
                setIsMouseNearBottom(false);
            } else {
                setIsMouseNearBottom(e.clientY > window.innerHeight * 0.9);
            }
        };
    
        window.addEventListener('mousemove', handleMouseMove);
    
        return () => {
            // Clean up the event listener when the component unmounts
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isLocked]);
    

  
       const handleMouseMove = (e: { clientY: any; }) => {
            const windowHeight = window.innerHeight;
            const mouseY = e.clientY;
        
            // if(!isLocked){  // 如果工具条没有锁定
            //     setIsMouseNearBottom(mouseY > windowHeight * 0.9);
            // } else {  // 如果工具条被锁定
            //     setIsMouseNearBottom(false);  // 保持工具条为不展开状态
            // }
        };
    
    
       

       useEffect(() => {
           window.addEventListener('mousemove', handleMouseMove);
           return () => window.removeEventListener('mousemove', handleMouseMove);
       }, []);

       const getBottomClassName = () => {
           if (playerStore.showPlayScreen) {
               return 'fixed-bottom';
           }
           if (!isMouseNearBottom) {
               return 'hidden-bottom';
           }
           return '';
       };

       function toggleImage(){
        runInAction(()=>{
            PlayerContext.setExpanded(true);
        })
       }
       function backwardSec(){
        runInAction(() => {
                playerStore.playedSeconds -= 10;
                if (playerRef.current) {
                    playerRef.current.seekTo(playerStore.playedSeconds, 'seconds');
                }
            });
        }
        
        function forwardSec(){
            runInAction(() => {
                playerStore.playedSeconds += 10;
                if (playerRef.current) {
                    playerRef.current.seekTo(playerStore.playedSeconds, 'seconds');
                }
            });
        }
        //检查是否在queue
        useEffect(() => {
            // 1. 检查 currentSong 是否已经在 playingQueue.songs 中
          
            const isCurrentSongInQueue = UserContext.playingQueue.songs.some(song => song.MusicID === playerStore.currentSong.MusicID);
        
            // 2. 如果 currentSong 不在 playingQueue.songs 中，则将其添加到数组的开头
            if (!isCurrentSongInQueue) {
                runInAction(() => {
                    UserContext.playingQueue.songs.unshift(playerStore.currentSong);
                    // 3. 将 currentID 设置为 0
                    UserContext.playingQueue.currentID = 0;
                });
            }
        }, [playerStore.currentSong, UserContext.playingQueue]);
        
        //结束逻辑
        // const handleSongEnd = () => {
        //     // 如果当前ID不是队列的最后一首歌
        //     if (UserContext.playingQueue.currentID < toJS(UserContext.playingQueue.songs).length - 1) {
        //         runInAction(() => {
        //             UserContext.playingQueue.currentID += 1;
        //             playerStore.currentSong = UserContext.playingQueue.songs[UserContext.playingQueue.currentID];
        //         });
        //     } else {
        //         // 如果已经是队列的最后一首歌，则重置到第一首
        //         runInAction(() => {
        //             UserContext.playingQueue.currentID = 0;
        //             playerStore.currentSong = UserContext.playingQueue.songs[0];
        //         });
        //     }
        //     playerStore.togglePlaying(true);
        // }
        // const handleSongEnd = () => {
        //     runInAction(() => {
        //         // 查找当前歌曲在songs数组中的索引
        //         const currentIndex = UserContext.playingQueue.songs.findIndex(song => song.MusicID === UserContext.playingQueue.currentID);
        
        //         // 判断当前歌曲是否是最后一首
        //         if (currentIndex < UserContext.playingQueue.songs.length - 1) {
        //             // 如果不是，设置currentID为下一首歌的MusicID
        //             UserContext.playingQueue.currentID = UserContext.playingQueue.songs[currentIndex + 1].MusicID;
        //             playerStore.currentSong = UserContext.playingQueue.songs[currentIndex + 1];
        //         } else {
        //             // 如果是最后一首歌，重置到第一首歌的MusicID
        //             UserContext.playingQueue.currentID = UserContext.playingQueue.songs[0].MusicID;
        //             playerStore.currentSong = UserContext.playingQueue.songs[0];
        //         }
        //     });
        //     playerStore.togglePlaying(true);
        // }
        const handleSongEnd = () => {
            runInAction(() => {
                // 查找当前歌曲在songs数组中的索引
                const currentIndex = UserContext.playingQueue.songs.findIndex(song => song.MusicID === playerStore.currentSong.MusicID); // 使用 playerStore.currentSong.MusicID 查找
                
                // 判断当前歌曲是否是最后一首
                if (currentIndex < UserContext.playingQueue.songs.length - 1) {
                    // 如果不是，设置currentID为下一首歌的MusicID
                    UserContext.playingQueue.currentID = UserContext.playingQueue.songs[currentIndex + 1].MusicID;
                    playerStore.currentSong = UserContext.playingQueue.songs[currentIndex + 1];
                } else {
                    // 如果是最后一首歌，重置到第一首歌的MusicID
                    if(UserContext.playingQueue.songs[0]){
                        UserContext.playingQueue.currentID = UserContext.playingQueue.songs[0].MusicID;
                        playerStore.currentSong = UserContext.playingQueue.songs[0];
                    }
                   
                }
            });
            playerStore.togglePlaying(true);
        }
        
        
        
    return(
        <div>
            <Modal
            isOpen={playerStore.showPlayScreen}
            onRequestClose={() => playerStore.showPlayScreen = false}
            contentLabel="PlayScreen"
            // overlayClassName="modal-overlay"
            className="modal-content"
            >
            <Tmp onClose={() => playerStore.showPlayScreen = false}/>
            </Modal>


            {showQueueModal && (
                <div className="modal-queue-content">
                    <Queue mode={playMode}/>
                </div>
            )}

            {/* Bottom Section */}
       
            <div className={`bottom ${getBottomClassName()}`}>
                {/* Song progress bar */}
                <div className="progress-time-bar">
                
                    <input
                        type="range"
                        style={{
                            background: `linear-gradient(to right, pink 0%, pink ${(playerStore.playedSeconds / convertToSeconds(playerStore.currentSong.duration)) * 100}%, #e0e0e0 ${(playerStore.playedSeconds / convertToSeconds(playerStore.currentSong.duration)) * 100}%, #e0e0e0 100%)`
                        }}
                        value={playerStore.playedSeconds}
                        max={convertToSeconds(playerStore.currentSong.duration)}
                        onChange={handleProgressChange}
                    />
                    {/* <LockOutlined className="locker-icon" /> */}
                </div>


                {/* Bottom Controls */}
                <div className="bottom-controls">

                    {/* Left Section: Song Image and Info */}
                    <div className="left-controls">
                        <button className="image-btn" onClick={() => toggleImage()}>
                            <img src={currentMusicImage} alt="Currently Playing Song" />
                        </button>
                        <div className="song-info">
                            <div className="song-title-artist">
                                <span className="song-name">{playerStore.currentSong.music_name}</span> -- <button className="artist-btn">{playerStore.currentSong.artist_name}</button>
                            </div>
                            <div className="progress-time-info">
                                <span>{formatTime(playerStore.playedSeconds)}</span> / <span>{formatTime(convertToSeconds(playerStore.currentSong.duration))}</span>
                            </div>
                        </div>
                    </div>

                    {/*player component*/}
                    <CustomReactPlayer styleType="B" songUrl={songUrl} handlePlay={handlePlay} handlePause={handlePause} playerRef={playerRef} onReady={function (): void {

                    } } onSeek={function (): void {

                    } } onSeeked={function (): void {

                    } } onStart={function (): void {

                    } } onEnded={function (): void {
                        handleSongEnd();
                    } }  
                    
                    />

                    {/* Center Section: Playback Controls */}
                    <div className="center-controls">
                        <button className="image-btn"><StepBackwardOutlined onClick={backwardSec} className="antd-btn"/></button>
                        <button className="image-btn" onClick={handlePlayPause}>
                            {playerStore.playing ? <PauseCircleOutlined  className="antd-btn"/> : <PlayCircleOutlined  className="antd-btn"/>}
                        </button>
                        <button className="image-btn"><StepForwardOutlined onClick={forwardSec} className="antd-btn"/></button>
                    </div>

                    {/* Right Section: Queue Order, Queue and Volume */}
                    <div className="right-controls"  onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                        <div className='rightside-buttons'>
                            <button className="image-btn" onClick={() => {
                                if (playMode === PlayMode.LIST_REPEAT) setPlayMode(PlayMode.SINGLE_REPEAT);
                                else if (playMode === PlayMode.SINGLE_REPEAT) setPlayMode(PlayMode.SHUFFLE);
                                else setPlayMode(PlayMode.LIST_REPEAT);
                            }}>
                                <div>
                                    {playMode === PlayMode.SHUFFLE && <i className="bi bi-shuffle boot-icon" ></i>}
                                    {playMode === PlayMode.SINGLE_REPEAT && <i className="bi bi-repeat-1 boot-icon"></i>}
                                    {playMode === PlayMode.LIST_REPEAT && <i className="bi bi-repeat boot-icon"></i>}
                                </div>
                            </button>
                            {/* <button className="image-btn" onClick={() => {setShowQueueModal(prevState => !prevState)}}>
                                <UnorderedListOutlined className='antd-btn'/>
                            </button> */}
                        </div>





                        <button className="image-btn" onClick={toggleMute}>
                            <i className={playerStore.volume === 0 ? "bi bi-volume-mute boot-icon" : "bi bi-volume-up boot-icon"}></i>
                        </button>
                        {isLocked ? 
                            <UnlockOutlined className="locker-icon locked" onClick={() => { setIsLocked(false)}} /> : 
                            <LockOutlined className="locker-icon unlocked" onClick={() => { setIsLocked(true)}} />
                        }


                        {<input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={playerStore.volume}
                            onChange={handleVolumeChange}
                            className="volume-control"
                            style={{
                                background: `linear-gradient(to right, pink 0%, pink ${(playerStore.volume) * 100}%, rgb(229, 222, 230) ${(playerStore.volume) * 100}%, rgb(229, 222, 230) 100%)`,
                                width:'50%'
                            }}
                        />}
                    </div>
                </div>
            </div>
        </div>

    )
}
export default observer(CustomerBar)
