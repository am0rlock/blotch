import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import TrieSet "mo:base/TrieSet";

import Gateway "canister:gateway";
import Portal "../../gateway/actors/Portal";

import PostID "../../gateway/types/PostID";
import Profile "../../gateway/types/Profile";

actor PostDatabase
{
    var hasSubscribed : Bool = false;

    public shared(msg) func notifyNewPortal(newPortalPrincipal : Principal) : async ()
    {
        if (msg.caller != Principal.fromActor(Gateway)) { return; };

        let newPortal : Portal.Portal = actor(Principal.toText(newPortalPrincipal));
        await newPortal.subscribePostDatabase();
    };

    public shared(msg) func notifyPostUpdate(postID : PostID.PostID) : async ()
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
