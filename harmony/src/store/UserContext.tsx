import { PlayingQueue } from "src/model/song";
import { message } from "antd";
import axios from "axios";
import {action, makeAutoObservable, observable} from "mobx";
import { useEffect } from "react";
import PlayerContext from "./PlayerContext";
import AlbumContext from "./AlbumStore";
import { useNavigate } from "react-router-dom";

class UserStore {
    @observable token: string | null = null;
    @observable userID: string | null = null;
    @observable isLoggedIn: boolean = false;
    @observable thumbnailURL: string | null = null;
    @observable random: any = null;
    @observable playingQueue: PlayingQueue  = { currentID: 0, songs: [] };
    @observable BACKGROUND: any;
    @observable updateList: boolean = false;
    @observable myFavSongs: any = null;
    
    constructor() {
        makeAutoObservable(this);

        // Load data from localStorage if available
        this.token = localStorage.getItem('userToken');
        this.userID = localStorage.getItem('userID');
        this.thumbnailURL = localStorage.getItem('thumbnailURL');

        // // Determine the login status based on the token's presence
        this.isLoggedIn = !!this.token;

        const randomJson = localStorage.getItem('random')

        this.random = randomJson ? JSON.parse(randomJson) : []

        const playingQJson = localStorage.getItem('playingQueue')
        const temp = playingQJson ? JSON.parse(playingQJson) : { currentID: 0, songs: [] };
        this.playingQueue.songs = temp.songs
        this.playingQueue.currentID = temp.currentID
        
        const updateListJson = localStorage.getItem('updateList')
        this.updateList = updateListJson ? JSON.parse(updateListJson) :false;
    
        const myFavSongsJson = localStorage.getItem('myFavSongs')
        if(myFavSongsJson !== 'undefined'){
            console.log(myFavSongsJson === 'undefined')
            this.myFavSongs = myFavSongsJson ? JSON.parse(myFavSongsJson) : [];
        }
        
        // this.reset()
        // this.myFavSongs = myFavSongsJson ? JSON.parse(myFavSongsJson) :null;
        
        // // this.reset();

    }

    @action
    setUserData(data: { token: string, userID: string, thumbnailURL: string, username?: string, role?: string }) {

        this.token = data.token;
        this.userID = data.userID;
        this.thumbnailURL = data.thumbnailURL;
        this.isLoggedIn = true;

        // Save to localStorage
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userID', data.userID);
        localStorage.setItem('thumbnailURL', data.thumbnailURL);
        console.log(this.token)
    }

    @action
    logout() {
        this.token = null;
        this.userID = null;
        this.thumbnailURL = null;
        this.isLoggedIn = false;
        // Remove from localStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('userID');
        localStorage.removeItem('thumbnailURL');
        localStorage.removeItem('random');
        localStorage.removeItem('playingQueue');
        this.reset()
        PlayerContext.reset()
        AlbumContext.reset()
    }

    @action
    setRandom(random: any){
        this.random = random;
        console.log(random)
        localStorage.setItem('random', JSON.stringify(this.random))
        // localStorage.setItem('random', random);
    }

    @action
    setQueue(queue: any){
        this.playingQueue.currentID = 0;
        this.playingQueue.songs = queue;
        console.log(queue)
        localStorage.setItem('playingQueue', JSON.stringify(this.playingQueue))

    }

    @action
    setQueueCurrent(id: number) {
        // console.log("Setting currentID for MusicID:", id);
        // console.log("Songs in the queue:", JSON.stringify(this.playingQueue.songs));

        const index = this.playingQueue.songs.findIndex(song => Number(song.MusicID) === Number(id));

        if (index !== -1) {
            this.playingQueue.currentID = index;
            PlayerContext.currentSong = this.playingQueue.songs[index];
            console.log(PlayerContext.currentSong)
            PlayerContext.togglePlaying(true);
        } else {
            console.error("Song with MusicID:", id, "not found in the queue.");
        }

    }

    @action
    setUpdate(isUpdate: boolean){
        this.updateList = isUpdate;
        localStorage.setItem('updateList', JSON.stringify(this.updateList))
    }

    @action
    setMyFav(favs: any){
        this.myFavSongs = favs;
        localStorage.setItem('myFavSongs', JSON.stringify(this.myFavSongs))
    }

    reset() {

        localStorage.removeItem('token')
        this.token = ''
    
        localStorage.removeItem('userID')
        this.userID = ''
    
        localStorage.removeItem('isLoggedIn')
        this.isLoggedIn = false
    
        localStorage.removeItem('thumbnailURL')
        this.thumbnailURL = ''
    
        localStorage.removeItem('random')
        this.random = ''
    
        localStorage.removeItem('playingQueue')
        this.playingQueue = { currentID: 0, songs: [] };
        
        localStorage.removeItem('updateList')
        this.updateList = false;
        
        localStorage.removeItem('myFavSongs')
        this.myFavSongs = [];
    
      }

}

const UserContext = new UserStore();

export default UserContext;
