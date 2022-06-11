import React, { useContext, useState } from "react";
import styled from "styled-components";
import newPostImage from '../../assets/new_post.png';
import Modal from "./Modal";

import { createActor } from "../../../declarations/portal";

const Wrapper = styled.div`
  width: 20%;

  .newPostButton {
    width: 20%;
  }

  label {
    cursor: pointer;
    /* Style as you please, it will become the visible UI component. */
  }
 
  #uploadPhoto {
      opacity: 0;
      position: absolute;
      z-index: -1;
  }
`;

var chooseFile;
var imgPreview;
var portal;
class NewPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  getImgData = () => {
    const files = chooseFile.files[0];
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.addEventListener("load", () => {
        // data:image/png;base64, is at the start of the result
        let b64Encoding = fileReader.result.replace('data:image/png;base64,', '');
        let bytesEncoding = []
        for(let i = 0; i < b64Encoding.length; i++) {
          bytesEncoding[i] = b64Encoding.charCodeAt(i);
        }
        const blob = {'media': bytesEncoding, 'description': 'Test caption'};
        portal.createPost(blob);
        imgPreview.style.display = "block";
        imgPreview.innerHTML = '<img src="' + fileReader.result + '" />';
        this.setState({'showModal': true});
      });    
    }
  }

  getPortal = () => {
    if(this.props.portalPrincipal != '') {
      portal = createActor(this.props.portalPrincipal);
    }
  }

  handleSubmitPost() {
    console.log('handle submit');
  }

  componentDidMount() {
    chooseFile = document.getElementById("uploadPhoto");
    chooseFile.addEventListener("change", () => {
      this.getImgData();
    });
    imgPreview = document.getElementById("imgPreview");
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
          <label htmlFor="uploadPhoto"><img onClick={this.handleClick} className='newPostButton' src={newPostImage}></img></label>
          <input type="file" accept='image/*' name="photo" id="uploadPhoto" />
        </form>
        <div id='imgPreview'></div>
        { this.state.showModal && 
          <Modal>
            <div className="modal-content">
              <div className="newpost-header">
                <h3 onClick={() => {this.setState({'showModal': false});}}>Cancel</h3>
                <h3 onClick={this.handleSubmitPost}>Share</h3>
              </div>
              <div>
                <textarea
                  placeholder="Add caption"
                />
              </div>
            </div>
          </Modal>
        }
      </Wrapper>
      </>
    );
  }
}

export default NewPost;