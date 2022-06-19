import React, { useState, useEffect } from 'react';
import { Profiler } from 'react';
import { Avatar } from '../../../../node_modules/@mui/material/index';
import { Card, CardContent } from '../../../../node_modules/@mui/material/index';
import { Typography } from '../../../../node_modules/@mui/material/index';
import Box from '../../../../node_modules/@mui/material/Box';

import unknownProfile from '../../assets/UnknownProfile.png';
import blotchesLogo from '../../assets/blotches_logo.png';
import { getPortalFromPrincipal } from '../utils/index';

const MiniProfile = ({ portalPrincipal }) => {
    const [profile, setProfile] = React.useState({'username':'Loading...', 'bio':'Loading...'});

    async function grabProfile() {
        let portal = getPortalFromPrincipal(portalPrincipal);
        setProfile(await portal.getProfile());
    }

    function getBlotches() {
        return 5;
    }

    useEffect(() => {
        grabProfile();
    });

    // name, profile image, number of blotches, maybe principal

    return (
        <>
        <Card sx={{ width: 800 }}>
            <Box
                display="flex"
                alignItems="flex-start"
                //flexDirection="row" This is the default
                p={1}
                m={1}
                bgcolor="background.paper"
            >
                <Box
                    component="img"
                    sx={{
                        width: '10%',
                    }}
                    alt="User profile"
                    src={unknownProfile}
                />
                    <CardContent sx={{ width: '50%'}}>
                        <Typography gutterBottom variant="h5" component="div">
                        {profile['username']}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" display='flex'>
                        <img src={blotchesLogo} width={'10%'}></img>
                        {getBlotches()}
                        </Typography>
                    </CardContent>
            </Box>
        </Card>
        </>
    )
}

export default MiniProfile
