import React from 'react';
import Search from './components/Search';
import PostPreview from './components/PostPreview';
import ProfileHeader from './components/ProfileHeader';
import GlobalStyle from './styles/GlobalStyle';
import {lightTheme} from './styles/theme'
import NewPost from './components/NewPost';
import { post_database } from '../../declarations/post_database';
import { init, getPortalFromPrincipal, arrayBufferToBase64 } from './utils/index';
import Header from './components/Header';
import defaultProfile from '../assets/default_profile.gif';
import Splash from './components/Splash';

import { BottomNavigation, BottomNavigationAction } from '../../../node_modules/@mui/material/index';
import Home from '../assets/home.svg';
import HomeOutline from '../assets/home-outline.svg';
import Flame from '../assets/flame.svg';
import FlameOutline from '../assets/flame-outline.svg';
import HeartCircle from '../assets/heart-circle.svg';
import HeartCircleOutline from '../assets/heart-circle-outline.svg';
import People from '../assets/people.svg';
import PeopleOutline from '../assets/people-outline.svg';
import Header from './components/Header';
import ReportMenu from './components/ReportMenu';
import ProfileSuggestions from './components/ProfileSuggestions';

var gateway;
export var ph;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'portalPrincipal': '',
            selectedPage: 0,
            postObjects: [],
            topPostObjects: [],
            followingPostObjects: [],
            likedPostObjects: [],
            avatar: defaultProfile,
            loggedIn: false
        };
    }

    getAvatar(portal) {
        portal.getProfile().then(profile => {
            let avatarArray = profile['avatar'];
            let avatarString = arrayBufferToBase64(avatarArray);
            const imgSrc = "data:image/png;base64," + avatarString.toString('base64');
            this.setState({'avatar': imgSrc});
        });
    }

    setGateway(gatewayValue) {
        gateway = gatewayValue;
        this.grabPortalPrincipal();
        this.setState({loggedIn: true});
        console.log('state change');
    }

    grabPortalPrincipal() {
        console.log('grabbing portal principal in app ')
        console.log(gateway)
        gateway.grabPortal().then((portal) => {
            this.setState({'portalPrincipal': portal['ok']}, () => {
                const portal = getPortalFromPrincipal(this.state.portalPrincipal);
                this.getPosts(portal);
                this.getAvatar(portal);
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

    getFollowingPosts = (myPortal) => {
        myPortal.getFollowingPostIDs().then(posts => {
            for(let i = 0; i < posts.length; i++) {
                const portalPrincipal = posts[i].portalPrincipal;
                const portal = getPortalFromPrincipal(portalPrincipal);
                portal.getPost(posts[i]).then(post => {
                    let postObject = post['ok'];
                    postObject['ID'] = posts[i];
                    this.setState(prevState => ({followingPostObjects: [...prevState.followingPostObjects, postObject]}))
                })
            }
        })
    }

    getLikedPosts = (myPortal) => {
        myPortal.getLikedPosts().then(posts => {
            console.log('posts');
            console.log(posts);
            for(let i = 0; i < posts.length; i++) {
                const portalPrincipal = posts[i].portalPrincipal;
                const portal = getPortalFromPrincipal(portalPrincipal);
                portal.getPost(posts[i]).then(post => {
                    let postObject = post['ok'];
                    postObject['ID'] = posts[i];
                    this.setState(prevState => ({likedPostObjects: [...prevState.likedPostObjects, postObject]}));
                });
            }
        })
    }

    getTopPosts = () => {
        post_database.getTopNPosts(0, 11).then(posts => {
            let promises = [];
            let postIDs = [];
            for(let i = 0; i < posts.length; i++) {
                const portalPrincipal = posts[i].portalPrincipal;
                const portal = getPortalFromPrincipal(portalPrincipal);
                postIDs[i] = posts[i];
                promises[i] = portal.getPost(postIDs[i]);
            }
            let postObjects = []
            Promise.all(promises).then(posts => {
                for(let i = 0; i < posts.length; i++) {
                    const post = posts[i];
                    let postObject = post['ok'];
                    postObject['ID'] = postIDs[i];
                    postObjects[i] = postObject;
                }
                this.setState({topPostObjects: postObjects}, () => {
                    console.log('types of posts')
                    console.log(this.state.postObjects);
                    console.log(this.state.topPostObjects);
                });
            })
        });
    }

    handlePageChange = (newValue) => {
        const portal = getPortalFromPrincipal(this.state.portalPrincipal);
        if(newValue == 0) {
            this.setState({postObjects: []}, () => {
                this.grabPortalPrincipal();
            });
        } else if(newValue == 1) {
            this.getTopPosts();
        } else if(newValue == 3) {
            this.setState({followingPostObjects: []}, () => {
                this.getFollowingPosts(portal);
            });
        } else if(newValue == 4) {
            this.setState({likedPostObjects: []}, () => {
                this.getLikedPosts(portal);
            });
        }
        this.setState({selectedPage: newValue})
    }

    logInUser() {
        console.log('logging in')
    }

    componentDidMount() {
        init((gatewayValue) => {this.setGateway(gatewayValue)}, false)
    }

    render() {
        return (
            <>
            <GlobalStyle theme={lightTheme}></GlobalStyle>
            { !this.state.loggedIn &&
                <Splash setGateway={(gatewayValue) => {this.setGateway(gatewayValue)}}></Splash>
            }
            { this.state.loggedIn &&
                <><Header avatar={this.state.avatar}/>
                <div id='container'>
                    {/*Section 0 is home page*/}
                    {   this.state.selectedPage == 0 &&
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%', margin: '1%'}}>
                                <ProfileHeader portalPrincipal={this.state.portalPrincipal}></ProfileHeader>
                                <Search portalPrincipal={this.state.portalPrincipal}></Search>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%'}}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'right', flexDirection: 'row', width: '25%'}}>
                                </div>
                                <div style={{dispaly: 'flex', justifyContent: 'center', width: '50%'}}>
                                    <PostPreview
                                        myPortalPrincipal={this.state.portalPrincipal}
                                        postObjects={this.state.postObjects}
                                    />
                                </div>
                                <div style={{display: 'flex', alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'right', flexDirection: 'row', width: '25%'}}>
                                    <div style={{}}>
                                        <ProfileSuggestions portalPrincipal={this.state.portalPrincipal}></ProfileSuggestions>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {/*Section 1 is featured page*/}
                    { this.state.selectedPage == 1 &&
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%'}}>
                            <PostPreview
                                myPortalPrincipal={this.state.portalPrincipal}
                                postObjects={this.state.topPostObjects}
                            />
                        </div>
                    }
                    {/*Section 2 is featured page*/}
                    { this.state.selectedPage == 3 &&
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%'}}>
                            <PostPreview
                                myPortalPrincipal={this.state.portalPrincipal}
                                postObjects={this.state.followingPostObjects}
                            />
                        </div>
                    }
                    {/*Section 3 is featured page*/}
                    { this.state.selectedPage == 4 &&
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%'}}>
                            <PostPreview
                                myPortalPrincipal={this.state.portalPrincipal}
                                postObjects={this.state.likedPostObjects}
                            />
                        </div>
                    }
                    <div className='bottomNavigationContainer'>
                        <BottomNavigation
                            showLabels
                            value={this.state.selectedPage}
                            onChange={(event, newValue) => {
                                this.handlePageChange(newValue);
                            }}
                            className='bottomNavigation'
                        >
                            <BottomNavigationAction label="Home" icon={this.state.selectedPage == 0 ? <Home /> : <HomeOutline />} />
                            <BottomNavigationAction label="Featured" icon={this.state.selectedPage == 1 ? <Flame /> : <FlameOutline />} />
                            <NewPost portalPrincipal={this.state.portalPrincipal} />
                            <BottomNavigationAction label="Following" icon={this.state.selectedPage == 3 ? <People /> : <PeopleOutline />} />
                            <BottomNavigationAction label="Liked" icon={this.state.selectedPage == 4 ? <HeartCircle /> : <HeartCircleOutline />} />
                        </BottomNavigation>
                    </div>
                </div>
                </>
            }
            </>
        )
    }
}

export default App
