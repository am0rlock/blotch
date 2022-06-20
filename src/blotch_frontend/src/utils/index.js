import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

import { canisterId as canisterIDGateway } from '../../../declarations/gateway/';
import { idlFactory as idlFactoryGateway } from '../../../declarations/gateway/gateway.did.js';
import { idlFactory as idlFactoryPortal } from '../../../declarations/portal/portal.did.js';

var agent;
var gateway;
export async function init(setGateway) {
  let iiUrl;
  if (true) { // process.env.DFX_NETWORK === "local") {
    iiUrl = `http://localhost:8000/?canisterId=qoctq-giaaa-aaaaa-aaaea-cai`;
  } else if (true) {//(process.env.DFX_NETWORK === "ic") {
    //iiUrl = `https://${process.env.II_CANISTER_ID}.ic0.app`;identity
    iiUrl = `https://identity.ic0.app`;
  } else {
    iiUrl = `https://${process.env.II_CANISTER_ID}.dfinity.network`;
  }

  // First we have to create and AuthClient.
  let authClientToUse;
  AuthClient.create().then(authClient => {
    authClient.isAuthenticated().then(async (isAuth) => {
      console.log('auth');
      console.log(isAuth);
      if(!isAuth) {
        // Call authClient.login(...) to login with Internet Identity. This will open a new tab
        // with the login prompt. The code has to wait for the login process to complete.
        // We can either use the callback functions directly or wrap in a promise.
        await new Promise((resolve, reject) => {
          authClient.login({
            identityProvider: iiUrl,
            onSuccess: resolve,
            onError: reject,
          });
        });
        gateway = getGatewayFromAuthClient(authClientToUse);
        setGateway(gateway);
      } else {
        authClientToUse = (authClient);
        gateway = getGatewayFromAuthClient(authClientToUse);
        setGateway(gateway);
      }
    })
  });
};

const getGatewayFromAuthClient = (authClient) => {
  // Get the identity from the auth client:
  const identity = authClient.getIdentity();
  // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
  agent = new HttpAgent({ identity });
  agent.fetchRootKey();
  // Using the interface description of our webapp, we create an Actor that we use to call the service methods.
  const gatewayActor = Actor.createActor(idlFactoryGateway, {
    agent,
    canisterId: canisterIDGateway,
  });
  gateway = gatewayActor;
  return gateway;
}

export function arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return binary;
}

export const getPortalFromPrincipal = (portalPrincipal) => {
  return (
    Actor.createActor(idlFactoryPortal, {
      agent,
      canisterId: portalPrincipal
    })
  );
}