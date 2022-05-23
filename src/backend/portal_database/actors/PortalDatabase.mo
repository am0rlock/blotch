import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import TrieSet "mo:base/TrieSet";

import Gateway "canister:gateway";

import Portal "../../gateway/actors/Portal";
import Profile "../../gateway/types/Profile";

actor PortalDatabase
{
    var hasSubscribed : Bool = false;
    var profileToPortalPrincipal : HashMap.HashMap<Profile.Profile, Principal> = HashMap.HashMap<Profile.Profile, Principal>(0, Profile.equal, Profile.hash);

    public shared(msg) func notifyNewPortal(newPortalPrincipal : Principal) : async ()
    {
        if (msg.caller != Principal.fromActor(Gateway)) { return; };

        let newPortal : Portal.Portal = actor(Principal.toText(newPortalPrincipal));
        await newPortal.subscribePortalDatabase();

        let profile : Profile.Profile = await newPortal.getProfile();
        profileToPortalPrincipal.put(profile, newPortalPrincipal);
    };

    public shared(msg) func notifyProfileUpdate(newProfile : Profile.Profile) : async ()
    {
        if (not (await Gateway.isPortalPrincipalValid(msg.caller))) { return; };

        //TODO
    };

    system func heartbeat() : async ()
    {
        if (not hasSubscribed)
        {
            await Gateway.subscribe();
            hasSubscribed := true;
        };
    };
};