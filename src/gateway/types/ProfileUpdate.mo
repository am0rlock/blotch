import Text "mo:base/Text";

module
{
    public type ProfileUpdate = 
    {
        username : Text;
        bio : Text;
    };

    private let USERNAME_MAX_LENGTH : Nat = 16;

    private let BIO_MAX_LENGTH : Nat = 128;

    public func validateUsername(username : Text) : Bool
    {
        if (Text.contains(username, #char(' '))) { return false; };
        if (username.size() > USERNAME_MAX_LENGTH) { return false; };

        return true;
    };

    public func validateBio(bio : Text) : Bool
    {
        if (bio.size() > BIO_MAX_LENGTH) { return false; };

        return true;
    };

    public func validate(profileUpdate : ProfileUpdate) : Bool
    {
        if (not validateUsername(profileUpdate.username)) { return false; };
        if (not validateBio(profileUpdate.bio)) { return false; };

        return true;
    };
};
