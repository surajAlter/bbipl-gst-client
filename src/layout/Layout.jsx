import React from 'react';
import NavBar from './NavBar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <NavBar/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default Layout;