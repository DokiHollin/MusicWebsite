import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'src/style/homepage.css'


import "bootstrap-icons/font/bootstrap-icons.css";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import PlayerContext from "src/store/PlayerContext";
import { Observer, observer } from 'mobx-react-lite';
import MainPageHeader from 'src/component/header/MainPageHeader';

import CustomerBar from 'src/component/MusicPlayer/CustomerBar'
import UserContext from 'src/store/UserContext';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider, {CustomArrowProps} from "react-slick";
import * as api from "../api/apiService";
import {CSSTransition} from "react-transition-group";
import {useNavigate} from "react-router-dom";

type Album = {
    album_id: number;
    musician: number;
    album_name: string;
    release_date: Date;
    genre: string;
    album_picture_url: string;
    bio: string;
    musician_name: string;
}

interface Poster {
    url: string;
}

interface Music {
    MusicID: number;
    S3Info: string;
    Musician: number;
    Album: number;
    S3Lrc: string;
    S3Music: string;
    Only_for_vip: boolean;
    S3Image: string;
    S3MV: string;
    click_count: number;
    is_active: boolean;
    music_name: string;
    artist_name: string;
    duration: string;
    album_name: string;
    name: string;
}

function Homepage() {
    const navigate = useNavigate();
    const [posters, setPosters] = useState<Poster[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [album, setAlbum] = useState<Album[]>([]);
    const [inProp, setInProp] = useState(true);
    const [slideDirection, setSlideDirection] = useState('next');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [ranking, setRanking] = useState<Music[]>([]);
    const token = UserContext.token;
    
    const handleExited = () => {
        setTimeout(() => {
            setInProp(true);
        }, 0);
    };

    // const nextHaiBao = () => {
    //     setSlideDirection('next');
    //     setInProp(false);
    //     setTimeout(() => {
    //         setCurrentIndex((currentIndex + 1) % posters.length);
    //     }, 800);
    // };
    const nextHaiBao = () => {
        setSlideDirection('next');
        setInProp(false);
        setTimeout(() => {
            if (posters.length > 0) {
                setCurrentIndex((currentIndex + 1) % posters.length);
            }
        }, 800);
    };
    

    const previousHaiBao = () => {
        setSlideDirection('previous');
        setInProp(false);
        setTimeout(() => {
            setCurrentIndex((currentIndex - 1 + posters.length) % posters.length);
        }, 800);
    };

    const handleScrollToComponent = (id: string) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {

        const apiUrl = "http://3.26.210.47/api/homepage_poster/posters/";

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    // throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                setPosters(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("There was a problem with the fetch operation:", error);
                setIsLoading(false);
            });
    }, []);

    async function getAlbum() {
        try{
            const data = await api.getAlbum(token);
            setAlbum(data);
            return album;
        } catch (error) {
            console.error(error);
        }
    }

    async function getRanking() {
        try {
            const data = await api.ranking(token);
            setRanking(data);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    function handleImageClick(albumId: number) {
        navigate(`/album/${albumId}`);
        console.log("Album clicked:", albumId);
        // 例如，如果你使用 react-router，你可以使用 history.push('/album/' + albumId);
    }

    // useEffect(() => {
    //     // 设置自动滚动的定时器
    //     const autoScrollInterval = setInterval(nextHaiBao, 5000);
    
    //     // 返回清除函数以清除定时器
    //     return () => clearInterval(autoScrollInterval);
    // }, [posters.length]);
    

    // getAlbum();
    // getRanking();
    useEffect(() => {
        // 立即调用一次
        getAlbum();
        getRanking();
    
        // 设置定时器
        const intervalId = setInterval(() => {
            getAlbum();
            getRanking();
        }, 5000);  // 每5分钟调用一次
    
        // 返回一个清除函数来清除定时器，确保在组件卸载时停止请求
        return () => clearInterval(intervalId);
    }, []);  // 由于依赖数组为空，这个 useEffect 只在组件挂载和卸载时运行
    

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (

        <div className="container">
            {/* Top Section */}
            <div className='main-top'>
                {!PlayerContext.showPlayScreen && (
                    <MainPageHeader></MainPageHeader>
                )}

                <div className="top-lower">
                    <div className='contain'>
                        <button onClick={() => {handleScrollToComponent("Poster")}}>poster</button>
                        <button onClick={() => {handleScrollToComponent("Rec")}}>popular recommendation</button>
                        <button onClick={() => {handleScrollToComponent("Rank")}}>ranking</button>
                    </div>
                </div>
            </div>

            {!PlayerContext.showPlayScreen && (
                <div className="middle">

                    {/* 滚动海报 */}
                    <div className="middle-top" id="Poster">
                        <div className="glass-left" >
                            <LeftOutlined className='left-icon'  onClick={previousHaiBao}/>
                        </div>
                        <div className='center'>
                            <CSSTransition
                                in={inProp}
                                timeout={800}
                                classNames={`slide-${slideDirection}`}
                                onExited={handleExited}
                            >
                                <div className="slide-container">
                                    {/* <img src={posters[currentIndex].url} className="poster" alt="海报" /> */}
                                    {posters[currentIndex] && <img src={posters[currentIndex].url} className="poster" alt="海报" />}

                                </div>
                            </CSSTransition>
                        </div>
                        <div className="glass-right">
                            <RightOutlined className='right-icon' onClick={nextHaiBao}/>
                        </div>
                    </div>


                    {/* Middle Bottom Section */}
                    <div className="middle-bottom" id="Rec">
                        <div className="white-left"/>
                        <div className='main'>
                            <div className="text-left-top">Popular recommendation</div>
                            <div className="flex-container">
                                {album.slice(0, 8).map((a, index) => (
                                    <div className="flex-item" key={index}>
                                        <img
                                            src={a.album_picture_url}
                                            alt={a.album_name}
                                            onClick={() => handleImageClick(a.album_id)}
                                        />
                                        <div className="album-name">{a.album_name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="white-right"/>
                    </div>

                    <div className='middle-bottom' id="Rank">
                        <div className='white-left'/>
                        <div className='rank'>
                            <div className="text-left-top">Popular Ranking</div>
                            <div className='homepage-title'>
                                <p>Cover</p>
                                <p>Song name</p>
                                <p>Artist name</p>
                                <p>Duration</p>
                            </div>
                            {ranking.map((music, index) => (
                                <button key={music.MusicID} className={`musicItem`} onClick={() => {PlayerContext.setCurrentSong(music)}}>
                                    <img src={music.S3Image} alt={music.music_name} className='musicItemImage'/>
                                    <p>{music.music_name}</p>
                                    <p>{music.artist_name}</p>
                                    <p>{music.duration}</p>
                                </button>
                            ))}
                        </div>
                        <div className='white-right'/>
                    </div>
                </div>


            )}

            <CustomerBar></CustomerBar>

        </div>
    );
}
export default observer(Homepage)
