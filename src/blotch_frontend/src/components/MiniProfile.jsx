import React, { useState, useEffect } from 'react';
import { Profiler } from 'react';
import { Avatar } from '../../../../node_modules/@mui/material/index';
import { Card, CardContent } from '../../../../node_modules/@mui/material/index';
import { Typography } from '../../../../node_modules/@mui/material/index';
import { createActor } from "../../../declarations/portal";

import unknownProfile from './UnknownProfile.png';

const MiniProfile = ({ portalPrincipal }) => {
    const [profile, setProfile] = React.useState({'username':'Loading...', 'bio':'Loading...'});

    async function grabProfile() {
        let portal = createActor(portalPrincipal);
        setProfile(await portal.getProfile());
    }

    useEffect(() => {
        grabProfile();
    });

    // name, profile image, number of blotches, maybe principal

    return (
        <>
            <Card sx={{ maxWidth: 400 }}>
                <img src={unknownProfile}></img>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {profile['username']}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {profile['bio']}
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}

export default MiniProfile
