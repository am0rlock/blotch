import React, { useState, useEffect } from 'react';
import MiniProfile from './components/MiniProfile'
import { gateway } from '../../declarations/gateway/'
import Search from './components/Search';
import ProfilePreview from './components/ProfilePreview';
import ProfileHeader from './components/ProfileHeader';
import GlobalStyle from './styles/GlobalStyle';
import {lightTheme} from './styles/theme'
import unknownProfile from '../assets/UnknownProfile.png'

const App = () => {
    const [portalPrincipal, setPortalPrincipal] = React.useState('');

    async function grabPortalPrincipal() {
        setPortalPrincipal((await gateway.grabPortal())['ok']);
    }

    useEffect(() => {
        grabPortalPrincipal();
    });

    //<FullProfile portalPrincipal={portalPrincipal} />
    return (
        <>
        <GlobalStyle theme={lightTheme}></GlobalStyle>
        <div>Hello</div>
        <Search></Search>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <ProfileHeader portalPrincipal={portalPrincipal}></ProfileHeader>
        </div>
        <div>
            <MiniProfile portalPrincipal={portalPrincipal} />
            <ProfilePreview portalPrincipal={portalPrincipal}></ProfilePreview>
        </div>
        </>
    )
}

export default App
