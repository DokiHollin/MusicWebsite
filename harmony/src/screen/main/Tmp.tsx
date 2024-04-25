import React from 'react';
import { useSpring, animated } from 'react-spring';
import {useState, useRef, useEffect} from "react";
import ReactPlayer from "react-player/lazy";
import Lyric from "lyric-parser";
import PlayerContext from "src/store/PlayerContext";
import "src/style/tmp.css";
import { HeartTwoTone, CommentOutlined, CloudDownloadOutlined, HeartFilled,FolderAddOutlined } from '@ant-design/icons';
import UserContext from 'src/store/UserContext';
import { toJS } from 'mobx';
import { addFav, removeFav } from 'src/api/music';
import AlbumContext from 'src/store/AlbumStore';
import { getUserFav, getUserPlayList } from 'src/api/SongList';
import { Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addMusicToPlaylist } from '../api/apiService';

type Playlist = {
    Playlist_ID: string;
    Playlist_Name: string;
  };
function Tmp({ onClose }: { onClose: () => void }) {
    const navigate = useNavigate();
    type LyricLine = {
        time: number;
        txt: string;
    }
    // heart's usestate
    const [isHearted, setIsHearted] = useState(false);

    const playerStore = PlayerContext;
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [currentLine, setCurrentLine] = useState(0);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);
    const LRC_URL = PlayerContext.currentSong.S3Lrc;
    const scrollTopRef = useRef(null);
    const [props, set] = useSpring(() => ({ scrollTop: 0 }));
    const playerRef = useRef<ReactPlayer>(null);
    const [rotationAngle, setRotationAngle] = useState(0);
    const rotationRef = useRef<number | null>(null);
    const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
    const [selectedSongName, setSelectedSongName] = useState<string | null>(null);
    function lyricHandler({ lineNum, txt }: { lineNum: number, txt: string }) {
        setCurrentLine(lineNum);
    }
    useEffect(()=>{
        if(toJS(UserContext.myFavSongs)){
            let isSongInList;
            if(toJS(UserContext.myFavSongs) !== null || (toJS(UserContext.myFavSongs) !== 'undefined')){
                isSongInList = toJS(UserContext.myFavSongs).some((song: { music_name: string; }) => song.music_name === playerStore.currentSong.music_name);
            }else{
                isSongInList = false;
            }
            
            console.log(toJS(UserContext.myFavSongs))
            if (isSongInList) {
                setIsHearted(true);
            }
        }else{
            AlbumContext.setLoadingAlbum(true);
            const list = getUserFav(Number(UserContext.userID));
            list.then(data => {
                console.log(data);  // 输出 fetch 返回的实际数据
                // If you want to update the AlbumContext with this data, you can do it here
                UserContext.setMyFav(data)
                AlbumContext.setLoadingAlbum(false);
            });
            let isSongInList;
            if((toJS(UserContext.myFavSongs) === null) || (toJS(UserContext.myFavSongs) === undefined)){
                isSongInList = false;
            }else{
                console.log(toJS(UserContext.myFavSongs) === undefined)
                console.log(toJS(UserContext.myFavSongs))
                isSongInList = toJS(UserContext.myFavSongs).some((song: { music_name: string; }) => song.music_name === playerStore.currentSong.music_name);
            }
            
            console.log(toJS(UserContext.myFavSongs))
            if (isSongInList) {
                setIsHearted(true);
            }
        }
        
    },[])
    useEffect(() => {
        if (playerStore.playing) {
            rotationRef.current = window.setInterval(() => {
                setRotationAngle((prevAngle) => (prevAngle + 3));
            }, 100);
        } else {
            if (rotationRef.current !== null) {
                clearInterval(rotationRef.current);
            }
        }

        return () => {
            if (rotationRef.current !== null) {
                clearInterval(rotationRef.current);
            }
        };
    }, [playerStore.playing]);

    useEffect(() => {
        if (playerRef.current && playerStore.playedSeconds > 0) {
            playerRef.current.seekTo(playerStore.playedSeconds + 0.3, 'seconds');
        }
        fetch(LRC_URL)
            .then(response => {
                console.log(`Received lyric data:`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {

                const lyric = new Lyric(data, lyricHandler);
                setLyrics(lyric.lines);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error.message);
            });

    }, []);


    useEffect(() => {
        if (lyricsContainerRef.current) {
            const lyricsElement = lyricsContainerRef.current;
            const lineHeight = 24;
            const targetScrollTop = currentLine * lineHeight - (lineHeight * 3);
            set({ scrollTop: targetScrollTop });
        }
    }, [currentLine, set]);


    useEffect(() => {
        if (scrollTopRef.current && lyricsContainerRef.current) {
            lyricsContainerRef.current.scrollTop = scrollTopRef.current;
        }
    }, [props.scrollTop]);

    useEffect(() => {
        // console.log('Played seconds:', playerStore.playedSeconds);
        let activeLine = 0;
        for (let i = 0; i < lyrics.length; i++) {
            if (playerStore.playedSeconds * 1000 >= lyrics[i].time) {
                activeLine = i;

            }
        }
        
        setCurrentLine(activeLine);
    }, [playerStore.playedSeconds, lyrics]);

    //handle click heart icon
    const handleHeartClick = () => {
        if (isHearted) {
            // dislike music
            console.log('123')
            removeFav(Number(UserContext.userID), Number(playerStore.currentSong.MusicID))
            const updatedFavSongs = UserContext.myFavSongs.filter((song: { MusicID: number; }) => song.MusicID !== playerStore.currentSong.MusicID);
            console.log(toJS(updatedFavSongs))
            if (JSON.stringify(toJS(AlbumContext.albumSongs)) === JSON.stringify(toJS(UserContext.myFavSongs))) {
                console.log('same')
                AlbumContext.setAlbumSongs(toJS(updatedFavSongs))
            } else {
                console.log(toJS(AlbumContext.albumSongs))
                console.log(toJS(UserContext.myFavSongs))
            }
            
            
            UserContext.setMyFav(toJS(updatedFavSongs))
            message.success('Successfully Remove Favorite')
            setIsHearted(false);
        } else {
            // like music
            addFav(Number(UserContext.userID), Number(playerStore.currentSong.MusicID))
           
            if (JSON.stringify(toJS(AlbumContext.albumSongs)) === JSON.stringify(toJS(UserContext.myFavSongs))) {
                    UserContext.myFavSongs.push(playerStore.currentSong);
                    const updatedFavSongs = [...UserContext.myFavSongs];    
                    console.log('same')
                    AlbumContext.setAlbumSongs(toJS(updatedFavSongs))
            }

            setIsHearted(true);
            message.success('Successfully Add Favorite')
            console.log('333')
        }
        
    }
    
    
    const handleCommentClick = () => {
        // 这里放置点击评论图标后的逻辑
        message.success('Still in developing')
    }
    
    const handleDownloadClick = () => {
        // 这里放置点击下载图标后的逻辑
        addToPlaylist(PlayerContext.currentSong.MusicID.toString(), PlayerContext.currentSong.music_name)
    }
    
    async function addToPlaylist(songId: string, songName: string) {
        if (!UserContext.isLoggedIn) {
            navigate("/login");
        } else {
            setSelectedSongId(songId);
            setSelectedSongName(songName);

            const playlists = await getUserPlayList(Number(UserContext.userID));
            if (playlists.length === 0) {
                message.error("You don't have any playlists. Create one first!");
            } else {
                setUserPlaylists(playlists);
                setShowPlaylistModal(true);
            }
        }
    }

    async function handlePlaylistSelection(playlistId: string, songId: string | null) {
        const data = await addMusicToPlaylist(selectedSongId, UserContext.userID,playlistId );
        console.log('Successfully added to playlist!', data);
        message.success(`Adding song ${songId} to playlist ${playlistId}`);
        setShowPlaylistModal(false);
    }

    return (
        <div className="full-screen-modal">
            <button onClick={onClose}>Close</button>
            {/* Left side - Song image */}
            <div className="left-side">
                <div className="playscreen-circle">
                    {/*<img src="https://elec3609.s3.ap-southeast-2.amazonaws.com/%E5%85%89%E8%BE%89%E5%B2%81%E6%9C%88/ghsy.jpg" alt="beyond" className={`playscreen-song-art ${playerStore.playing ? 'rotate-image' : ''}`} />*/}
                    <img src={playerStore.currentSong.S3Image} alt="beyond" className="playscreen-song-art" style={{ transform: `rotate(${rotationAngle}deg)`}}/>
                </div>
            </div>
            {UserContext.isLoggedIn && (
                <div className="icon-container" >
                    <HeartFilled 
                        
                        onClick={handleHeartClick} 
                        style={{ color: isHearted ? "red" : "white" }} // isHearted to change color
                    />
                    <CommentOutlined style={{color:'white'}} onClick={handleCommentClick} />
                    <FolderAddOutlined  style={{color:'white'}} onClick={handleDownloadClick} />
                </div>
            )}
            
            {/* Right side - Lyrics */}
            <div className="right-side">
                <div className="playscreen-lyrics" ref={lyricsContainerRef}>
                    {lyrics.map((line, index) => (
                        <div
                            key={index}
                            className={`lyric-line ${index === currentLine ? 'current' : ''}`}
                        >
                            {line.txt}
                        </div>
                    ))}
                </div>
            </div>
            <Modal
                title="Add to Playlist"
                open={showPlaylistModal}
                onCancel={() => {
                    setShowPlaylistModal(false);
                    setSelectedSongId(null);
                    setSelectedSongName(null);
                }}
                footer={null}  // No footer since we're customizing our options.
            >
                <p><strong>Song:</strong> {selectedSongName}</p>
                <p>Select a playlist to add your song:</p>

                <div className="playlists-container">
                    {userPlaylists.map(playlist => (
                        <div
                            key={playlist.Playlist_ID}
                            className="playlist-card"
                            onClick={() => handlePlaylistSelection(playlist.Playlist_ID, selectedSongId)}
                        >
                            <div className="playlist-name">{playlist.Playlist_Name}</div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

export default Tmp;
