import React from "react";
import styled from "styled-components";
import Avatar from "../styles/Avatar";

const CommentWrapper = styled.div`
  display: flex;

  span {
    padding-right: 0.4rem;
  }

  Avatar {
    width: 30px;
  }

  .bold {
  }

  p {
    word-break: break-all;
  }
`;

const Comment = ({ avatar, username, text, hideavatar }) => {
  return (
    <CommentWrapper style={{ padding: !hideavatar ? "0.4rem 0" : "" }}>
      {!hideavatar && (
        <Avatar
          className="pointer"
          src={avatar}
          alt="avatar"
        />
      )}

      <p>
        <span
          className="bold pointer"
        >
          {username}
        </span>
        {text}
      </p>
    </CommentWrapper>
  );
};

export default Comment;
