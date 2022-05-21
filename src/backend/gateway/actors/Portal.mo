    import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieSet "mo:base/TrieSet";

import PortalError "../types/PortalError";
import Profile "../types/Profile";
import ProfileUpdate "../types/ProfileUpdate";

shared actor class Portal(userPrincipal : Principal, isPortalPrincipalValid0 : shared query (Principal) -> async Bool) = this
{
    let isPortalPrincipalValid : shared query (Principal) -> async Bool = isPortalPrincipalValid0;

    var profile : Profile.Profile = Profile.getDefault(userPrincipal);
    var following : TrieSet.Set<Principal> = TrieSet.empty();
    var followers : TrieSet.Set<Principal> = TrieSet.empty();

    public shared query func getProfile() : async Profile.Profile { return profile; };

    public shared query func getFollowing() : async [Principal] { return TrieSet.toArray(following); };

    public shared query func getFollowers() : async [Principal] { return TrieSet.toArray(followers); };

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

    public shared(msg) func addFollower() : async Result.Result<(), PortalError.PortalError>
    {
        if (msg.caller == getMyPrincipal()) { return #err(#InvalidPortal); };
        if (TrieSet.mem(followers, msg.caller, Principal.hash(msg.caller), Principal.equal)) { return #err(#InvalidPortal); };
        if (not (await isPortalPrincipalValid(msg.caller))) { return #err(#InvalidPortal); };

        followers := TrieSet.put(followers, msg.caller, Principal.hash(msg.caller), Principal.equal);

        return #ok(());
    };

    private func isAuthorized(callerPrincipal : Principal) : Bool { return callerPrincipal == profile.userPrincipal; };

    private func getMyPrincipal() : Principal { return Principal.fromActor(this); };
};
