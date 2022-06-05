import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Follow from "./Follow";
import Modal from "./Modal";
import Button from "../styles/Button";
import { OptionsIcon } from "./Icons";
import { CloseIcon } from "./Icons";
import { createActor } from "../../../declarations/portal";
import blotchesCoin from '../../assets/blotches_logo.png';
import unknownProfile from '../../assets/UnknownProfile.png';
import defaultProfileBlob from '../../assets/default_profile.blob';

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

var hasRendered = false;
const ProfileHeader = ({ portalPrincipal }) => {
  const [profile, setProfile] = React.useState({'username':'Loading...', 'bio':'Loading...'});
  const [blotches, setBlotches] = React.useState(0);
  const [followers, setFollowers] = React.useState([]);
  const [following, setFollowing] = React.useState([]);

  async function getBlotches() {
    if(!hasRendered) {
      let portal = createActor(portalPrincipal);
      var blotchesTemp = (await portal.getNumBlotches()) + "";
      blotchesTemp = blotchesTemp.substring(blotches.length - 1);
      setBlotches(((await portal.getNumBlotches()) + "").substring(blotches.length - 1));
      console.log('Bltoches:', blotches)
    }
   hasRendered = true;
  }

  async function getFollowers() {
    let portal = createActor(portalPrincipal);
    setFollowers(await portal.getFollowers())
    console.log(followers)
  }

  async function getFollowing() {
    let portal = createActor(portalPrincipal);
    setFollowing(await portal.getFollowing())
    console.log(following)
  }

  async function grabProfile() {
    let portal = createActor(portalPrincipal);
    setProfile(await portal.getProfile());
  }

  useEffect(() => {
    grabProfile();
    getBlotches();
    getFollowers();
    getFollowing();
  });

  function getNumFollowers() {
    return followers.length;
  }

  function getNumFollowing() {
    return following.length;
  }

  function getBio() {
    // return '10101010 01010101 10101010 01010101 10101010 01010101 10101010 01010101 10101010 01010101 10101010 01010101 10101010 01010101 10101010 01010101';
    return '5';
  }

  function getNumPosts() {
    return 12;
  }

  return (
    <>
      <Wrapper>
        <img className="avatar" src={window.URL.createObjectURL(defaultProfileBlob)} alt="avatar" />
        <div className="profile-info">
          <div className="profile-meta">
            <h2>{profile['username']}</h2>
            {profile?.isMe ? (
              <div className="options">
                <Button
                  secondary
                >
                  Edit Profile
                </Button>
                <OptionsIcon onClick={handleLogout} />
              </div>
            ) : (
              <Follow
                isFollowing={profile?.isFollowing}
                incFollowers={() => {}}
                decFollowers={() => {}}
                userId={profile?._id}
              />
            )}
          </div>

          <div className="profile-stats">
            <span>{getNumPosts()} posts</span>

            <span className="pointer" onClick={() => setFollowersModal(true)}>
              {getNumFollowers()} followers
            </span>

            <span className="pointer" onClick={() => setFollowingModal(true)}>
              {getNumFollowing()} following
            </span>
          </div>

          <div className="bio">
            <div className='blotchesContainer'>
              <img className='blotchesCoin' src={blotchesCoin} />
              <span className="bold blotches">{blotches}</span>
            </div>
            <p>{getBio()}</p>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default ProfileHeader;
