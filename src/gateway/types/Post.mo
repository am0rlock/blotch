import Comment "Comment";
import PostContent "PostContent";
import Timestamp "Timestamp";

module
{
    public type Post = 
    {
        postTime : Timestamp.Timestamp;
        numLikers : Nat64;
        content : PostContent.PostContent;
        comments : [Comment.Comment];
    };
}
