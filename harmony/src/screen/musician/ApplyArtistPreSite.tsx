import React, { useEffect, useState } from 'react';
import 'src/style/applyArtistPreSite.css'
import logo from "src/resource/logo.png";
import haiBao3 from "src/resource/haibao3.jpg"
import haiBao2 from "src/resource/haibao2.png"
import haiBao1 from "src/resource/haibao1.jpg"
import iconE from "src/resource/iconERemovedBG.png"
import { LeftOutlined, MailOutlined, RightOutlined } from '@ant-design/icons';
import { CSSTransition } from 'react-transition-group';
import ApplyHeader from 'src/component/header/ApplyArtistHeader';
import { Navigate, useNavigate } from 'react-router';
import UserContext from 'src/store/UserContext';
import { message } from 'antd';

export default function ApplyArtistPreSite () {
    const haiBaoList = [haiBao1, haiBao2, haiBao3]; // 把所有的海报存入一个数组中
    const [currentIndex, setCurrentIndex] = useState(0); // 用于跟踪当前显示的海报的索引
    const [inProp, setInProp] = useState(true);
    const [slideDirection, setSlideDirection] = useState('next'); // 'next' or 'previous'
    const navigate = useNavigate();

    const handleExited = () => {
        setTimeout(() => {
            setInProp(true);
        }, 0);
    };

    const nextHaiBao = () => {
        setSlideDirection('next');
        setInProp(false);
        setTimeout(() => {
            setCurrentIndex((currentIndex + 1) % haiBaoList.length); // 更新索引
        }, 800);
    };

    const previousHaiBao = () => {
        setSlideDirection('previous');
        setInProp(false);
        setTimeout(() => {
            setCurrentIndex((currentIndex - 1 + haiBaoList.length) % haiBaoList.length); // 更新索引
        }, 800);
    };

    const handleNavApply = ()=>{
        if(UserContext.isLoggedIn){
            navigate('/applyForm')
        }else{
            message.error('Please login first')
        }
    }

    return (
        <div className="container">
            <ApplyHeader/>
            <div className="content">
                <CSSTransition 
                    in={inProp} 
                    timeout={800} 
                    classNames={`slide-${slideDirection}`} 
                    onExited={handleExited}
                >
                    <img src={haiBaoList[currentIndex]} className="poster" alt="海报" />
                </CSSTransition>

                <div className="preA-glass-left" >
                    <LeftOutlined className='left-icon'  onClick={previousHaiBao}/>
                </div>
                <div className="preA-glass-right">
                    <RightOutlined className='right-icon' onClick={nextHaiBao}/>
                </div>
            </div>
            <div id="CorePlayer"></div>
            <div className='apply'>
                <button className="apply-button" onClick={() => {handleNavApply()}}>Apply For Harmony Artists</button>
                <div className="divider"></div>
                <h3 className='Q' onClick={() => {navigate('/menuPage/becomeMusician')}}>what is artist?</h3>
            </div>
        </div>
    );
}


