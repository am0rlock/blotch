import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import TrieSet "mo:base/TrieSet";

import Gateway "canister:gateway";
import Portal "../../gateway/actors/Portal";

import PostIDScore "../types/PostIDScore";
import PostUpdateType "../types/PostUpdateType";

import PostID "../../gateway/types/PostID";
import PostStats "../../gateway/types/PostStats";
import Profile "../../gateway/types/Profile";

actor PostDatabase
{
    var hasSubscribed : Bool = false;
    var postIDScores : [PostIDScore.PostIDScore] = [];

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
                let portal : Portal.Portal = actor(Principal.toText(postID.portalPrincipal));
                let response = await portal.getPostStats(postID);
                switch (response)
                {
                    case (#ok(x))
                    {
                        let postStats : PostStats.PostStats = x;
                        let postIDScore : PostIDScore.PostIDScore = PostIDScore.construct(postID, postStats);
                        postIDScores := Array.append(postIDScores, [postIDScore]);
                    };
                    case (#err(x))
                    {
                        return;
                    };
                }
            };
            case (#Delete)
            {
                //TODO
            };
        };
    };

    system func heartbeat() : async ()
    {
        let postIDScoresVar : [var PostIDScore.PostIDScore] = Array.thaw(postIDScores);
        Array.sortInPlace(postIDScoresVar, PostIDScore.cmp);
        postIDScores := Array.freeze(postIDScoresVar);
    };
};
