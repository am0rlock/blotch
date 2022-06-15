import React from "react";
import styled from "styled-components";
import Modal from "./Modal";

import { profile_database } from '../../../declarations/profile_database/'
import ProfilePreview from "./ProfilePreview";

const InputWrapper = styled.input`
  padding: 0.4rem 0.6rem;
  background: ${(props) => props.theme.bg};
  border: 1px solid ${(props) => props.theme.borderColor};
  font-family: "Fira Sans", sans-serif;
  font-size: 1rem;
  border-radius: ${(props) => props.theme.borderRadius};
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
  }

	h3:hover {
		cursor: pointer;
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
      searchInput: "",
      showModal: false,
      profiles: []
    }
  }

  handleSearch = (e) => {
    console.log(e);
    if (e.keyCode === 13) {
      profile_database.search('').then(r => {
        this.setState({profiles: r, showModal: true}, () => {

          console.log(this.state.profiles)
        })
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
        onKeyDown={this.handleSearch}
        placeholder="Search profiles"
      />
			<ModalWrapper>
				{this.state.showModal && 
				<>
					<div className='modalContainer'>
						<Modal>
              {this.state.profiles?.map((profile) => (
                <ProfilePreview key={profile} portalPrincipal={profile}></ProfilePreview>
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
