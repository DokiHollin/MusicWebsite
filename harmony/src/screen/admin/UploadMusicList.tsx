import {useState} from "react";
import "src/style/Admin.css";
import { Divider } from 'antd';
import React from "react";
import {PauseCircleOutlined, PlayCircleOutlined} from "@ant-design/icons";
import ReactPlayer from "react-player";
import * as api from "../api/apiService";

type UploadMusicListProps = {
    musicList: Music[];
    token: string | null;
};

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

function UploadMusicList({ musicList, token }: UploadMusicListProps) {
    const [showModal, setShowModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [playing, setPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [url, setUrl] = useState("");
    const [id, setId] = useState(0);

    async function approveMusic(id: number) {
        try {
            const data = await api.approveMusic(id, token);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteMusic(id: number) {
        try {
            const data = await api.deleteMusic(id);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {musicList.map((music: Music, index: number) => (
                <React.Fragment key={index}>
                    <div className="music-item">
                        <div>{music.music_name} by {music.artist_name}</div>
                        <div>
                            <button className='admin_button'
                                    onClick={() => {
                                        if (currentIndex != index) setPlaying(true);
                                        else setPlaying(!playing);
                                        setCurrentIndex(index);
                                        setUrl(music.S3Music)
                                    }}
                                    key={index}>
                                {playing && index === currentIndex ? <PauseCircleOutlined className="admin-antd-btn"/> :
                                    <PlayCircleOutlined className="admin-antd-btn"/>}
                            </button>
                            <button onClick={() => {approveMusic(music.MusicID)}} className='admin-ob'>Approve</button>
                            <button onClick={() => {
                                setShowModal(true);
                                setId(music.MusicID);
                            }} className='admin-ob'>Reject</button>
                        </div>
                    </div>
                    {index !== musicList.length - 1 && <Divider className="admin_divider"/>}
                </React.Fragment>
            ))}
            <ReactPlayer playing={playing} url={url} controls={true} width="0" height="0"/>
            {showModal && (
                <div className="modal">
                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter reject reason..."
                    />
                    <div>
                        <button onClick={() => {
                            setShowModal(false);
                            deleteMusic(id);
                        }}>Confirm</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadMusicList;
