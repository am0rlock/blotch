import React from "react";
import styled from "styled-components";
import Modal from "./Modal";
import levenshtein from 'js-levenshtein'

import { profile_database } from '../../../declarations/profile_database/'
import ProfilePreview from "./ProfilePreview";
import { getPortalFromPrincipal } from "../utils/index";

const InputWrapper = styled.input`
  padding: 0.4rem 0.6rem;
  background: ${(props) => props.theme.bg};
  border: 1px solid ${(props) => props.theme.borderColor};
  font-family: "Fira Sans", sans-serif;
  font-size: 1rem;
  border-radius: ${(props) => props.theme.borderRadius};
  border-radius: 10px;
`;

const ModalWrapper = styled.div`
	.modalContainer {
		border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
	}

	.overlay {
		display: None;
	}

	.postContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		max-width: 75vw;
		max-height: 75vh;
	}

	.postImageContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
    text-align: center;
    margin: 2%;
	color: white;
  }

	h3:hover {
		cursor: pointer;
		color: black;
	}

	.numLikers {
	}

	.comments {
		width: 30vw;
		height: 40vh;
		overflow: auto;
	}

	.liked {
		color: red;
	}
`;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      profiles: []
    }
  }

  handleSearch = (e) => {
    if (e.keyCode === 13) {
      profile_database.search('').then(r => {
		let promises = []
		const searchQuery = document.getElementById('searchInput').value;
		for(let i = 0; i < r.length; i++) {
			const returnedPortal = getPortalFromPrincipal(r[i]);
			promises.push(returnedPortal.getProfile());
		}
		let distances = []
		Promise.all(promises).then(profiles => {
			for(let i = 0; i < profiles.length; i++) {
				const profile = profiles[i];
				distances[i] = [levenshtein(profile.username, searchQuery), r[i], profile.username];
			}
			distances.sort((a, b) => {return a[0] - b[0]});
			let sortedProfilesUsernames = [];
			for(let i = 0; i < distances.length; i++) {
				sortedProfilesUsernames.push([distances[i][1], distances[i][2]]);
			}
			this.setState({profiles: sortedProfilesUsernames.slice(0, 5), showModal: true});
		});
      });
    }
  };

  hideModal = () => {
    this.setState({showModal: false});
  }

  render() {
    return (
      <>
      <InputWrapper
        type="text"
        onKeyDown={(e) => {this.handleSearch(e)}}
        placeholder="Find people"
		id='searchInput'
      />
			<ModalWrapper>
				{this.state.showModal && 
				<>
					<div className='modalContainer'>
						<Modal>
							{this.state.showModal && this.state.profiles?.map((profile) => (
								<ProfilePreview key={profile[1]} myPortalPrincipal={this.props.portalPrincipal} portalPrincipal={profile[0]}></ProfilePreview>
							))}
							<h3 onClick={() => {this.hideModal()}}>Cancel</h3>
						</Modal>
					</div>
				</>
				}
			</ModalWrapper>
      </>
    );
  }
};

export default Search;
