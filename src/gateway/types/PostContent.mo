module
{
    public type PostContent = 
    {
        media : Blob;
        description : Text;
    };

    private let MEDIA_MAX_LENGTH : Nat = 2000000;
    private let DESCRIPTION_MAX_LENGTH : Nat = 128;

    public func validateMedia(media : Blob) : Bool
    {
        if (media.size() > MEDIA_MAX_LENGTH) { return false; };

        return true;
    };

    public func validateDescription(description : Text) : Bool
    {
        if (description.size() > DESCRIPTION_MAX_LENGTH) { return false; };

        return true;
    };

    public func validate(postContent : PostContent) : Bool
    {
        if (not validateMedia(postContent.media)) { return false; };
        if (not validateDescription(postContent.description)) { return false; };

        return true;
    };
}
