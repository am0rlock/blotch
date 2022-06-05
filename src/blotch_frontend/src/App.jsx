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
    console.log("Rerendering ----------------")

    //<FullProfile portalPrincipal={portalPrincipal} />
    return (
        <>
        <GlobalStyle theme={lightTheme}></GlobalStyle>
        <div>Hello</div>
        <Search></Search>
        <div style={{border: '1px solid red', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <ProfilePreview portalPrincipal={portalPrincipal}></ProfilePreview>
        </div>
        <div>
            <MiniProfile portalPrincipal={portalPrincipal} />
        </div>
        </>
    )
}

export default App
