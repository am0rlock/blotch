import PostID "PostID";

module
{
    public type PortalPostSubscriber = actor
    {
        notifyPostUpdate : (postID : PostID.PostID) -> async ()
    };
}
