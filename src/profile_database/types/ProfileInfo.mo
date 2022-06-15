import Blob "mo:base/Blob";
import Hash "mo:base/Hash";
import Principal "mo:base/Principal";

import Profile "../../gateway/types/Profile";

module
{
    public type ProfileInfo = 
    {
        userPrincipal : Principal;
        username : Text;
    };

    public func construct(profile : Profile.Profile) : ProfileInfo
    {
        return {
            userPrincipal = profile.userPrincipal;
            username = profile.username;
        };
    };

    public func equal(x : ProfileInfo, y : ProfileInfo) : Bool
    {
        return x.userPrincipal == y.userPrincipal;
    };

    public func hash(x : ProfileInfo) : Hash.Hash
    {
        return Principal.hash(x.userPrincipal);
    };
};
