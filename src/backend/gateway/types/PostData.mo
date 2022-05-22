import TrieSet "mo:base/TrieSet";

import PostContent "PostContent";
import Timestamp "Timestamp";

module
{
    public type PostData = 
    {
        postTime : Timestamp.Timestamp;
        likers : TrieSet.Set<Principal>;
        content : PostContent.PostContent;
    };

    public func construct(content0 : PostContent.PostContent) : PostData
    {
        return {
            postTime = Timestamp.construct();
            likers = TrieSet.empty();
            content = content0;
        };
    };

    public func constructWithLikers(content0 : PostContent.PostContent, likers0 : TrieSet.Set<Principal>) : PostData
    {
        return {
            postTime = Timestamp.construct();
            likers = likers0;
            content = content0;
        };
    };
};
