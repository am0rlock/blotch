import React, {useEffect} from "react";
import styled from "styled-components";
import avatar from "../assets/default_avatar.jpg";
import Button from "../styles/Button";
import blotchCoin from '../../assets/blotches_logo.png'

import { createActor } from "../../../declarations/portal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 4px;
  max-width: 350px;
  align-items: center;

  .avatar {
    width: 15%;
    padding: 1%;
    border-radius: 5%;
    border: 3%;
  }

  .blotches {
    font-size: 0.9rem;
    color: ${(props) => props.theme.secondaryColor};
  }

  .profilePreviewButton {
    height: 50%;
  }

  .blotchCoin {
    width: 20%;
    padding-right: 1%;
  }

  span {
    display: flex;
    align-items: center;
    padding-top: 2%;
  }
`;

const NameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
  padding: 1%;
`;

const BlotchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

var hasRendered = false;
const ProfilePreview = ({ portalPrincipal }) => {
  const [profile, setProfile] = React.useState({'username':'Loading...', 'bio':'Loading...', 'avatar': ''});
  const [blotches, setBlotches] = React.useState(0);
  const [avatar, setAvatar] = React.useState('');

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

  async function grabProfile() {
    let portal = createActor(portalPrincipal);
    setProfile(await portal.getProfile());
    let avatarArray = profile['avatar'];
    let avatarString = String.fromCharCode.apply(null, avatarArray);
    var imgSrc = "data:image/png;base64," + avatarString.toString('base64');
    setAvatar(imgSrc);
  }

  useEffect(() => {
    grabProfile();
    getBlotches();
  });


  return (
    <Wrapper key={'asdf'}>
      <img className='avatar' src={avatar} alt="avatar" />
      <NameWrapper>
        <h4>{profile['username']}</h4>
        <BlotchWrapper>
          <img className='blotchCoin' src={blotchCoin} alt='blotch coin' />
          <span className="blotches">{blotches}</span>
        </BlotchWrapper>
      </NameWrapper>
      <Button className='profilePreviewButton'>Follow</Button>
    </Wrapper>
  );
};

export default ProfilePreview;
