import PortalError "../types/PortalError";
import PostContent "../types/PostContent";
import PostData "../types/PostData";
import PostID "../types/PostID";
import PostStore "../types/PostStore";
import Principal "mo:base/Principal";
import Profile "../types/Profile";
import ProfileUpdate "../types/ProfileUpdate";
import Random "mo:base/Random";
import Result "mo:base/Result";
import TrieSet "mo:base/TrieSet";

shared actor class Portal(userPrincipal : Principal, isPortalPrincipalValid0 : shared query (Principal) -> async Bool) = this
{
    let isPortalPrincipalValid : shared query (Principal) -> async Bool = isPortalPrincipalValid0;

    var profile : Profile.Profile = Profile.getDefault(userPrincipal);
    var following : TrieSet.Set<Principal> = TrieSet.empty();
    var followers : TrieSet.Set<Principal> = TrieSet.empty();
    var postStore : PostStore.PostStore = PostStore.PostStore();


    /*
     *  Anybody to Portal functions
     */
    public shared query func getProfile() : async Profile.Profile { return profile; };

    public shared query func getFollowing() : async [Principal] { return TrieSet.toArray(following); };

    public shared query func getFollowers() : async [Principal] { return TrieSet.toArray(followers); };

    public shared query func getPostIDs() : async [PostID.PostID] { return postStore.getPostIDs(); };

    public shared query func getPostData(postID : PostID.PostID) : async Result.Result<PostData.PostData, PortalError.PortalError> { return postStore.getPostData(postID); };


    /*
     *  User to Portal functions
     */
    public shared(msg) func setProfile(newProfile : ProfileUpdate.ProfileUpdate) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller)) { return #err(#NotAuthorized); };
        if (not ProfileUpdate.validate(newProfile)) { return #err(#ProfileInvalid); };

        profile := Profile.construct(profile, newProfile);

        return #ok(());
    };

    public shared(msg) func addFollowing(newPortalPrincipal : Principal) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller)) { return #err(#NotAuthorized); };
        if (newPortalPrincipal == getMyPrincipal()) { return #err(#InvalidPortal); };
        if (TrieSet.mem(following, newPortalPrincipal, Principal.hash(newPortalPrincipal), Principal.equal)) { return #err(#InvalidPortal); };
        if (not (await isPortalPrincipalValid(newPortalPrincipal))) { return #err(#InvalidPortal); };

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

    public shared(msg) func createPost(postContent : PostContent.PostContent) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller)) { return #err(#NotAuthorized); };
        if (PostContent.validate(postContent)) { return #err(#CannotCreatePost); };

        let seed : Blob = await Random.blob();
        let postID : PostID.PostID = PostID.construct(getMyPrincipal(), seed);
        let postData : PostData.PostData = PostData.construct(postContent);

        postStore.addPostData(postID, postData);

        return #ok(());
    };

    public shared(msg) func destroyPost(postID : PostID.PostID) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller)) { return #err(#NotAuthorized); };

        return postStore.deletePostData(postID);
    };

    public shared(msg) func likePost(postID : PostID.PostID) : async Result.Result<(), PortalError.PortalError>
    {
        if (not isAuthorized(msg.caller)) { return #err(#NotAuthorized); };

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

    /*
     *  Portal to Portal functions
     */
    public shared(msg) func addFollower() : async Result.Result<(), PortalError.PortalError>
    {
        if (msg.caller == getMyPrincipal()) { return #err(#InvalidPortal); };
        if (TrieSet.mem(followers, msg.caller, Principal.hash(msg.caller), Principal.equal)) { return #err(#InvalidPortal); };
        if (not (await isPortalPrincipalValid(msg.caller))) { return #err(#InvalidPortal); };

        followers := TrieSet.put(followers, msg.caller, Principal.hash(msg.caller), Principal.equal);

        return #ok(());
    };

    public shared(msg) func likeMyPost(postID : PostID.PostID) : async Result.Result<(), PortalError.PortalError>
    {
        if (not (await isPortalPrincipalValid(postID.portalPrincipal))) { return #err(#InvalidPortal); };

        return postStore.likePost(postID, msg.caller);
    };

    /*
     *  Private helper functions
     */
    private func isAuthorized(callerPrincipal : Principal) : Bool { return callerPrincipal == profile.userPrincipal; };

    private func getMyPrincipal() : Principal { return Principal.fromActor(this); };
};
