import React from 'react';
import loadable from '@loadable/component';
import { Routes, Route, Navigate } from 'react-router-dom';

// pages
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));

const App = () => {
    return (
        <Routes>
            <Route path="/" element={ <LogIn /> } />
            <Route path="login" element={ <LogIn /> } />
            <Route path="signup" element={ <SignUp /> } />
        </Routes>
    );
};

export default App;