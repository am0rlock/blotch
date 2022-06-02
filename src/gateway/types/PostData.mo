import Nat64 "mo:base/Nat64";
import TrieSet "mo:base/TrieSet";

import Comment "Comment";
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
        comments : [Comment.Comment];
    };

    public func construct(content0 : PostContent.PostContent) : PostData
    {
        return {
            postTime = Timestamp.construct();
            likers = TrieSet.empty();
            content = content0;
            comments = [];
        };
    };

    public func constructWithChange(content0 : PostContent.PostContent, likers0 : TrieSet.Set<Principal>, comments0 : [Comment.Comment]) : PostData
    {
        return {
            postTime = Timestamp.construct();
            likers = likers0;
            content = content0;
            comments = comments0;
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
