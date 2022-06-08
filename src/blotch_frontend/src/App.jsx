import React, { useState, useEffect } from 'react';
import MiniProfile from './components/MiniProfile'
import { gateway } from '../../declarations/gateway/'
import Search from './components/Search';
import ProfilePreview from './components/ProfilePreview';
import ProfileHeader from './components/ProfileHeader';
import GlobalStyle from './styles/GlobalStyle';
import {lightTheme} from './styles/theme'
import unknownProfile from '../assets/UnknownProfile.png'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'portalPrincipal': ''
        };
    }

    grabPortalPrincipal() {
        gateway.grabPortal().then((portal) => {
            this.setState({'portalPrincipal': portal['ok']});
        });
    }

    componentDidMount() {
        this.grabPortalPrincipal();
    }

    render() {
        return (
            <>
            <GlobalStyle theme={lightTheme}></GlobalStyle>
            <div>Hello</div>
            <Search></Search>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <ProfileHeader portalPrincipal={this.state.portalPrincipal}></ProfileHeader>
            </div>
            <div>
                <MiniProfile portalPrincipal={this.state.portalPrincipal} />
                <ProfilePreview portalPrincipal={this.state.portalPrincipal}></ProfilePreview>
            </div>
            </>
        )
    }
}

export default App
