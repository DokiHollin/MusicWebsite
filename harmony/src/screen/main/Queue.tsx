import React, {useContext, useEffect, useState} from 'react';
import Modal from 'react-modal';
import 'src/style/Queue.css';

type Song = {
    id: number;
    title: string;
    artist: string;
    time: string;
};

export enum PlayMode {
    SINGLE_REPEAT,
    LIST_REPEAT,
    SHUFFLE
}

const sampleSongs: Song[] = [
    { id: 1, title: "Song 1", artist: "Artist 1", time: "5:20"},
    { id: 2, title: "Song 2", artist: "Artist 2", time: "5:20"},
    // ... add more sample songs as needed
];

function Queue({ mode }: { mode: PlayMode }) {
    const [playMode, setPlayMode] = useState(mode);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);

    const handleSongDoubleClick = (song: Song) => {
        console.log("Song double clicked:", song);
        setSelectedSong(song);
        // TODO: Implement logic to play the selected song
    };

    const handleSongRightClick = (e: React.MouseEvent, song: Song) => {
        e.preventDefault();
        console.log("Song right clicked:", song);
        setShowContextMenu(true);
        // TODO: Implement context menu logic
    };

    useEffect(() => {
        setPlayMode(mode);
    }, [mode]);

    return (
        <div className="queue-container">
            <div className="queue-header">
                <button>待播队列</button>
                <button>已播队列</button>
            </div>
            <div className="song-list">
                {sampleSongs.map(song => (
                    <div
                        key={song.id}
                        onDoubleClick={() => handleSongDoubleClick(song)}
                        onContextMenu={(e) => handleSongRightClick(e, song)}
                        className="song-item"
                    >
                        <text className="song-title">{song.title}</text>
                        <div className="artist-time-wrapper">
                            <text className="song-artist">{song.artist}</text>
                            <text className="song-time">{song.time}</text>
                        </div>
                    </div>
                ))}
            </div>
            {showContextMenu && (
                <Modal
                    isOpen={true}
                    onRequestClose={() => setShowContextMenu(false)}
                    contentLabel="Context Menu"
                    className="option"
                >
                    {/* Context menu content */}
                    <button onClick={() => { /* TODO: Implement remove from queue logic */ }}>Remove from queue</button>
                    <button onClick={() => { /* TODO: Implement other logic if needed */ }}>Other action</button>
                </Modal>
            )}
        </div>
    );
}

export default Queue;
