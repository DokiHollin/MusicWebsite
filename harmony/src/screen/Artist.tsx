import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import Header from 'src/component/header/MainPageHeader';
import UserContext from "src/store/UserContext";
import '../style/artist.css';

interface Album {
    album_id: number;
    musician: number;
    album_name: string;
    release_date: string;
    genre: string;
    album_picture_url: string;
    bio: string;
    musician_name: string;
}

const Artist: React.FC = () => {
    const navigate = useNavigate();

    const { artistId } = useParams<{ artistId: string }>();
    const [albums, setAlbums] = useState<Album[]>([]);

    useEffect(() => {
        const fetchAlbumsByArtist = async () => {

            const url = `http://3.26.210.47/api/album/musician/${artistId}/albums/search`;

            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `token ${UserContext.token}`,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setAlbums(data);
                } else {
                    console.error("Failed to fetch albums for the artist");
                }
            } catch (error) {
                console.error("There was an error while fetching the albums:", error);
            }
        };

        fetchAlbumsByArtist();
    }, [artistId]);

    return (
        <div>
            <Header />
            <div className="artist-detail-page">
                <div className="artist-header">
                    <LeftOutlined onClick={() => navigate(-1)} />
                    <h1>{albums[0]?.musician_name || 'Artist'}</h1>
                </div>

                <div className="artist-albums">
                    <h3>Albums by {albums[0]?.musician_name || 'Artist'}</h3>

                    <ul>
                        {albums.map(album => (
                            <li key={album.album_id} className="album-row">
                                <Link to={`/album/${album.album_id}`}>
                                    <img src={album.album_picture_url} alt={album.album_name} />
                                    <span>{album.album_name}</span>
                                    <p>Release Date: {album.release_date}</p>
                                    <p>Genre: {album.genre}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Artist;
