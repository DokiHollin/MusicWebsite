export interface Song{
    Album : number;
    MusicID: number;
    Musician: number;
    Only_for_vip: boolean;  
    S3Image: string;
    S3Info: string;
    S3Lrc: string;
    S3MV: string;
    S3Music: string;
    album_name: string;
    artist_name: string;
    click_count: number;
    duration: string;
    is_active: boolean;
    music_name: string;
    name: string;
}

export interface PlayingQueue{
    songs: Song[];
    currentID: number;
}
