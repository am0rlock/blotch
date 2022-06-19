import React from 'react';
import { gateway } from '../../declarations/gateway/';
import Search from './components/Search';
import PostPreview from './components/PostPreview';
import ProfileHeader from './components/ProfileHeader';
import GlobalStyle from './styles/GlobalStyle';
import {lightTheme} from './styles/theme'
import NewPost from './components/NewPost';
import { createActor } from "../../declarations/portal";

import { BottomNavigation, BottomNavigationAction } from '../../../node_modules/@mui/material/index';
import Home from '../assets/home.svg';
import HomeOutline from '../assets/home-outline.svg';
import Flame from '../assets/flame.svg';
import FlameOutline from '../assets/flame-outline.svg';
import HeartCircle from '../assets/heart-circle.svg';
import HeartCircleOutline from '../assets/heart-circle-outline.svg';
import People from '../assets/people.svg';
import PeopleOutline from '../assets/people-outline.svg';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'portalPrincipal': '',
            selectedPage: 0,
            postObjects: []
        };
    }

    grabPortalPrincipal() {
        gateway.grabPortal().then((portal) => {
            this.setState({'portalPrincipal': portal['ok']}, () => {
                console.log('portal princ')
                console.log(this.state.portalPrincipal);
                this.getPosts(createActor(this.state.portalPrincipal));
            });
        });
    }

	getPost = (portal, postID) => {
		portal.getPost(postID).then(post => {
			let postObject = post['ok'];
			postObject['ID'] = postID;
			this.setState(prevState => ({'postObjects': [...prevState.postObjects, postObject]}), () => {
			});
		});
	}

	getPosts = (portal) => {
		portal.getPostIDs().then(posts => {
			for(let i = 0; i < posts.length; i++) {
				this.getPost(portal, posts[i]);
			}
		});
	}

    componentDidMount() {
        this.grabPortalPrincipal();
    }

    render() {
        return (
            <>
            <GlobalStyle theme={lightTheme}></GlobalStyle>
            <div id='container'>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%', margin: '1%'}}>
                        <ProfileHeader portalPrincipal={this.state.portalPrincipal}></ProfileHeader>
                        <NewPost portalPrincipal={this.state.portalPrincipal}></NewPost>
                        <Search portalPrincipal={this.state.portalPrincipal}></Search>
                    </div>
                    <PostPreview
                        myPortalPrincipal={this.state.portalPrincipal}
                        postObjects={this.state.postObjects}
                        portalPrincipal={this.state.portalPrincipal}
                    />
                </div>
                <div className='bottomNavigationContainer'>
                    <BottomNavigation
                        showLabels
                        value={this.state.selectedPage}
                        onChange={(event, newValue) => {
                            this.setState({selectedPage: newValue})
                        }}
                        className='bottomNavigation'
                    >
                        <BottomNavigationAction label="Home" icon={this.state.selectedPage == 0 ? <Home /> : <HomeOutline />} />
                        <BottomNavigationAction label="Featured" icon={this.state.selectedPage == 1 ? <Flame /> : <FlameOutline />} />
                        <BottomNavigationAction label="Following" icon={this.state.selectedPage == 2 ? <People /> : <PeopleOutline />} />
                        <BottomNavigationAction label="Liked" icon={this.state.selectedPage == 3 ? <HeartCircle /> : <HeartCircleOutline />} />
                    </BottomNavigation>
                </div>
            </div>
            </>
        )
    }
}

export default App
