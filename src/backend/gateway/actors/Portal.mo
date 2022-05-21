import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieSet "mo:base/TrieSet";

import PortalError "../types/PortalError";
import Profile "../types/Profile";
import ProfileUpdate "../types/ProfileUpdate";

shared actor class Portal(userPrincipal : Principal) = this
{
    var profile : Profile.Profile = Profile.getDefault(userPrincipal);
    var following : TrieSet.Set<Principal> = TrieSet.empty<Principal>();

    public shared query func getProfile() : async Profile.Profile { return profile; };

    public shared query func getFollowing() : async [Principal] { return TrieSet.toArray<Principal>(following); };

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
        if (TrieSet.mem<Principal>(following, newPortalPrincipal, Principal.hash(newPortalPrincipal), Principal.equal)) { return #err(#InvalidPortal); };

        following := TrieSet.put<Principal>(following, newPortalPrincipal, Principal.hash(newPortalPrincipal), Principal.equal);

        return #ok(());
    };

    private func isAuthorized(callerPrincipal : Principal) : Bool { return callerPrincipal == profile.userPrincipal; };

    private func getMyPrincipal() : Principal { return Principal.fromActor(this); };
};
