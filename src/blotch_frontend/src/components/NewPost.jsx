import React, { useContext, useState } from "react";
import styled from "styled-components";
import { getPortalFromPrincipal } from "../utils/index";
import Modal from "./Modal";
import AddCircleOutline from '../../assets/add-circle-outline.svg';

const ModalWrapper = styled.div`
  #imgPreview {
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
  }

  .postImg {
    min-width: 300px;
    max-height: 400px;
    object-fit: contain;
    margin: 5%;
  }

  textarea {
    resize: none;
    min-width: 300px;
    height: 75px;
  }

  h3:hover {
    cursor: pointer;
    border-radius: 5%;
    color: black;
  }

  .buttonContainer {
    position: relative;
    z-index: 100;
  }

  h3 {
    text-align: center;
    background-color: gray;
    padding: 1%;
    margin: 1%;
  }

  #descriptionContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 75px;
    margin-bottom: 3%;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5%;

  .newPostButton {
    width: 64%;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /* Style as you please, it will become the visible UI component. */
  }

  form {
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
  #uploadPhoto {
      opacity: 0;
      position: absolute;
      z-index: -1;
  }

`;

var chooseFile;
var portal;
var bytesEncoding;
class NewPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  getImgData = () => {
    this.setState({'showModal': true});
    const files = chooseFile.files[0];
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.addEventListener("load", () => {
        // data:image/png;base64, is at the start of the result
        let b64Encoding = fileReader.result.replace('data:image/png;base64,', '');
        bytesEncoding = []
        for(let i = 0; i < b64Encoding.length; i++) {
          bytesEncoding[i] = b64Encoding.charCodeAt(i);
        }
        let imgPreview = document.getElementById("imgPreview");
        imgPreview.innerHTML += '<img class="postImg" src="' + fileReader.result + '" />';
      });    
    }
  }

  getPortal = () => {
    if(this.props.portalPrincipal != '') {
      portal = getPortalFromPrincipal(this.props.portalPrincipal);
    }
  }

  handleSubmitPost = () => {
    let textDescription = document.getElementById('description').value;
    const blob = {'media': bytesEncoding, 'description': textDescription};
    portal.createPost(blob).then(result => {
      this.setState({'showModal': false});
    });
    this.setState({'showModal': false});
  }

  componentDidMount() {
    chooseFile = document.getElementById("uploadPhoto");
    chooseFile.addEventListener("change", () => {
      this.getImgData();
    });
    this.getPortal();
  }

  componentDidUpdate() {
    this.getPortal();
  }

  render() {
    return (
      <>
      <Wrapper>
        <form>
          <label htmlFor="uploadPhoto"><AddCircleOutline onClick={this.handleClick} className='newPostButton'/></label>
          <input type="file" accept='image/*' name="photo" id="uploadPhoto" />
        </form>
      </Wrapper>
      <ModalWrapper>
        { this.state.showModal && 
          <Modal>
            <div className="modal-content">
              <div id='imgPreview'>
                <div className="newpost-header">
                </div>
                <div id='descriptionContainer'>
                  <textarea
                    id='description'
                    placeholder="Add caption"
                  />
                </div>
              </div>
              <h3 onClick={() => {this.setState({'showModal': false});}}>Cancel</h3>
              <h3 onClick={this.handleSubmitPost}>Share</h3>
            </div>
          </Modal>
        }
      </ModalWrapper>
      </>
    );
  }
}

export default NewPost;