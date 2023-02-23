import './App.css';
import React, { useState } from 'react';
import {Route, Routes, Navigate, BrowserRouter} from "react-router-dom";
import SigninComponent from './components/auth/singin.component';
import SignupComponent from './components/auth/signup.component';
import ProfileComponent from './components/auth/profile.component';
import RegisterComponent from './components/register/register.component';


export default function App() {
    const [user, setUser] = useState(
        {
            schoolName: null,
            managerName: null,
            directNumber: null,
        }
    );
    const [isSignin, setIsSignin] = useState(false);

    const signin = (object) => {
        setUser(object);
        setIsSignin(true);
    }

    const signout = () => {
        setUser({
            schoolName: null,
            managerName: null,
            directNumber: null,
        });
        setIsSignin(false);
        sessionStorage.clear();
    }

    const sessionHandler = () => {
        const session = JSON.parse(sessionStorage.getItem("user"));

        if (session) {
            signin(session);
        } 
    };

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ sessionStorage.getItem("user") ? <Navigate to="/register"/> : <Navigate to="/signin"/> } />
                    {/* <Route path="/reservation" element={<Reservation signout={signout} />} /> */}
                    <Route path="/signin" element={ sessionStorage.getItem("user") ? <Navigate to="/"/> : <SigninComponent signin={signin} />} />
                    <Route path="/signup" element={ sessionStorage.getItem("user") ? <Navigate to="/" /> : <SignupComponent/>} />
                    <Route path="/profile" element={ sessionStorage.getItem("user") ? <ProfileComponent signin={signin} signout={signout} /> : <Navigate to="/signin"/> } />
                    <Route path="/register" element= { sessionStorage.getItem("user") ? <RegisterComponent signin={signin} signout={signout} /> : <Navigate to="/"/>} />
                    <Route path="*" element={<Navigate to="/"/>} />
                </Routes>
                {/* <ProfileComponent /> */}
            </BrowserRouter>
        </div>
    );
}


function Reservation() {
    return <h2>Home</h2>;
}