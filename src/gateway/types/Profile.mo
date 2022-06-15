import Blob "mo:base/Blob";
import Hash "mo:base/Hash";
import Principal "mo:base/Principal";

import DefaultAvatar "DefaultAvatar";
import ProfileUpdate "ProfileUpdate";

module
{
    public type Profile = 
    {
        userPrincipal : Principal;
        avatar : Blob;
        username : Text;
        bio : Text;
    };

    private let DEFAULT_USERNAME : Text = "new_user";

    private let DEFAULT_BIO : Text = "Nothing here yet!";

    public func getDefault(userPrincipal0 : Principal) : Profile
    {
        return {
            userPrincipal = userPrincipal0;
            avatar = DefaultAvatar.getDefault();
            username = DEFAULT_USERNAME;
            bio = DEFAULT_BIO;
        };
    };

    public func construct(old : Profile, new : ProfileUpdate.ProfileUpdate) : Profile
    {
        return {
            userPrincipal = old.userPrincipal;
            avatar = new.avatar;
            username = new.username;
            bio = new.bio;
        };
    };

    public func setBio(profile : Profile, bio0 : Text) : Profile
    {
        return {
            userPrincipal = profile.userPrincipal;
            avatar = profile.avatar;
            username = profile.username;
            bio = bio0;
        };
    };

    public func equal(x : Profile, y : Profile) : Bool
    {
        return x.userPrincipal == y.userPrincipal;
    };

    public func hash(x : Profile) : Hash.Hash
    {
        return Principal.hash(x.userPrincipal);
    };
};
