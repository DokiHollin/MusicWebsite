import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {LeftOutlined} from '@ant-design/icons';
import Header from 'src/component/header/MainPageHeader';
import mock1 from '../resource/searchMockImage/1989_thumbnail.jpg';
import '../style/album.css';
import UserContext from "src/store/UserContext";
import CustomerBar from "../component/MusicPlayer/CustomerBar";
import PlayerContext from "../store/PlayerContext";
import {Song} from "@/model/song";


type AlbumDetailType = {
    album_name: string;
    artist: string;
    release_date: string;
    thumbnail: string;
    songs: Song[];
};

function Album() {
    const { albumId } = useParams<{ albumId: string }>();
    const navigate = useNavigate();

    const [albumDetail, setAlbumDetail] = useState<AlbumDetailType | null>(null);
    const [showInfo, setShowInfo] = useState(false); // Added state for toggle

    const mockAlbumDetail = {
        album_name: "1989",
        artist: "Taylor Swift",
        thumbnail: mock1,
        songs: [
            { song_name: "Hello", duration: "4:55" },
            { song_name: "Send My Love (To Your New Lover)", duration: "3:43" },
            { song_name: "I Miss You", duration: "5:48" },
            { song_name: "When We Were Young", duration: "4:50" }
        ]
    };

    useEffect(() => {
        const fetchAlbumDetail = async () => {
            const url = `http://3.26.210.47/api/album/list-music-by-album/${albumId}`;
            const response = await fetch(url);

          

            const rawData = await response.json();
            console.log(rawData);

            const transformedData = {
                album_name: rawData[0]?.album_name,
                artist: rawData[0]?.artist_name,
                release_date: rawData[0]?.release_year,
                thumbnail: rawData[0]?.S3Image,
                songs: rawData.map(({ S3Info, ...rest }: Song) => ({
                    ...rest
                }))
            };

            console.log(transformedData);
            setAlbumDetail(transformedData);
        };

        fetchAlbumDetail();
    }, [albumId]);


    const toggleView = () => {
        setShowInfo(!showInfo);
    };

    return (
        <div>
            <Header />
            <div className="album-detail-page">
                <div className="album-header">
                    <LeftOutlined onClick={() => navigate(-1)} />
                    <h1>{albumDetail?.album_name}</h1>
                </div>

                <div className="album-meta">
                    <img src={albumDetail?.thumbnail} alt={albumDetail?.album_name} />
                    <div className="album-info">
                        <h2>{albumDetail?.album_name}</h2>
                        <p>By: {albumDetail?.artist}</p>
                        <p>Released: {albumDetail?.release_date}</p>
                    </div>
                </div>

                <div className="album-section-toggle">
                    <h3>{showInfo ? "Album Info" : "Songs in this Album:"}</h3>
                    <button onClick={toggleView}>
                        {showInfo ? "View Song List" : "View Album Info"}
                    </button>
                </div>

                {showInfo ? (
                    <div className="album-info-content">
                        {/* You can expand on this section to provide more album details */}
                        <h2>{albumDetail?.album_name}</h2>
                        <p>By: {albumDetail?.artist}</p>
                        <p>Released: {albumDetail?.release_date}</p>
                    </div>
                ) : (
                    <div className="album-songs">
                        <div className="album-songs-header">
                            <span>No.</span>
                            <span>Song</span>
                            <span>Duration</span>
                        </div>

                        <ul>
                            {albumDetail?.songs.map((song, index) => (
                                <li key={index} className="song-row" onClick={() => {PlayerContext.setCurrentSong(song)}}>
                                    <span className="song-index">{index + 1}</span>
                                    <span className="song-name">{song.music_name}</span>
                                    {/*<span className="song-play"><img src="play_icon.png" alt="Play" /></span>*/}
                                    <span className="song-duration">{song.duration}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <CustomerBar/>
        </div>
    );
}
export default Album;
