import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import TrieSet "mo:base/TrieSet";

import Gateway "canister:gateway";
import Portal "../../gateway/actors/Portal";

import PostUpdateType "../types/PostUpdateType";

import PostID "../../gateway/types/PostID";
import Profile "../../gateway/types/Profile";

actor PostDatabase
{
    var hasSubscribed : Bool = false;
    var postIDs : TrieSet.Set<PostID.PostID> = TrieSet.empty();

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
        await newPortal.subscribePostDatabase();
    };

    public shared(msg) func notifyPostUpdate(postID : PostID.PostID, updateType : PostUpdateType.PostUpdateType) : async ()
    {
        if (not (await Gateway.isPortalPrincipalValid(msg.caller))) { return; };

        switch (updateType)
        {
            case (#Create)
            {
                postIDs := TrieSet.put(postIDs, postID, PostID.hash(postID), PostID.equal);
            };
            case (#Delete)
            {
                postIDs := TrieSet.delete(postIDs, postID, PostID.hash(postID), PostID.equal);
            };
        };
    };
};
