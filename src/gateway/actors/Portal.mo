import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Random "mo:base/Random";
import Result "mo:base/Result";
import Time "mo:base/Time";
import TrieSet "mo:base/TrieSet";

import PortalError "../types/PortalError";
import PortalProfileSubscriber "../types/PortalProfileSubscriber";
import PortalPostSubscriber "../types/PortalPostSubscriber";
import Post "../types/Post";
import PostContent "../types/PostContent";
import PostData "../types/PostData";
import PostID "../types/PostID";
import PostStats "../types/PostStats";
import PostStore "../types/PostStore";
import Profile "../types/Profile";
import ProfileUpdate "../types/ProfileUpdate";
import Timestamp "../types/Timestamp";

shared actor class Portal(userPrincipal : Principal, isPortalPrincipalValid0 : shared query (Principal) -> async Bool) = this
{
    let INITIAL_BLOTCHES_ALLOWANCE : Nat64 = 100;
    let RECHARGE_PERIOD : Nat64 = 86400000; //1 day
    let RECHARGE_BLOTCHES : Nat64 = 30;
    let POST_BLOTCHES_COST : Nat64 = 10;

    let isPortalPrincipalValid : shared query (Principal) -> async Bool = isPortalPrincipalValid0;
    var portalProfileSubscribers : [PortalProfileSubscriber.PortalProfileSubscriber] = [];
    var portalPostSubscribers : [PortalPostSubscriber.PortalPostSubscriber] = [];

    var lastRecharge : Timestamp.Timestamp = Timestamp.construct();
    var numBlotches : Nat64 = 100;
    var profile : Profile.Profile = Profile.getDefault(userPrincipal);
    var following : TrieSet.Set<Principal> = TrieSet.empty();
    var followers : TrieSet.Set<Principal> = TrieSet.empty();
    var postStore : PostStore.PostStore = PostStore.PostStore();

    /*
     *  Anybody to Portal functions
     */
    public shared query func getNumBlotches() : async Nat64
    {
        return numBlotches;
    };

    public shared query func getProfile() : async Profile.Profile
    {
        return profile;
    };

    public shared query func getFollowing() : async [Principal]
    {
        return TrieSet.toArray(following);
    };

    public shared query func getFollowers() : async [Principal]
    {
        return TrieSet.toArray(followers);
    };

    public shared query func getPostIDs() : async [PostID.PostID]
    {
        return postStore.getPostIDs();
    };

    public shared query func getPost(postID : PostID.PostID) : async Result.Result<Post.Post, PortalError.PortalError>
    {
        return postStore.getPost(postID);
    };

    public shared func getFollowingPostIDs() : async [PostID.PostID]
    {
        var postIDs : [PostID.PostID] = [];
        for (followingPrincipal in (await getFollowing()).vals())
        {
            let otherPortal : Portal = actor(Principal.toText(followingPrincipal));
            let otherPostIDs : [PostID.PostID] = await otherPortal.getPostIDs();

            postIDs := Array.append(postIDs, otherPostIDs);
        };

        return postIDs;
    };

    /*
     *  User to Portal functions
     */
    public shared(msg) func setProfile(newProfile : ProfileUpdate.ProfileUpdate) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller))
        {
            return #err(#NotAuthorized);
        };
        if (not ProfileUpdate.validate(newProfile))
        {
            return #err(#ProfileInvalid);
        };

        let oldProfile : Profile.Profile = profile;
        profile := Profile.construct(oldProfile, newProfile);

        for (subscriber in portalProfileSubscribers.vals())
        {
            ignore subscriber.notifyProfileUpdate(profile);
        };

        return #ok(());
    };

    public shared(msg) func addFollowing(newPortalPrincipal : Principal) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller))
        {
            return #err(#NotAuthorized);
        };
        if (newPortalPrincipal == getMyPrincipal())
        {
            return #err(#InvalidPortal);
        };
        if (TrieSet.mem(following, newPortalPrincipal, Principal.hash(newPortalPrincipal), Principal.equal))
        {
            return #err(#InvalidPortal);
        };
        if (not (await isPortalPrincipalValid(newPortalPrincipal)))
        {
            return #err(#InvalidPortal);
        };

        let otherPortal : Portal = actor(Principal.toText(newPortalPrincipal));
        let response : Result.Result<(), PortalError.PortalError> = await otherPortal.addFollower();
        switch (response)
        {
            case (#ok())
            {
                following := TrieSet.put(following, newPortalPrincipal, Principal.hash(newPortalPrincipal), Principal.equal);
                return #ok(());
            };
            case (#err(x))
            {
                return response;
            };
        };
    };

    public shared(msg) func removeFollowing(otherPortalPrincipal : Principal) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller))
        {
            return #err(#NotAuthorized);
        };
        if (not TrieSet.mem(following, otherPortalPrincipal, Principal.hash(otherPortalPrincipal), Principal.equal))
        {
            return #err(#InvalidPortal);
        };

        let otherPortal : Portal = actor(Principal.toText(otherPortalPrincipal));
        let response : Result.Result<(), PortalError.PortalError> = await otherPortal.removeFollower();
        switch (response)
        {
            case (#ok())
            {
                following := TrieSet.delete(following, otherPortalPrincipal, Principal.hash(otherPortalPrincipal), Principal.equal);
                return #ok(());
            };
            case (#err(x))
            {
                return response;
            };
        };

    };

    public shared(msg) func createPost(postContent : PostContent.PostContent) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller))
        {
            return #err(#NotAuthorized);
        };
        if (numBlotches < POST_BLOTCHES_COST)
        {
            return #err(#NotEnoughBlotches);
        };
        if (not PostContent.validate(postContent))
        {
            return #err(#CannotCreatePost);
        };

        numBlotches := numBlotches - POST_BLOTCHES_COST;

        let seed : Blob = await Random.blob();
        let postID : PostID.PostID = PostID.construct(getMyPrincipal(), seed);
        let postData : PostData.PostData = PostData.construct(postContent);

        for (subscriber in portalPostSubscribers.vals())
        {
            ignore subscriber.notifyPostUpdate(postID);
        };

        postStore.addPostData(postID, postData);

        return #ok(());
    };

    public shared(msg) func likePost(postID : PostID.PostID) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller))
        {
            return #err(#NotAuthorized);
        };

        let otherPortal : Portal = actor(Principal.toText(postID.portalPrincipal));
        let response : Result.Result<(), PortalError.PortalError> = await otherPortal.likeMyPost(postID);

        switch (response)
        {
            case (#ok())
            {
                return #ok(());
            };
            case (#err(x))
            {
                return response;
            };
        };

        return #ok()
    };

    public shared(msg) func unlikePost(postID : PostID.PostID) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller))
        {
            return #err(#NotAuthorized);
        };

        let otherPortal : Portal = actor(Principal.toText(postID.portalPrincipal));
        let response : Result.Result<(), PortalError.PortalError> = await otherPortal.unlikeMyPost(postID);

        switch (response)
        {
            case (#ok())
            {
                return #ok(());
            };
            case (#err(x))
            {
                return response;
            };
        };

        return #ok()
    };

    /*
     *  Portal to Portal functions
     */
    public shared(msg) func addFollower() : async Result.Result<(), PortalError.PortalError>
    {
        if (msg.caller == getMyPrincipal())
        {
            return #err(#InvalidPortal);
        };
        if (TrieSet.mem(followers, msg.caller, Principal.hash(msg.caller), Principal.equal))
        {
            return #err(#InvalidPortal);
        };
        if (not (await isPortalPrincipalValid(msg.caller)))
        {
            return #err(#InvalidPortal);
        };

        followers := TrieSet.put(followers, msg.caller, Principal.hash(msg.caller), Principal.equal);

        return #ok(());
    };

    public shared(msg) func removeFollower() : async Result.Result<(), PortalError.PortalError>
    {
        if (not TrieSet.mem(followers, msg.caller, Principal.hash(msg.caller), Principal.equal))
        {
            return #err(#InvalidPortal);
        };
        if (not (await isPortalPrincipalValid(msg.caller)))
        {
            return #err(#InvalidPortal);
        };

        followers := TrieSet.delete(followers, msg.caller, Principal.hash(msg.caller), Principal.equal);

        return #ok(());
    };

    public shared(msg) func likeMyPost(postID : PostID.PostID) : async Result.Result<(), PortalError.PortalError>
    {
        if (not (await isPortalPrincipalValid(msg.caller)))
        {
            return #err(#InvalidPortal);
        };

        return postStore.likePost(postID, msg.caller);
    };

    public shared(msg) func unlikeMyPost(postID : PostID.PostID) : async Result.Result<(), PortalError.PortalError>
    {
        if (not (await isPortalPrincipalValid(postID.portalPrincipal)))
        {
            return #err(#InvalidPortal);
        };

        return postStore.unlikePost(postID, msg.caller);
    };

    /*
     *  Subscriber to Portal functions
     */
    public shared(msg) func subscribeProfileDatabase() : async ()
    {
        let subscriber : PortalProfileSubscriber.PortalProfileSubscriber = actor(Principal.toText(msg.caller));
        portalProfileSubscribers := Array.append(portalProfileSubscribers, [subscriber]);
    };

    public shared(msg) func subscribePostDatabase() : async ()
    {
        let subscriber : PortalPostSubscriber.PortalPostSubscriber = actor(Principal.toText(msg.caller));
        portalPostSubscribers := Array.append(portalPostSubscribers, [subscriber]);
    };

    public shared query func getPostStats(postID : PostID.PostID) : async Result.Result<PostStats.PostStats, PortalError.PortalError>
    {
        return postStore.getPostStats(postID);
    };

    /*
     *  System functions
     */
    system func heartbeat() : async ()
    {
        await rechargeBlotches();
    };

    /*
     *  Private helper functions
     */
    public shared(msg) func rechargeBlotches() : async ()
    {
        if (msg.caller != Principal.fromActor(this))
        {
            return;
        };
        let now : Timestamp.Timestamp = Timestamp.construct();
        let elapsed : Nat64 = now - lastRecharge;
        if (elapsed > RECHARGE_PERIOD)
        {
            numBlotches := numBlotches + RECHARGE_BLOTCHES;
            lastRecharge := now;
        };
    };
    
    private func isAuthorized(callerPrincipal : Principal) : Bool
    {
        return callerPrincipal == profile.userPrincipal;
    };

    private func getMyPrincipal() : Principal
    {
        return Principal.fromActor(this);
    };
};