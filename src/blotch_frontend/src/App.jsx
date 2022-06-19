import React from 'react';
import Search from './components/Search';
import PostPreview from './components/PostPreview';
import ProfileHeader from './components/ProfileHeader';
import GlobalStyle from './styles/GlobalStyle';
import {lightTheme} from './styles/theme'
import NewPost from './components/NewPost';
import { post_database } from '../../declarations/post_database';

// index.ts
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

import { canisterId as canisterIDGateway } from '../../declarations/gateway/';
import { idlFactory as idlFactoryGateway } from '../../declarations/gateway/gateway.did.js';
import { idlFactory as idlFactoryPortal } from '../../declarations/portal/portal.did.js';



import { BottomNavigation, BottomNavigationAction } from '../../../node_modules/@mui/material/index';
import Home from '../assets/home.svg';
import HomeOutline from '../assets/home-outline.svg';
import Flame from '../assets/flame.svg';
import FlameOutline from '../assets/flame-outline.svg';
import HeartCircle from '../assets/heart-circle.svg';
import HeartCircleOutline from '../assets/heart-circle-outline.svg';
import People from '../assets/people.svg';
import PeopleOutline from '../assets/people-outline.svg';

var agent;
var gateway;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'portalPrincipal': '',
            selectedPage: 0,
            postObjects: [],
            topPostObjects: [],
            followingPostObjects: [],
            likedPostObjects: []
        };
    }

    grabPortalPrincipal() {
        gateway.grabPortal().then((portal) => {
            this.setState({'portalPrincipal': portal['ok']}, () => {
                const portal = Actor.createActor(idlFactoryPortal, {
                    agent,
                    canisterId: this.state.portalPrincipal,
                });
                this.getPosts(portal);
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
                const portal = createActor(portalPrincipal);
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
                const portal = createActor(portalPrincipal);
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
                const portal = createActor(portalPrincipal);
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
        console.log(newValue);
        if(newValue == 0) {
            this.setState({postObjects: []}, () => {
                this.getPosts(createActor(this.state.portalPrincipal));
            });
        } else if(newValue == 1) {
            this.getTopPosts();
        } else if(newValue == 2) {
            this.setState({followingPostObjects: []}, () => {
                this.getFollowingPosts(createActor(this.state.portalPrincipal));
            });
        } else {
            this.setState({likedPostObjects: []}, () => {
                this.getLikedPosts(createActor(this.state.portalPrincipal));
            });
        }
        this.setState({selectedPage: newValue})
    }

    componentDidMount() {
        this.init();
    }


    init = async () => {
        let iiUrl;
        if (true) { // process.env.DFX_NETWORK === "local") {
            iiUrl = `http://localhost:8000/?canisterId=qjdve-lqaaa-aaaaa-aaaeq-cai`;
        } else if (process.env.DFX_NETWORK === "ic") {
            iiUrl = `https://${process.env.II_CANISTER_ID}.ic0.app`;
        } else {
            iiUrl = `https://${process.env.II_CANISTER_ID}.dfinity.network`;
        }

        // First we have to create and AuthClient.
        const authClient = await AuthClient.create();

        // Call authClient.login(...) to login with Internet Identity. This will open a new tab
        // with the login prompt. The code has to wait for the login process to complete.
        // We can either use the callback functions directly or wrap in a promise.
        await new Promise((resolve, reject) => {
            authClient.login({
                identityProvider: iiUrl,
                onSuccess: resolve,
                onError: reject,
            });
        });

        // Get the identity from the auth client:
        const identity = authClient.getIdentity();
        // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
        agent = new HttpAgent({ identity });
        agent.fetchRootKey();
        // Using the interface description of our webapp, we create an Actor that we use to call the service methods.
        const gatewayActor = Actor.createActor(idlFactoryGateway, {
            agent,
            canisterId: canisterIDGateway,
        });
        gateway = gatewayActor;
        this.grabPortalPrincipal()
    };

    render() {
        return (
            <>
            <GlobalStyle theme={lightTheme}></GlobalStyle>
            <div id='container'>
                {/*Section 0 is home page*/}
                {   this.state.selectedPage == 0 &&
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%', margin: '1%'}}>
                            <ProfileHeader portalPrincipal={this.state.portalPrincipal}></ProfileHeader>
                            <NewPost portalPrincipal={this.state.portalPrincipal}></NewPost>
                            <Search portalPrincipal={this.state.portalPrincipal}></Search>
                        </div>
                        <PostPreview
                            myPortalPrincipal={this.state.portalPrincipal}
                            postObjects={this.state.postObjects}
                        />
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
                { this.state.selectedPage == 2 &&
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%'}}>
                        <PostPreview
                            myPortalPrincipal={this.state.portalPrincipal}
                            postObjects={this.state.followingPostObjects}
                        />
                    </div>
                }
                {/*Section 3 is featured page*/}
                { this.state.selectedPage == 3 &&
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
