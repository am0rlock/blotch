import PostContent "PostContent";
import Timestamp "Timestamp";

module
{
    public type PostData = 
    {
        postTime : Timestamp.Timestamp;
        content : PostContent.PostContent;
    };

    public func construct(content0 : PostContent.PostContent) : PostData
    {
        return {
            postTime = Timestamp.construct();
            content = content0;
        };
    };
};
