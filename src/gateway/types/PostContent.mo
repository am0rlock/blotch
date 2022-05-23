module
{
    public type PostContent = 
    {
        words : Text;
    };

    private let WORDS_MAX_LENGTH : Nat = 150;

    public func validateWords(words : Text) : Bool
    {
        if (words.size() > WORDS_MAX_LENGTH) { return false; };

        return true;
    };

    public func validate(postContent : PostContent) : Bool
    {
        if (not validateWords(postContent.words)) { return false; };

        return true;
    };
}
