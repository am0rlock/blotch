import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

import { canisterId as canisterIDGateway } from '../../../declarations/gateway/';
import { idlFactory as idlFactoryGateway } from '../../../declarations/gateway/gateway.did.js';
import { idlFactory as idlFactoryPortal } from '../../../declarations/portal/portal.did.js';

var agent;
var gateway;
export const init = async (logInUser) => {
  let iiUrl;
  if (true) { // process.env.DFX_NETWORK === "local") {
    iiUrl = `http://localhost:8000/?canisterId=qjdve-lqaaa-aaaaa-aaaeq-cai`;
  } else if (process.env.DFX_NETWORK === "ic") {
    iiUrl = `https://${process.env.II_CANISTER_ID}.ic0.app`;
  } else {
    iiUrl = `https://${process.env.II_CANISTER_ID}.dfinity.network`;
  }

  // First we have to create and AuthClient.
  const authClient = await AuthClient.create();
  authClient.isAuthenticated().then(async (isAuth) => {
    console.log('auth');
    console.log(isAuth);
    if(isAuth) {
      logInUser();
      return;
    } else {
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
    }
  })


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
};


export const getPortalFromPrincipal = (portalPrincipal) => {
  return (
    Actor.createActor(idlFactoryPortal, {
      agent,
      canisterId: portalPrincipal
    })
  );
}