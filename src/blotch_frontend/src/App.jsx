import React from 'react';
import MiniProfile from './components/MiniProfile'
import { gateway } from '../../declarations/gateway/'
import Search from './components/Search';
import PostPreview from './components/PostPreview';
import ProfileHeader from './components/ProfileHeader';
import GlobalStyle from './styles/GlobalStyle';
import {lightTheme} from './styles/theme'
import NewPost from './components/NewPost';
import randomPic from '../assets/blotches_logo.png';
import Comment from './components/Comment';

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
        const examplePost = {_id: '0', imgSrc: randomPic, likesCount: 5, commentsCount: 10};
        return (
            <>
            <GlobalStyle theme={lightTheme}></GlobalStyle>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%', margin: '5%'}}>
                    <ProfileHeader portalPrincipal={this.state.portalPrincipal}></ProfileHeader>
                    <NewPost portalPrincipal={this.state.portalPrincipal}></NewPost>
                    <Search></Search>
                </div>
                <PostPreview myPortalPrincipal={this.state.portalPrincipal} portalPrincipal={this.state.portalPrincipal} posts={[examplePost, examplePost, examplePost]}></PostPreview>
            </div>
            <Comment comment={{'user': {'username': 'commenterUser', 'avatar': randomPic}, 'text': 'hello world'}} hideavatar={true}></Comment>
            </>
        )
    }
}

export default App
