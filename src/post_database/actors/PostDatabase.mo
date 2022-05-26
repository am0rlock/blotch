import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Int64 "mo:base/Int64";
import Iter "mo:base/Iter";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieSet "mo:base/TrieSet";

import Gateway "canister:gateway";
import Portal "../../gateway/actors/Portal";

import PostIDScore "../types/PostIDScore";

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

    public shared query func getTopPosts(start : Nat64, end : Int64) : async [PostID.PostID]
    {
        let startConverted : Nat = Nat64.toNat(start);
        let endConverted : Int = Int64.toInt(end);

        var topNPosts : [PostID.PostID] = [];
        for (i in Iter.range(startConverted, endConverted))
        {
            if (i < 0 or i >= postIDScores.size())
            {
                return topNPosts;
            };
            topNPosts := Array.append(topNPosts, [postIDScores[i].postID]);
        };
        return topNPosts;
    };

    public shared(msg) func notifyNewPortal(newPortalPrincipal : Principal) : async ()
    {
        if (msg.caller != Principal.fromActor(Gateway)) { return; };

        let newPortal : Portal.Portal = actor(Principal.toText(newPortalPrincipal));
        await newPortal.subscribePostDatabase();
    };

    public shared(msg) func notifyPostUpdate(postID : PostID.PostID) : async ()
    {
        if (not (await Gateway.isPortalPrincipalValid(msg.caller)))
        {
            return;
        };

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

    system func heartbeat() : async ()
    {
        if (postIDScores.size() > 0)
        {
            let postIDScoresVar : [var PostIDScore.PostIDScore] = Array.init(postIDScores.size(), postIDScores[0]);
            for (i in Iter.range(0, postIDScores.size()))
            {
                let postIDScore : PostIDScore.PostIDScore = postIDScores[i];
                let portal : Portal.Portal = actor(Principal.toText(postIDScore.postID.portalPrincipal));
                let response = await portal.getPostStats(postIDScore.postID);
                switch (response)
                {
                    case (#ok(x))
                    {
                        let postStats : PostStats.PostStats = x;
                        let newPostIDScore : PostIDScore.PostIDScore = PostIDScore.construct(postIDScore.postID, postStats);
                        postIDScoresVar[i] := newPostIDScore;
                    };
                    case (#err(x))
                    {
                        return;
                    };
                }
            };
            Array.sortInPlace(postIDScoresVar, PostIDScore.cmp);
            postIDScores := Array.freeze(postIDScoresVar);
        };
    };
};
