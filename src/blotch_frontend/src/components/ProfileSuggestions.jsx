import React from "react";
import { getPortalFromPrincipal } from "../utils/index";
import ProfilePreview from "./ProfilePreview";
  
var portal;
export default class ProfileSuggestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            followingFollowers: []
        };
    }

    getFollowingFollowers() {
        portal.getFollowingFollowers().then(peoplePrincipals => {
        console.log('fofo');
        console.log(peoplePrincipals);
        this.setState({followingFollowers: peoplePrincipals.slice(0, 4)});
        })
    }

    componentDidUpdate() {
        if(this.props.portalPrincipal != '') {
            portal = getPortalFromPrincipal(this.props.portalPrincipal);
            this.getFollowingFollowers();
        }
    }

    render() {
        return (
            <>
            { (this.state.followingFollowers.length > 0) && 
                <h4 style={{color: 'white', textAlign: 'center', marginRight: '10%', paddingRight: '10%',
                            marginBottom: '5%', fontSize: '22px'}}>Suggested</h4>
            }
            <div style={{display: 'flex', flexDirection: 'column', overflow: 'auto', paddingRight: '10%', marginRight: '10%'}}>
                {this.state.followingFollowers?.map(personPrincipal => (
                    <ProfilePreview myPortalPrincipal={this.props.portalPrincipal} portalPrincipal={personPrincipal}></ProfilePreview>
                ))}
            </div>
            </>
        );
    }
}
