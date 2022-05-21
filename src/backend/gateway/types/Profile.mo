import Hash "mo:base/Hash";

import ProfileUpdate "ProfileUpdate";

module
{
    public type Profile = 
    {
        userPrincipal : Principal;
        username : Text;
        bio : Text;
    };

    private let DEFAULT_USERNAME : Text = "new_user";

    private let DEFAULT_BIO : Text = "Nothing here yet!";

    public func getDefault(userPrincipal0 : Principal) : Profile
    {
        return {
            userPrincipal = userPrincipal0;
            username = DEFAULT_USERNAME;
            bio = DEFAULT_BIO;
        };
    };

    public func construct(old : Profile, new : ProfileUpdate.ProfileUpdate) : Profile
    {
        return {
            userPrincipal = old.userPrincipal;
            username = new.username;
            bio = new.bio;
        };
    };
};
