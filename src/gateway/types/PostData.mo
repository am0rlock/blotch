import Nat64 "mo:base/Nat64";
import TrieSet "mo:base/TrieSet";

import Post "Post";
import PostContent "PostContent";
import PostStats "PostStats";
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

    public func toPost(postData : PostData) : Post.Post
    {
        return {
            postTime = postData.postTime;
            numLikers = Nat64.fromNat(TrieSet.size(postData.likers));
            content = postData.content;
        };
    };

    public func toPostStats(postData : PostData) : PostStats.PostStats
    {
        return {
            postTime = postData.postTime;
            numLikers = Nat64.fromNat(TrieSet.size(postData.likers));
        };
    };
};
