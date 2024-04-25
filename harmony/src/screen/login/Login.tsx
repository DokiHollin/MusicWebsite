import * as api from '../api/apiService';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'src/style/login/login.css';
import logo from 'src/resource/logo.png'
import { GoogleLogin } from 'react-google-login';
import UserContext from "../../store/UserContext";
import { observer } from 'mobx-react-lite';

import Bubble from './Bubble'
import { runInAction } from 'mobx';

const Login: React.FC = observer(() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.backgroundImage = 'linear-gradient(to left, pink, #d689e1)';
        document.body.style.display = 'flex';
        document.body.style.justifyContent = 'center';
        document.body.style.overflowX = 'hidden';
        // 在组件卸载时恢复原始样式
        return () => {
          document.body.style.backgroundImage = '';
          document.body.style.display = '';
          document.body.style.justifyContent = '';
          document.body.style.overflowX = '';
        };
      }, []);  // 空数组意味着这个useEffect只在组件挂载和卸载时运行


    const handleLogin = async () => {
        try {
            const loginData = await api.login(email, password);

            if (loginData.token) {
                const userDetailHeaders = {
                    "Authorization": `token ${loginData.token}`
                };

                const userDetails = await api.getUserDetails(userDetailHeaders);

                if (userDetails && userDetails.user_id) {
                    const userData = {
                        token: loginData.token,
                        userID: userDetails.user_id,
                        thumbnailURL: userDetails.thumbnailURL,
                    };

                    runInAction(() => {
                        UserContext.setUserData(userData);
                    });

                    // Only navigate if everything above was successful.
                    if (loginData.is_superuser) {
                        navigate("/Admin");
                    } else {
                        navigate('/');
                    }
                } else {
                    throw new Error('User details not found');
                }
            } else {
                throw new Error('Token not received');
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('An unexpected error occurred');
            }
        }
    };



    const responseGoogle = (response: any) => {
        console.log("Google Login Response");
        console.log(response);
        // Handle the response from Google, which includes the user's information and tokens
    }

    return (
        <div >
            <Bubble></Bubble>
            <div className="login-container">
            <div className="login-b"></div>

            <div className="login-c">
            <button className="text-btn forgot-password" onClick={() => navigate('/forgot')}>Forgot password?</button>
                <div className="login-d">
                <img src={logo} alt="Your Logo" onClick={()=>{navigate('/')}} className="login-logo" />
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="login-e"
                    />
                    <input
                        type="password"
                        className="login-e"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="PASSWORD"
                    />
                    {errorMessage && <p className="error-message">Incorrect password!</p>}
                    
                 <button className="text-btn register-text" onClick={() => navigate('/registration')}>No account? Click here to register</button>
                    <div style={{paddingLeft:'10%',paddingTop:'5%'}}>
                        {/* <GoogleLogin
                            clientId="728796471136-uh56ivhkefj2rv0qbpkt9cnmu0fdvgmf.apps.googleusercontent.com"
                            buttonText="Login with Google"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                         /> */}
                    </div>
                    <a href="#" className="login-g" onClick={handleLogin}>Login</a>
                    {errorMessage && <p className="login-error-message">{errorMessage}</p>}
                </div>
            </div>
            </div>
        </div>

    )
})

export default Login;
