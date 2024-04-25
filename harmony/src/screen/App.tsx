import React from 'react';
import '../style/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './main/Homepage';
import Login from './login/Login';
import Profile from './profile/Profile'
import Vip from './profile/vip'
import EditProfile from './profile/EditProfile'
import Followers from './profile/Followers'
import Following from './profile/Following'
import Moments from './profile/Moments'

import Forgot from "./login/Forgot";
import Registration from './login/Registration';
import {useState} from "react";
import { observer } from 'mobx-react-lite'
import PlayerContext from '../store/PlayerContext'
import Verify from "./login/Verify";

export default function App() {
  const [playerState, setPlayerState] = useState({
        playedSeconds: 0,
        playing: false,
        volume: 0.5,
        duration: 0,
      });

  return (
    
    <Router>
      <Routes>
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/forgot' element={<Forgot />} />
        <Route path='/verify' element={<Verify />} />
         {/*<Route path='/playscreen' element={<PlayScreen />} /> */}
        <Route path='/vip' element={<Vip />} />
        <Route path='/edit-profile' element={<EditProfile />} />
        {/* <Route path='/playscreen' element={<PlayScreen />} /> */}
        <Route path='/' element={<Homepage />} />
        <Route path='/Followers/:userId' element={<Followers />} />
        <Route path='/Following/:userId' element={<Following />} />
        <Route path='/Moments' element={<Moments />} />
        <Route path="/profile/:userId" element = {<Profile />} />
        
      </Routes>
    </Router>
  );
}

