import 'src/style/profile/vip.css';

import "bootstrap-icons/font/bootstrap-icons.css";
import { Observer, observer } from 'mobx-react-lite';
import CustomerBar from 'src/component/MusicPlayer/CustomerBar'
import MainPageHeader from 'src/component/header/MainPageHeader';

function Vip() {
    
    return (
        <div className="vip">
            <MainPageHeader></MainPageHeader>
            {/* Middle Section */}
            <div className="vip-container">
              <h1>VIP Pricing</h1>
              <p>Unlock the world of music with our premium music subscription service! Subscribe now and let the rhythm of life flow with your every beat.</p>
              <div>
                <span>&nbsp;&nbsp;</span>
                <span>&nbsp;&nbsp;</span>
              </div>
              
              <div className="pricing-tier">
                <div className="row">
                  <div className="column"><span>&nbsp;&nbsp;</span></div>
                  <div className="c">
                    <h2>Pro</h2>
                    <h1>$15/Month</h1>
                    <ul>
                      <li>Exclusive VIP Songs</li>
                      <li>Ad Free Music</li>
                      <li>Help center access</li>
                      <li>Priority email support</li>
                    </ul>
                    <br></br>
                    <button className="vip-btn">Get Started</button>
                  </div>
                  <div className="column"><span>&nbsp;&nbsp;</span></div>
                </div>
              </div>
            </div>

            <div className="middle-bot-vip">
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
            </div>

            <CustomerBar></CustomerBar>
        </div>
    );
}
export default observer(Vip)


