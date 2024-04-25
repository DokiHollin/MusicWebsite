import { makeAutoObservable ,action, observable } from 'mobx';
import { Navigate, RouteObject } from 'react-router-dom';
import { load } from '../router/MyRouter';
import React from "react";
import exp from "constants";
import { Song } from 'src/model/song';

class AlbumStore {
    @observable selectedAlbum:  { [propName: string]: any } = [];
    @observable albumSongs:  { [propName: string]: any }[] = [];
    @observable loadingAlbum: boolean = false;
  
    constructor() {
        makeAutoObservable(this);

        const selectedAlbumJson = localStorage.getItem('selectedAlbum')
        this.selectedAlbum = selectedAlbumJson ? JSON.parse(selectedAlbumJson) : []
        
        const songsJson = localStorage.getItem('albumSongs')
        if(songsJson !== 'undefined'){
            this.albumSongs = songsJson ? JSON.parse(songsJson) : []
        }else{}
        this.albumSongs = []
        
    }

    @action
    setCurrentAlbum(album: any ){
        this.selectedAlbum  = album;
      
        localStorage.setItem('selectedAlbum', JSON.stringify(this.selectedAlbum))
        console.log(AlbumContext.selectedAlbum)
    }

    @action
    setAlbumSongs(songs: any){
        this.albumSongs  = songs;
        localStorage.setItem('albumSongs', JSON.stringify(this.albumSongs))
        
    }

    @action
    setLoadingAlbum(isLoading: boolean){
        this.loadingAlbum = isLoading;
    }

    reset() {


        localStorage.removeItem('selectedAlbum')
        this.selectedAlbum = []
    
        localStorage.removeItem('albumSongs')
        this.albumSongs = []
    
        localStorage.removeItem('loadingAlbum')
        this.loadingAlbum = false

    
    
      }

}

const AlbumContext = new AlbumStore();

export default AlbumContext;