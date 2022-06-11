module
{
    public type PostContent = 
    {
        media : Blob;
    };

    private let MEDIA_MAX_LENGTH : Nat = 2000000;

    public func validateMedia(media : Blob) : Bool
    {
        if (media.size() > MEDIA_MAX_LENGTH) { return false; };

        return true;
    };

    public func validate(postContent : PostContent) : Bool
    {
        if (not validateMedia(postContent.media)) { return false; };

        return true;
    };
}
