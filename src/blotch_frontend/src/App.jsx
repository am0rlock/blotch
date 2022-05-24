import React, { useState, useEffect } from 'react';
import MiniProfile from './components/MiniProfile'
import { gateway } from '../../declarations/gateway/'

const App = () => {
    const [portalPrincipal, setPortalPrincipal] = React.useState('');

    async function grabPortalPrincipal() {
        setPortalPrincipal((await gateway.grabPortal())['ok']);
    }

    useEffect(() => {
        grabPortalPrincipal();
    });

    return (
        <div>
            <MiniProfile portalPrincipal={portalPrincipal}></MiniProfile>
        </div>
    )
}

export default App
