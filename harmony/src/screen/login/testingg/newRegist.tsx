import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import './new-regist.css'
import logo from 'src/resource/logo.png'
import eye from 'src/resource/eye.png'
import invisible from 'src/resource/invisible.png'
import {register, sendEmailForRegister} from '../../api/apiService'


export default function NewRegist() {
    const navigate = useNavigate();

    // Email Verification Section
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const MAX_RESEND_ATTEMPTS = 3;
    const [allowResend, setAllowResend] = useState(true);
    const [resendCount, setResendCount] = useState(0);
    const [verificationCode, setVerificationCode] = useState('');

    // User Name and Gender Section
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const [genderError, setGenderError] = useState<string>('');

    // Password Validation
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState('');

    // Error Checking Message for All
    const [errorMessage, setErrorMessage] = useState('');

    // Error Checking for Email Format
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

    // Error Checking for Password Validation
    useEffect(() => {
        if (password && passwordConfirm) {
            if (password !== passwordConfirm) {
                setPasswordConfirmError("Passwords do not match.");
            } else {
                setPasswordConfirmError('');
            }
        }
    }, [password, passwordConfirm]);

    // Password Visibility Update
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Send & Resend Verification with Limits
    const handleSendVerificationEmail = async () => {
        if (!allowResend) {
            alert('Please wait for another minute before trying to resend.');
            return;
        }

        if (resendCount < MAX_RESEND_ATTEMPTS) {
            console.log('Resending verification code...');

            try {
                const data = await sendEmailForRegister(email);
                console.log(data);
                alert("Verification email sent!");
            } catch (error) {
                setErrorMessage("Failed to send verification email, or email already exist.");
            }

            setResendCount(prevCount => prevCount + 1);
            setAllowResend(false);
            setTimeout(() => {
                setAllowResend(true);
            }, 30000);
        } else {
            console.log('Resend limit reached.');
            alert('You have reached the maximum number of resend attempts. Please try again later.');
        }
    };

    // Registration Logic
    const handleRegistration = async () => {
        if (!gender) {
            setGenderError('Please select a gender.');
            return;  // Prevent further execution
        } else {
            setGenderError(''); // Reset any previous gender errors
        }

        if (emailError || passwordConfirmError) {
            setErrorMessage("Please correct the errors before proceeding.");
            return;
        }

        try {
            // register user with required information
            const data = await register(email, username, password, verificationCode, gender);
            console.log(data);
            alert("Registration Succeed!\n You can now proceed to Login");
            navigate('/login');
        } catch (error) {
            const err = error as Error;
            let errorMessage = '';

            if (err.message.includes("custom user with this email already exists")) {
                errorMessage += "Email already exists. ";
            }
            if (err.message.includes("custom user with this username already exists")) {
                errorMessage += "Username already exists. ";
            }

            if (!errorMessage) {
                errorMessage = 'An error occurred during registration. Please Check Your Input';
            }
            setErrorMessage(errorMessage);  // Set the error message to the emailError state
        }
    };

    return (
        
        <div className="registration-frame">
            <img src={logo} alt="Your Logo" onClick={()=>{navigate('/')}} className="registration-logo" />

            <div className="input-section">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="regist-input"
                />
                <div className="error">{emailError}</div>
                <div className="verification-section">
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Verification Code"
                    />
                    <button className={'send-email-btn'} onClick={handleSendVerificationEmail}>Send Email</button>
                </div>

                <div className="username-gender-wrapper">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="" disabled>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="secrete">Secret</option>
                    </select>
                </div>
                <div className="error">{genderError}</div>
                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="regist-input"
                    />
                    <img
                        src={showPassword ? invisible : eye}
                        alt="Toggle password visibility"
                        className="password-toggle-icon"
                        onClick={handleTogglePasswordVisibility}
                    />
                </div>
                <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Confirm Password"
                    className="regist-input"
                />
                <div className="error">{passwordConfirmError}</div>
            </div>
            <button className="registration-btn" onClick={handleRegistration}>Register</button>
            <div className="error">{errorMessage}</div>
            <button className="text-btn login-text" onClick={() => navigate('/login')}>Already have an account? Click here to login</button>
        </div>
       
    )
}