import React, {useEffect} from "react";
import styled from "styled-components";
import avatar from "../../assets/default_profile.png";
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

  .profilePreviewButtonContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 33%;
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
var myPortal;
var hasRendered = false;
class ProfilePreview extends React.Component {
  // const portalPrincipal = this.props.portalPrincipal;
  // const [profile, setProfile] = React.useState();
  // const [blotches, setBlotches] = React.useState(0);
  // const [avatar, setAvatar] = React.useState('');
  constructor(props) {
    super(props);
    this.state = {
      profile: {'username':'Loading...', 'bio':'Loading...'},
      blotches: 0,
      avatar: avatar,
      iFollowThem: false
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

  getIFollowThem() {
    myPortal.getFollowing().then(principalsFollowing => {
      // if it is not following
      if(!this.containsPrincipal(principalsFollowing, this.props.portalPrincipal)) {
        this.setState({iFollowThem: false});
      } else {
        this.setState({iFollowThem: true});
      }
    });
  }

  getProfile = () => {
    portal.getProfile().then(p => {
      this.setState({'profile': p}, () => {
        this.getAvatar();
        this.getBlotches();
      });
      this.getIFollowThem();
    });
  }

  getPortal = () => {
    portal = createActor(this.props.portalPrincipal);
    myPortal = createActor(this.props.myPortalPrincipal);
    this.getProfile();
  }

  principalsEqual = (principalLeft, principalRight) => {
    let arrayLeft = principalLeft._arr;
    let arrayRight = principalRight._arr;
    for(let i = 0; i < arrayLeft.length; i++) {
      if(arrayLeft[i] != arrayRight[i]) {
        return false;
      }
    }
    return true;
  }

  containsPrincipal = (principalsFollowing, portalPrincipalClicked) => {
    for(let i = 0; i < principalsFollowing.length; i++) {
      if(this.principalsEqual(principalsFollowing[i], portalPrincipalClicked)) {
        return true;
      }
    }
    return false;
  }

  handleClick = () => {
    // let buttonClicked = document.getElementById(this.state.profile.username + "Button");
    // buttonClicked.innerText += 'z';
    this.setState({iFollowThem: !this.state.iFollowThem})
    let portalPrincipalClicked = this.props.portalPrincipal;
    myPortal.getFollowing().then(principalsFollowing => {
      // portalPrincipal clicked is either in there or it is not
      // check if its in there

      // if it is not following
      if(!this.containsPrincipal(principalsFollowing, portalPrincipalClicked)) {
        myPortal.addFollowing(portalPrincipalClicked).then(result => {
        });
      } else {
        myPortal.removeFollowing(portalPrincipalClicked).then(result => {
        });
      }
    });
  }

  componentDidUpdate() {
    if(this.props.portalPrincipal != '' && this.props.myPortalPrincipal != '') {
      this.getPortal();
    }
  }

  componentDidMount() {
    if(this.props.portalPrincipal != '' && this.props.myPortalPrincipal != '') {
      this.getPortal();
    }
  }

  render = () => {
    return (
      <Wrapper>
        <img className='avatar' src={this.state.avatar} alt="avatar" />
        <NameWrapper>
          <h4>{this.state.profile.username}</h4>
          <BlotchWrapper>
            <img className='blotchCoin' src={blotchCoin} alt='blotch coin' />
            <span className="blotches">{this.state.blotches}</span>
          </BlotchWrapper>
        </NameWrapper>
        <div className='profilePreviewButtonContainer'>
          <Button id={this.state.profile.username + "Button"} className='profilePreviewButton' onClick={() => {this.handleClick()}}>
            {this.state.iFollowThem ? 'Following' : 'Follow'}
          </Button>
        </div>
      </Wrapper>
    );
  }
}

export default ProfilePreview;
    // let b = document.getElementById(this.state.profile.username + "Button");
    // b.innerText += 'o';
    // portal.getFollowers().then(portalPrincipals => {
    //   let contains = false;
    //   for(let i = 0; i < portalPrincipals.length; i++) {

    //     let iterContains = true;
    //     for(let j = 0; j < portalPrincipals[i]._arr.length; j++) {
    //       if(portalPrincipals[i]._arr[j] != this.props.myPortalPrincipal._arr[j]) {
    //         iterContains = false;
    //       }
    //     }
    //     if(iterContains) {
    //       contains = true;
    //     }
    //   }
    //   if(contains) {
    //       myPortal.removeFollowing(this.props.portalPrincipal).then(r => {});
    //       return;
    //   }
    //   myPortal.addFollowing(this.props.portalPrincipal).then(r => {});
    // })