import React from "react";
import Container from '@mui/material/Container';
import { Box } from "../../../../node_modules/@mui/material/index";
import { Card, Typography } from "../../../../node_modules/@mui/material/index";
import Button from "../styles/Button";
import { CardMedia } from "../../../../node_modules/@mui/material/index";
import Logo from '../../assets/name_logo.svg';
import BlotchesLogo from '../../assets/blotches_logo.png';
  
export default class Splash extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
            <Container style={{height: '100vh', display: 'flex', justifyContent: 'flex-end', display: 'flex', alignItems: 'center'}}>
                <img src={BlotchesLogo} width='50%'/>
                <Container styles={{spacing: 10}}>
                    <Logo />
                    <Typography color='white' style={{ lineHeight: "100px", fontSize:'18px' }} mt={2}>
                    Collect Blotches and say goodbye to IPFS, Arweave and Web2.
                    </Typography>
                    
                    <Typography color='white' style={{fontSize:'25px'}}>
                    Welcome to Blotch, the world's first completely on chain social media.
                    </Typography>
                    <Box sx={{ m: 10 }} />
                    <Container style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                    <Button style={{backgroundColor: '#000000', borderRadius: 12, padding: 10}}>
                        Join Blotch now!
                    </Button>
                    </Container>
                </Container>
            </Container>
            </>
        );
    }
}
