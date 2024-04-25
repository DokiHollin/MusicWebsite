import {useEffect, useState} from 'react';
import 'src/style/login/registration.css';
import logo from 'src/resource/logo.png'
import {useNavigate} from "react-router-dom";
import {sendCode} from "../api/apiService";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        if (email) {
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) {
                setEmailError("Invalid email address.");
            } else {
                setEmailError('');
            }
        }
    }, [email]);

    const handleSendCode = async () => {
        // const exists = await emailExists(email);
        const exists = true;
        if (exists && email) {
            console.log("email exists");
            const data = await sendCode(email);
            console.log(data);
            navigate('/verify', { state: { email, from: 'forgot' } });
        } else {
            console.log("email doesn't exist");
            setEmailError('This email is not registered.');
        }
    };

    return (
        <div className="reg-container">
            <div className="reg-frame">
                <img src={logo} alt="Your Logo" className="reg-logo"  onClick={()=>{navigate('/')}}/>
                <div className="reg-input-section">
                    <h2>Forgot Password</h2>
                    <p>Please enter your email to receive the verification code:</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="reg-input"
                    />
                    {emailError && <p className="reg-error">{emailError}</p>}
                    <button className="reg-btn" onClick={handleSendCode}>Send Code</button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
