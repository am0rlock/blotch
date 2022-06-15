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
    border-radius: 25%;
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

var portal;
var hasRendered = false;
class ProfilePreview extends React.Component {
  // const portalPrincipal = this.props.portalPrincipal;
  // const [profile, setProfile] = React.useState();
  // const [blotches, setBlotches] = React.useState(0);
  // const [avatar, setAvatar] = React.useState('');
  constructor(props) {
    super(props);
    this.state = {
      profile: {'username':'Loading...', 'bio':'Loading...', 'avatar': ''},
      blotches: 0,
      avatar: ''
    };
  }

  getBlotches() {
    portal.getNumBlotches().then(blotchesTemp => {
      blotchesTemp = blotchesTemp + ""
      this.setState(prevState => {
        if(prevState.blotches > blotchesTemp) {
          window.location.reload();
        }
        return {'blotches': blotchesTemp};
      });
    })
  }

  getAvatar() {
    let avatarArray = this.state.profile['avatar'];
    let avatarString = String.fromCharCode.apply(null, avatarArray);
    const imgSrc = "data:image/png;base64," + avatarString.toString('base64');
    this.setState({'avatar': imgSrc});
  }

  getProfile = () => {
    portal.getProfile().then(p => {
      this.setState({'profile': p}, () => {
        console.log(p);
        this.getAvatar();
        this.getBlotches();});
    });
  }

  getPortal = () => {
    portal = createActor(this.props.portalPrincipal);
    this.getProfile();
  }

  componentDidUpdate() {
    if(!hasRendered && this.portalPrincipal != '') {
      this.getPortal();
      hasRendered = true;
    }
  }

  componentDidMount() {
    this.getPortal();
  }

  render = () => {
    console.log(this.props.portalPrincipal);
    return (
      <Wrapper key={'asdf'}>
        <img className='avatar' src={this.state.avatar} alt="avatar" />
        <NameWrapper>
          <h4>{this.state.profile['username']}</h4>
          <BlotchWrapper>
            <img className='blotchCoin' src={blotchCoin} alt='blotch coin' />
            <span className="blotches">{this.state.blotches}</span>
          </BlotchWrapper>
        </NameWrapper>
        <Button className='profilePreviewButton'>Follow</Button>
      </Wrapper>
    );
  }
}

export default ProfilePreview;
