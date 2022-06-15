import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import TrieSet "mo:base/TrieSet";

import Gateway "canister:gateway";

import Portal "../../gateway/actors/Portal";
import Profile "../../gateway/types/Profile";

actor ProfileDatabase
{
    var hasSubscribed : Bool = false;
    var usernameToPortalPrincipal : HashMap.HashMap<Text, Principal> = HashMap.HashMap(0, Text.equal, Text.hash);

    public shared func initialize() : async ()
    {
        if (not hasSubscribed)
        {
            await Gateway.subscribe();
            hasSubscribed := true;
        };
    };

    public shared(msg) func notifyNewPortal(newPortalPrincipal : Principal) : async ()
    {
        if (msg.caller != Principal.fromActor(Gateway)) { return; };

        let newPortal : Portal.Portal = actor(Principal.toText(newPortalPrincipal));
        await newPortal.subscribeProfileDatabase();

        let profile : Profile.Profile = await newPortal.getProfile();
        usernameToPortalPrincipal.put(profile.username, newPortalPrincipal);
    };

    public shared(msg) func notifyProfileUpdate(newProfile : Profile.Profile) : async ()
    {
        if (not (await Gateway.isPortalPrincipalValid(msg.caller))) { return; };

        //TODO
        usernameToPortalPrincipal.delete(newProfile.bio);

        usernameToPortalPrincipal.put(newProfile.username, msg.caller);
    };
};
