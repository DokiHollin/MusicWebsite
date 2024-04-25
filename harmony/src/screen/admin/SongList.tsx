import {useState} from "react";
import 'src/style/Admin.css';
import React from "react";
import {Divider} from 'antd';

type SongListProps = {
    songs: Music[];
};

type Music = {
    musicName: string;
    musicianName: string;
    musicURL: string;
}

function SongList({ songs }: SongListProps) {
    const [showModal, setShowModal] = useState(false);
    const [removeReason, setRemoveReason] = useState('');

    return (
        <div>
            {songs.map((song: Music, index: number) => (
                <React.Fragment key={index}>
                    <div key={index} className="song-item">
                        <div>{song.musicName} by {song.musicianName}</div>
                        <div>
                            <button onClick={() => { /* Frozen/Unfrozen Logic */ }}>Frozen</button>
                            <button onClick={() => setShowModal(true)}>Remove</button>
                        </div>
                    </div>
                    {index !== songs.length - 1 && <Divider className="divider"/>}
                </React.Fragment>
            ))}
            {showModal && (
                <div className="modal">
                    <textarea
                        value={removeReason}
                        onChange={(e) => setRemoveReason(e.target.value)}
                        placeholder="Enter remove reason..."
                    />
                    <div>
                        <button onClick={() => setShowModal(false)}>Confirm</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SongList;
