import PostID "../../gateway/types/PostID";
import PostStats "../../gateway/types/PostStats";

module
{
    public type PortalInterface = actor
    {
        getPostStats : (postID : PostID.PostID) -> async ?PostStats.PostStats;
        subscribePostDatabase : () -> async ();
    };
}
