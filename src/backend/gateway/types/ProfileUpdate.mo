module
{
    public type ProfileUpdate = 
    {
        username : Text;
        bio : Text;
    };

    private let USERNAME_MAX_LENGTH : Nat = 64;

    private let BIO_MAX_LENGTH : Nat = 64;

    public func validate(profileUpdate : ProfileUpdate) : Bool
    {
        if (profileUpdate.username.size() > USERNAME_MAX_LENGTH) { return false; };
        if (profileUpdate.bio.size() > BIO_MAX_LENGTH) { return false; };

        return true;
    };
};
