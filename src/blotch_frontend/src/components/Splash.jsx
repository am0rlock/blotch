import React from "react";
import Container from '@mui/material/Container';
import { Card, Typography } from "../../../../node_modules/@mui/material/index";
import Button from "../styles/Button";
import { CardMedia } from "../../../../node_modules/@mui/material/index";
import Logo from '../../assets/name_logo.svg';
  
export default class Splash extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
            <Container style={{height: '100vh', display: 'flex', justifyContent: 'flex-end', display: 'flex', alignItems: 'center'}}>
                <Logo />
                <Container sx={{ p: '4rem' }} style={{}}>
                    <Typography color='white'>
                    Collect Blotches and say goodbye to IPFS, Arweave and Web2.
                    </Typography>
                    <Typography color='white'>
                    Welcome to Blotch, the world's first completely on chain social media.
                    </Typography>
                    <Container>
                    <Button style={{backgroundColor: '#000000'}}>
                        Join now!
                    </Button>
                    </Container>
                </Container>
            </Container>
            </>
        );
    }
}
