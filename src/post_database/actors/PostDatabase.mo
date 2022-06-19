import Array "mo:base/Array";
import Debug "mo:base/Debug";
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
    stable var hasSubscribed : Bool = false;
    stable var postIDScores : [PostIDScore.PostIDScore] = [];

    public shared func initialize() : async ()
    {
        if (not hasSubscribed)
        {
            Debug.print("subscribed");
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
        Debug.print("new portal");
        let newPortal : Portal.Portal = actor(Principal.toText(newPortalPrincipal));
        await newPortal.subscribePostDatabase();
    };

    public shared(msg) func notifyPostUpdate(postID : PostID.PostID) : async ()
    {
        if (not (await Gateway.isPortalPrincipalValid(msg.caller)))
        {
            return;
        };

        func f(x : PostIDScore.PostIDScore) : Bool = PostID.equal(x.postID, postID);
        let value : ?PostIDScore.PostIDScore = Array.find(postIDScores, f);
        switch (value)
        {
            case null
            {
                Debug.print("new post");
                let portal : Portal.Portal = actor(Principal.toText(postID.portalPrincipal));
                let postStats : ?PostStats.PostStats = await portal.getPostStats(postID);
                switch (postStats)
                {
                    case null
                    {
                        return;
                    };
                    case (?postStats)
                    {
                        let postIDScore : PostIDScore.PostIDScore = PostIDScore.construct(postID, postStats);
                        postIDScores := Array.append(postIDScores, [postIDScore]);
                    };
                };
            };
            case (?value)
            {
                func f(x : PostIDScore.PostIDScore) : Bool = not PostID.equal(x.postID, postID);
                postIDScores := Array.filter(postIDScores, f);
            };
        };
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
                let postStats : ?PostStats.PostStats = await portal.getPostStats(postIDScore.postID);
                switch (postStats)
                {
                    case null
                    {
                        return;
                    };
                    case (?postStats)
                    {
                        let newPostIDScore : PostIDScore.PostIDScore = PostIDScore.construct(postIDScore.postID, postStats);
                        postIDScoresVar[i] := newPostIDScore;
                    };
                }
            };
            Array.sortInPlace(postIDScoresVar, PostIDScore.cmp);
            postIDScores := Array.freeze(postIDScoresVar);
        };
    };
};
