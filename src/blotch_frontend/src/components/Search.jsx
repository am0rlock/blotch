import React from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";

import { profile_database } from '../../../declarations/profile_database/'

const InputWrapper = styled.input`
  padding: 0.4rem 0.6rem;
  background: ${(props) => props.theme.bg};
  border: 1px solid ${(props) => props.theme.borderColor};
  font-family: "Fira Sans", sans-serif;
  font-size: 1rem;
  border-radius: ${(props) => props.theme.borderRadius};
`;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: ""
    }
  }

  handleSearch = (e) => {
    console.log(e);
    if (e.keyCode === 13) {
      profile_database.search('hello').then(r => {
        console.log(r);
      });
    }
  };

  render() {
    return (
      <InputWrapper
        type="text"
        onKeyDown={this.handleSearch}
        placeholder="Search profiles"
      />
    );
  }
};

export default Search;
