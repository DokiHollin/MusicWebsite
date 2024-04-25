// import { connect } from 'react-redux';
import './index.scss';

import TransparentBox1 from 'src/components/transparentBox1'
import { Fragment } from 'react';
import gif from 'src/assets/gifs/ely.gif'
import { observer } from 'mobx-react-lite';
import UserContext from 'src/store/UserContext';
import PlayerContext from 'src/store/PlayerContext';
function MiddleGreeting(props: { [propName: string]: any }) {
  const greeting = () => {
    const h = new Date().getHours();
    if (h >= 4 && h < 11) return 'Good Morning';
    else if (h >= 11 && h < 14) return 'Good Afternoon';
    else if (h >= 14 && h < 18) return 'Good Evening';
    else return 'Good Evening';
  };

  const getPersonal = () => {

    PlayerContext.setIsMyListPage(true)
  };

  return (
    
    <TransparentBox1>
  
      <div className="middle_greeting">
        <div className="greeting">
          {greeting()},
          {props.isLogin ? (
            props.name
          ) : (
            <span
              className="underline_button"
              onClick={() => props.showLoginModal(true)}
            >
              
            </span>
          )}
        </div>
        <div className="random_song">
          {UserContext.isLoggedIn ? (
            <Fragment>
              <span
                className="underline_button"
                onClick={() => getPersonal()}
              >
                Get your playlist
              </span>
              <span
                className="underline_button"
                onClick={() => props.showLogoutModal(true)}
              >
                Logout account
              </span>
            </Fragment>
          ) : (
            <span>Login Unlock More Functionalities</span>
          )}
        </div>
        <div className="control_box">
          <span>Now Playing</span>
          {/* <MusicControler />
          <TimeSlider /> */}
          <img src={gif} alt="Animated graphic" className="gif_class" />
        
        </div>
      </div>
    </TransparentBox1>
  );
}
export default observer(MiddleGreeting);


