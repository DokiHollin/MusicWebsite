import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import '../style/search.css';
import mock1 from '../resource/searchMockImage/24k_magic_thumbnail.jpg'
import mock2 from '../resource/searchMockImage/1989_thumbnail.jpg'
import mock3 from '../resource/searchMockImage/25_thumbnail.jpg'
import mock4 from '../resource/searchMockImage/divide_thumbnail.jpg'
import Header from 'src/component/header/MainPageHeader'
import UserContext from "src/store/UserContext";
import {message, Modal} from "antd";
import {addMusicToPlaylist, followUserSearch, unfollowUserSearch} from "src/screen/api/apiService";

function Search() {

    type Playlist = {
      id: string;
      name: string;
    };


    const mockData = {
        artists: [
            { MusicianName: "Adele" },
            { MusicianName: "Taylor Swift" },
            { MusicianName: "Ed Sheeran" },
            { MusicianName: "Bruno Mars" },
        ],
        songs: [
            { name: "Rolling in the Deep", artist: "Adele" },
            { name: "Love Story", artist: "Taylor Swift" },
            { name: "Shape of You", artist: "Ed Sheeran" },
            { name: "Uptown Funk", artist: "Bruno Mars" },
        ],
        albums: [
            { album_name: "25", thumbnail: mock3 },
            { album_name: "1989", thumbnail: mock2 },
            { album_name: "Divide", thumbnail: mock4 },
            { album_name: "24K Magic", thumbnail: mock1 },
        ],
        users: [
            { name: "john_doe" },
            { name: "jane_smith" },
            { name: "music_fan_01" },
            { name: "songlover23" },
        ]
    };

    const location = useLocation();
    const navigate = useNavigate();

    const [results, setResults] = useState(mockData);
    const [filter, setFilter] = useState('all');
    const query = location.state?.searchTerm || '';

    const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
    const [selectedSongName, setSelectedSongName] = useState<string | null>(null);
    const [followedUsers, setFollowedUsers] = useState<string[]>([]);

    function navigateToAlbumPage(albumId: string) {
    // Navigate to the album page with the given albumId
        if (!UserContext.isLoggedIn) {
            navigate("/login");
        } else {
            navigate(`/album/${albumId}`);
        }
    }

    function navigateToArtistProfile(artistId: string) {
        // Navigate to the artist's profile with the given artistId
        if (!UserContext.isLoggedIn) {
            navigate("/login");
        } else {
            navigate(`/artist/${artistId}`);
        }
    }

    async function followUser(userId: string) {
        if (!UserContext.isLoggedIn) {
            navigate("/login");
        } else {
            await followUserSearch(userId);

            // Add user to followed users array
            setFollowedUsers(prevFollowedUsers => [...prevFollowedUsers, userId]);
        }
    }

    async function unfollowUser(userId: string) {
        if (!UserContext.isLoggedIn) {
            navigate("/login");
        } else {
            await unfollowUserSearch(userId); // Assuming you have this API function to handle unfollowing

            // Remove user from followed users array
            setFollowedUsers(prevFollowedUsers => prevFollowedUsers.filter(id => id !== userId));
        }
    }



    async function addToPlaylist(songId: string, songName: string) {
        if (!UserContext.isLoggedIn) {
            navigate("/login");
        } else {
            setSelectedSongId(songId);
            setSelectedSongName(songName);

            const playlists = await fetchUserPlaylists(UserContext.userID);
            if (playlists.length === 0) {
                message.error("You don't have any playlists. Create one first!");
            } else {
                setUserPlaylists(playlists);
                setShowPlaylistModal(true);
                message.success('Add successful')
            }
        }
    }

    async function handlePlaylistSelection(playlistId: string, songId: string | null) {
        const data = await addMusicToPlaylist(selectedSongId, UserContext.userID,playlistId);

        console.log('Successfully added to playlist!', data);
        console.log(`Adding song ${songId} to playlist ${playlistId}`);
        setShowPlaylistModal(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            const url = `http://3.26.210.47/api/search/search/?q=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data)
            setResults(data);
        };
        fetchData()
    }, [query]);

    const ResultSection = ({ title, items, type }: { title: string; items: any[]; type?: string }) => (
        <div className={`result-section ${type || ''}`}>
            <h2>{title}</h2>
            {items.map((item, index) => {
                if (type === 'album') {
                    return (
                        <div key={index} className="album-item" onClick={() => navigateToAlbumPage(item.id)}>
                            <img src={item.thumbnail} alt={item.name} className="album-thumbnail" />
                            <div>{item.album_name}</div>
                        </div>
                    );
                } else if (type === 'artist') {
                    return (
                        <div key={index} className="artist-item" onClick={() => navigateToArtistProfile(item.id)}>
                            {item.MusicianName}
                        </div>
                    );
                } else if (type === 'user') {
                    return (
                        <div key={index} className="user-item" >
                            <div>{item.name}</div>
                            {followedUsers.includes(item.id) ? (
                                <button onClick={() => unfollowUser(item.id)}>Unfollow</button>
                            ) : (
                                <button onClick={() => followUser(item.id)}>Follow</button>
                            )}
                        </div>
                    );
                } else {
                    return (
                        <div key={index} className="result-item">
                            <div className="song-title">{item.name}</div>
                            {item.artist && <div className="song-artist">{item.artist}</div>}
                            <button onClick={() => addToPlaylist(item.id, item.name)}>Add to Playlist</button>
                        </div>
                    );
                }
            })}
        </div>
    );

    return (
        <div>
            <Header></Header>
            <div className="search-page">
                <div className="search-header">
                    <LeftOutlined onClick={() => navigate(-1)} />
                    <h1>Search Results for {query}:</h1>
                </div>

                <div className="filters">
                    <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
                    <button className={filter === 'artists' ? 'active' : ''} onClick={() => setFilter('artists')}>Artist</button>
                    <button className={filter === 'songs' ? 'active' : ''} onClick={() => setFilter('songs')}>Song</button>
                    <button className={filter === 'albums' ? 'active' : ''} onClick={() => setFilter('albums')}>Albums</button>
                    <button className={filter === 'users' ? 'active' : ''} onClick={() => setFilter('users')}>Users</button>
                </div>


                {filter === 'all' && (
                    <>
                        <ResultSection title="Related Artist:" items={results.artists} type={'artist'}/>
                        <ResultSection title="Related Songs:" items={results.songs} type={'songs'}/>
                        <ResultSection title="Related Albums:" items={results.albums} type="album" />
                        <ResultSection title="Users:" items={results.users} type={'user'}/>
                    </>
                )}

                {filter === 'artists' && <ResultSection title="Related Artist:" items={results.artists} type={'artist'}/>}
                {filter === 'songs' && <ResultSection title="Related Songs:" items={results.songs} type={'songs'}/>}
                {filter === 'albums' && <ResultSection title="Related Albums:" items={results.albums} type="album" />}
                {filter === 'users' && <ResultSection title="Users:" items={results.users} type={'user'}/>}
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
                            key={playlist.id}
                            className="playlist-card"
                            onClick={() => handlePlaylistSelection(playlist.id, selectedSongId)}
                        >
                            <div className="playlist-name">{playlist.name}</div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
        
       
    );
}

async function fetchUserPlaylists(userId: string | null) {
    if (userId) {
        try {
            const url = `http://3.26.210.47/api/playlist/${userId}/playlists/`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${UserContext.token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch playlists");
            }

            const data = await response.json();
            // Assuming the API returns a list of objects with Playlist_ID and Playlist_Name
            return data.map((item: any) => ({
                id: item.Playlist_ID,
                name: item.Playlist_Name
            }));
        } catch (error) {
            console.error("Error fetching playlists:", error);
            return [];
        }
    } else {
        return [];
    }
}

export default Search;
