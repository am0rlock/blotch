import React, { useState, useEffect } from 'react';
import MiniProfile from './components/MiniProfile'
import { gateway } from '../../declarations/gateway/'
import Search from './components/Search';
import ProfilePreview from './components/ProfilePreview';
import GlobalStyle from './styles/GlobalStyle';
import {lightTheme} from './styles/theme'

const App = () => {
    const [portalPrincipal, setPortalPrincipal] = React.useState('');

    async function grabPortalPrincipal() {
        setPortalPrincipal((await gateway.grabPortal())['ok']);
    }

    useEffect(() => {
        grabPortalPrincipal();
    });

    //<FullProfile portalPrincipal={portalPrincipal} />
    console.log("beg load")
    return (
        <>
        <GlobalStyle theme={lightTheme}></GlobalStyle>
        <div>Hello</div>
        <Search></Search>
        <ProfilePreview user={{username: 'hello', fullname: 'hello htere'}}></ProfilePreview>
        <div>
            <MiniProfile portalPrincipal={portalPrincipal} />
        </div>
        </>
    )
}

export default App
