
import 'src/style/homepage.css'
import { Observer, observer } from 'mobx-react-lite';
import MainPageHeader from 'src/component/header/MainPageHeader';
import CustomerBar from 'src/component/MusicPlayer/CustomerBar'

function Moments() {
    return (
        <div className="container">
            <MainPageHeader></MainPageHeader>

            {/* Middle Section */}
            <div className="middle">
                {/* Middle Top Section */}
                <div className="middle-top">
                    <div className="left">左 1/5</div>
                    <div className="center">中 3/5</div>
                    <div className="right">右 1/5</div>
                </div>

                {/* Middle Bottom Section */}
                <div className="middle-bottom">
                    <div className="main">主 4/5</div>
                    <div className="sidebar">边 1/5</div>
                </div>
            </div>

            <CustomerBar></CustomerBar>
        </div>
    );
}
export default observer(Moments)
