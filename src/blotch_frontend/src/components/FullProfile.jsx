import React, { useState, useEffect } from 'react';
import { Card } from '../../../../node_modules/@mui/material/index';
import { Typography } from '../../../../node_modules/@mui/material/index';
import { Grid } from '../../../../node_modules/@mui/material/index';
import MiniProfile from './MiniProfile';
import { createActor } from "../../../declarations/portal";

const FullProfile = ({ portalPrincipal }) => {
    const [profile, setProfile] = React.useState('');
    const [following, setFollowing] = React.useState('');
    const [followers, setFollowers] = React.useState('');

    async function grabProfileParts() {
        let portal = createActor(portalPrincipal);

        setProfile(await portal.getProfile());
        setFollowing(await portal.getFollowing());
        setFollowers(await portal.getFollowers());
    }

    useEffect(() => {
        grabProfileParts();
    });

    return (
        <>
            <Card sx={{ maxWidth: 400 }}>
                <MiniProfile portalPrincipal={portalPrincipal}/>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <Typography gutterBottom variant="h5" component="div">Following: {following.length}</Typography>
                    </Grid >
                    <Grid item xs={6}>
                    <Typography gutterBottom variant="h5" component="div">Followers: {followers.length}</Typography>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}

export default FullProfile
