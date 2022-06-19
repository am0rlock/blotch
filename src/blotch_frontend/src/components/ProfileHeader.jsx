import styled from "styled-components";
import blotchesCoin from '../../assets/blotches_logo.png';
import { getPortalFromPrincipal } from "../utils/index";
import React from 'react';
import Modal from "./Modal";
import PencilOutline from '../../assets/pencil-outline.svg';

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
    flex-direction: row;
    align-items: baseline;
    margin-bottom: 1rem;
  }

  .profile-meta h2 {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    color: white;
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
    color: white;
  }

  a {
    color: ${(props) => props.theme.blue};
  }

  .bio {
    color: white;
  }

  .pencilOutlineContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5%;
    margin: 2%;
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

const ModalWrapper = styled.div`
	.overlay {
		display: None;
	}

	.postImage {
		border-radius: 4px;
		min-width: 500px;
		min-height: 500px;
		max-width: 500px;
		max-height: 500px;
		object-fit: cover;
		padding: 5%;
	}

	textarea {
		resize: none;
		width: 300px;
		margin-top: 5%;
	}

  h3 {
    color: white;
    text-align: center;
  }

	h3:hover {
		cursor: pointer;
    color: black;
	}

  .editProfileContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
      avatar: '',
      showModal: false
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
      this.setProfile();
    }
  }

  handleEditProfileClick() {
    this.setState({showModal: true}, () => {console.log(this.state.showModal)});
  }

  handleCancelProfileClick() {
    console.log('cance');
    this.setState({showModal: false});
  }

  handleSubmitProfileClick() {
    console.log('submit');
    this.setState({showModal: false});
  }

  setProfile() {
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
              <div className='pencilOutlineContainer'>
                <PencilOutline onClick={() => {this.handleEditProfileClick()}}/>
              </div>
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
        {this.state.showModal &&
          <ModalWrapper>
          <>
            <div className='blurryBox'></div>
            <div className='modalContainer'>
              <Modal>
                <div className='editProfileContainer'>
                  <textarea
                    id='newUsername'
                    placeholder="New username"
                  />
                  <textarea
                    id='newBio'
                    placeholder="New bio"
                  />
                </div>
                <h3 onClick={() => {this.handleCancelProfileClick()}}>Cancel</h3>
                <h3 onClick={() => {this.handleSubmitProfileClick()}}>Submit</h3>
              </Modal>
            </div>
          </>
          </ModalWrapper>
        }
      </>
    );
  }
};

export default ProfileHeader;
