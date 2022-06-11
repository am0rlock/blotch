import React from 'react';
import MiniProfile from './components/MiniProfile'
import { gateway } from '../../declarations/gateway/'
import Search from './components/Search';
import ProfilePreview from './components/ProfilePreview';
import ProfileHeader from './components/ProfileHeader';
import GlobalStyle from './styles/GlobalStyle';
import {lightTheme} from './styles/theme'
import NewPost from './components/NewPost';

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
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <ProfileHeader portalPrincipal={this.state.portalPrincipal}></ProfileHeader>
            </div>
            <div>
                <ProfilePreview portalPrincipal={this.state.portalPrincipal}></ProfilePreview>
            </div>
            <NewPost portalPrincipal={this.state.portalPrincipal}></NewPost>
            </>
        )
    }
}

export default App
