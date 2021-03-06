import React from "react";
import styled, { keyframes } from "styled-components";

const openModal = keyframes`
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
`;

export const BlurryBox = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(1, 2, 5, .8);
  blur: 10%;
  z-index: 20;
`;

export const ModalWrapper = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(24, 24, 25, .6);
  z-index: 50;

  .modal-content {
    background: ${(props) => props.theme.white};
    border-radius: 4px;
    margin: auto;
    justify-self: center;
  }

  .modal-content img.post-preview {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Modal = ({ children }) => {
  return (
    <>
    <BlurryBox></BlurryBox>
    <ModalWrapper>
      <div className="modal-content">{children}</div>
    </ModalWrapper>
    </>
  );
};

export default Modal;
