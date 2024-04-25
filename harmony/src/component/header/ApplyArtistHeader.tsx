import iconE from "../../resource/iconERemovedBG.png"
import logo from "../../resource/logo.png";
import { LeftOutlined, MailOutlined, RightOutlined } from '@ant-design/icons';
import 'src/style/header/applyHeader.css'
import { useNavigate } from "react-router-dom";

function ApplyArtistHeader(){
    const navigate = useNavigate();
    return(
        <div className="apply-header">
        <div className="apply-header-left">
            <img src={logo} alt="Website Icon" className="apply-website-icon" />
            <div className='apply-router-name'>
                <a className="applyNav" onClick={() => {navigate('/')}}>Homepage</a>
                <a className="applyNav" onClick={() => {navigate('/menuPage/whatNext')}}>Regular Question</a>
                <a className="applyNav" onClick={() => {navigate('/menuPage/contact')}}>About Us</a>
            </div>
            
        </div>
        <div className="apply-header-right">
            <img src={iconE} alt="Avatar" className="apply-avatar-icon" />
            <div className="apply-divider"></div>
            <MailOutlined style={{color:'white', fontSize:'120%'}}/>
        </div>
    </div>
    )

}

export default(ApplyArtistHeader)
