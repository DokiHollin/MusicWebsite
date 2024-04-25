import React, {useEffect, useState} from 'react';
import 'src/style/login/registration.css';
import logo from 'src/resource/logo.png';
import {sendCode, verifyEmail} from "../api/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import invisible from "src/resource/invisible.png";
import eye from "src/resource/eye.png";

function Verify() {
    const navigate = useNavigate();
    const location = useLocation();


    const MAX_RESEND_ATTEMPTS = 3;
    const [allowResend, setAllowResend] = useState(true);
    const [resendCount, setResendCount] = useState(0);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const email = location.state.email;

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                setPasswordError("Passwords do not match.");
            } else {
                setPasswordError('');
            }
        }
    }, [newPassword, confirmPassword]);

    const handleResendEmail = async () => {
        if (!allowResend) {
            alert('Please wait for another minute before trying to resend.');
            return;
        }

        if (resendCount < MAX_RESEND_ATTEMPTS) {
            console.log('Resending verification code...');
            const response = await sendCode(email);
            console.log(response);
            setResendCount(prevCount => prevCount + 1);

            setAllowResend(false);
            setTimeout(() => {
                setAllowResend(true);
            }, 60000);
        } else {
            console.log('Resend limit reached.');
            alert('You have reached the maximum number of resend attempts. Please try again later.');
        }
    };

    const handleVerifyCode = async () => {
        try{
            const response = await verifyEmail(email, newPassword, code);
            console.log(response);
        } catch (error){
            console.log(error);
        }

        navigate('/login');
    };

    return (
        <div className="reg-container">
            <div className="reg-frame">
                <img src={logo} alt="Your Logo" className="reg-logo" onClick={()=>{navigate('/')}} />
                    <div className="reg-input-section">
                        <h2>Enter New Password</h2>
                        <p>We've sent a verification code to your email. Please enter it below:</p>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Verification Code"
                            className="reg-input"
                        />
                        <div className="reg-password-wrapper"
                            onMouseEnter={() => setShowPasswordRules(true)}
                            onMouseLeave={() => setShowPasswordRules(false)}
                        >
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="reg-input"
                            />
                            {/* <img
                                src={showPassword ? invisible : eye}
                                alt="Toggle password visibility"
                                className="password-toggle-icon"
                                onClick={handleTogglePasswordVisibility}
                            /> */}
                            {showPasswordRules && (
                            <div className="password-rules">
                                    Password Rules:
                                    <ul>
                                        <li>At least 8 characters</li>
                                        <li>1 uppercase letter</li>
                                        <li>1 lowercase letter</li>
                                        <li>1 number</li>
                                        <li>1 special character (e.g. !@#$%^&*)</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
                            className="reg-input"
                        />
                        <div className="reg-error">{passwordError}</div>
                        <p className="reg-text-btn" onClick={handleResendEmail}>Resend Email</p>
                        <button className="reg-btn" onClick={handleVerifyCode}>Change Password</button>
                    </div>
            </div>
        </div>
    );
}

export default Verify;