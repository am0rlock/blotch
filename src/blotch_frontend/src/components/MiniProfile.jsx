import React, { useState, useEffect } from 'react';
import { createActor } from "../../../declarations/portal";

const MiniProfile = ({ portalPrincipal }) => {
    const [profile, setProfile] = React.useState('');

    async function grabProfile() {
        let portal = createActor(portalPrincipal);
        setProfile(await portal.getProfile());
    }

    useEffect(() => {
        grabProfile();
    });

    return (
        <div>
            <h1>{profile['username']}</h1>
            <h3>{profile['bio']}</h3>
        </div>
    )
}

export default MiniProfile
