import styled from "styled-components";
import Button from "../styles/Button";
import { OptionsIcon } from "./Icons";
import blotchesCoin from '../../assets/blotches_logo.png';
import { getPortalFromPrincipal } from "../utils/index";
import React from 'react';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  width: 50%;

  .avatar {
    width: 35%;
    object-fit: cover;
    border-radius: 90px;
    margin-right: 2rem;
  }

  .profile-meta {
    display: flex;
    align-items: baseline;
    margin-bottom: 1rem;
    flex-direction: column;
  }

  .profile-meta h2 {
    position: relative;
    top: 3px;
  }

  .profile-info {
    width: 65%;
  }

  .profile-stats {
    display: flex;
    margin-bottom: 1rem;
  }

  .options svg {
    position: relative;
    top: 7px;
    margin-left: 1rem;
  }

  .blotches {
    padding-top: 3px;
  }

  .blotchesCoin {
    width: 4%;
    margin-right: 1%;
  }

  .blotchesContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
  }

  span {
    padding-right: 1%;
  }

  a {
    color: ${(props) => props.theme.blue};
  }

  .bio {
  }

  @media screen and (max-width: 645px) {
    font-size: 1rem;

    .bio,
    .profile-stats {
      display: none;
    }

    .avatar {
      width: 140px;
      height: 140px;
    }

    .profile-meta {
      flex-direction: column;
    }

    button {
      margin-left: 0;
    }

    .bio-mobile {
      margin: 1rem 0;
      display: block;
    }
  }

  @media screen and (max-width: 420px) {
    font-size: 0.9rem;

    .avatar {
      width: 100px;
      height: 100px;
    }
  }
`;

var portal;
let hasRendered = false;
class ProfileHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {'username':'Loading...', 'bio':'Loading...', 'avatar': ''},
      blotches: 0,
      numPosts: 0,
      followers: [],
      following: [],
      avatar: ''
    };
  }

  getBlotches() {
    portal.getNumBlotches().then(blotchesTemp => {
      blotchesTemp = blotchesTemp + "";
      this.setState(prevState => {
        if(prevState.blotches > blotchesTemp) {
          window.location.reload();
        }
        return {'blotches': blotchesTemp};
      });
    });
  }

  getFollowers() {
    portal.getFollowers().then(followers => {
      this.setState({'followers': followers});
    });
  }

  getFollowing() {
    portal.getFollowing().then(following => {
      this.setState({'following': following});
    });
  }

  getAvatar() {
    let avatarArray = this.state.profile['avatar'];
    let avatarString = String.fromCharCode.apply(null, avatarArray);
    const imgSrc = "data:image/png;base64," + avatarString.toString('base64');
    this.setState({'avatar': imgSrc});
  }

  getProfile() {
    portal.getProfile().then(profile => {
      this.setState({'profile': profile}, () => {
        this.getBlotches();
        this.getFollowers();
        this.getFollowing();
        this.getAvatar();
        this.getNumPosts();
      });
    });
  }

  getPortal = () => {
    portal = getPortalFromPrincipal(this.props.portalPrincipal);
    this.getProfile();
  }

  componentDidUpdate() {
    if(this.props.portalPrincipal != '') {
      this.getPortal();
    }
  }

  setProfile() {
    console.log('settig');
  }

  getNumPosts() {
    portal.getPostIDs().then(pids => {
      this.setState({numPosts: pids.length})
    })
  }

  render() {
    return (
      <>
        <Wrapper>
          <img className="avatar" src={this.state.avatar} alt="avatar" />
          <div className="profile-info">
            <div className="profile-meta">
              <h2>{this.state.profile['username']}</h2>
              {this.state.profile?.isMe ? (
                <div className="options">
                  <Button
                    secondary
                  >
                    Edit Profile
                  </Button>
                  <OptionsIcon onClick={handleLogout} />
                </div>
              ) : (
                  <div></div>
              )}
            </div>

            <div className="profile-stats">
              <span>{this.state.numPosts} posts</span>

              <span className="pointer" onClick={() => setFollowersModal(true)}>
                {this.state.followers.length} followers
              </span>

              <span className="pointer" onClick={() => setFollowingModal(true)}>
                {this.state.following.length} following
              </span>
            </div>

            <div className="bio">
              <div className='blotchesContainer'>
                <img className='blotchesCoin' src={blotchesCoin} />
                <span className="bold blotches">{this.state.blotches}</span>
              </div>
              <p>{this.state.profile['bio']}</p>
            </div>
          </div>
        </Wrapper>
      </>
    );
  }
};

export default ProfileHeader;
