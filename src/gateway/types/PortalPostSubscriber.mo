import PostID "PostID";

import PostUpdateType "../../post_database/types/PostUpdateType";

module
{
    public type PortalPostSubscriber = actor
    {
        notifyPostUpdate : (postID : PostID.PostID, updateType : PostUpdateType.PostUpdateType) -> async ()
    };
}
