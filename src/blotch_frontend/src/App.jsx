import React, { useState, useEffect } from 'react';
import MiniProfile from './components/MiniProfile'
import FullProfile from './components/FullProfile';
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
            {portalPrincipal == '' ? <p>Loading...</p> : <FullProfile portalPrincipal={portalPrincipal} />}
        </div>
    )
}

export default App
