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
        reporters : TrieSet.Set<Principal>;
    };

    public func construct(content0 : PostContent.PostContent) : PostData
    {
        return {
            postTime = Timestamp.construct();
            likers = TrieSet.empty();
            content = content0;
            comments = [];
            reporters = TrieSet.empty();
        };
    };

    public func constructWithChange(content0 : PostContent.PostContent, likers0 : TrieSet.Set<Principal>, comments0 : [Comment.Comment], reporters0 : TrieSet.Set<Principal>) : PostData
    {
        return {
            postTime = Timestamp.construct();
            likers = likers0;
            content = content0;
            comments = comments0;
            reporters = reporters0;
        };
    };

    public func toPost(postData : PostData) : Post.Post
    {
        return {
            postTime = postData.postTime;
            numLikers = Nat64.fromNat(TrieSet.size(postData.likers));
            content = postData.content;
            comments = postData.comments;
        };
    };

    public func toPostStats(postData : PostData) : PostStats.PostStats
    {
        return {
            postTime = postData.postTime;
            numLikers = Nat64.fromNat(TrieSet.size(postData.likers));
            numComments = Nat64.fromNat(postData.comments.size());
        };
    };
};
