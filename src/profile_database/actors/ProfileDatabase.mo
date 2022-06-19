import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Order "mo:base/Order";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import TrieSet "mo:base/TrieSet";

import Gateway "canister:gateway";

import ProfileInfo "../types/ProfileInfo";

import Portal "../../gateway/actors/Portal";
import Profile "../../gateway/types/Profile";

actor ProfileDatabase
{
    stable var hasSubscribed : Bool = false;
    stable var usernameToPortalPrincipalStable : [(ProfileInfo.ProfileInfo, Principal)] = [];
    var usernameToPortalPrincipal : HashMap.HashMap<ProfileInfo.ProfileInfo, Principal> = HashMap.fromIter(usernameToPortalPrincipalStable.vals(), 0, ProfileInfo.equal, ProfileInfo.hash);

    public shared func initialize() : async ()
    {
        if (not hasSubscribed)
        {
            await Gateway.subscribe();
            hasSubscribed := true;
        };
    };

    public shared query func search(searchQuery : Text) : async [Principal]
    {
        return Iter.toArray(usernameToPortalPrincipal.vals());
    };

    public shared(msg) func notifyNewPortal(newPortalPrincipal : Principal) : async ()
    {
        if (msg.caller != Principal.fromActor(Gateway)) { return; };

        let newPortal : Portal.Portal = actor(Principal.toText(newPortalPrincipal));
        await newPortal.subscribeProfileDatabase();

        let profile : Profile.Profile = await newPortal.getProfile();
        let profileInfo : ProfileInfo.ProfileInfo = ProfileInfo.construct(profile);
        usernameToPortalPrincipal.put(profileInfo, newPortalPrincipal);
    };

    public shared(msg) func notifyProfileUpdate(newProfile : Profile.Profile) : async ()
    {
        if (not (await Gateway.isPortalPrincipalValid(msg.caller))) { return; };

        let profileInfo : ProfileInfo.ProfileInfo = ProfileInfo.construct(newProfile);

        usernameToPortalPrincipal.delete(profileInfo);

        usernameToPortalPrincipal.put(profileInfo, msg.caller);
    };

    system func preupgrade()
    {
        usernameToPortalPrincipalStable := Iter.toArray(usernameToPortalPrincipal.entries());
    };

    system func postupgrade()
    {
        usernameToPortalPrincipalStable := [];
    };
};
