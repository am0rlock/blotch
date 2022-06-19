import Order "mo:base/Order";

import PostID "../../gateway/types/PostID";
import PostStats "../../gateway/types/PostStats";

module
{
    public type PostIDScore = 
    {
        postID : PostID.PostID;
        score : Nat64;
    };

    public func computeScore(postStats : PostStats.PostStats) : Nat64
    {
        return postStats.numLikers - 2 * postStats.numReporters;
    };

    public func construct(postID0 : PostID.PostID, postStats : PostStats.PostStats) : PostIDScore
    {
        return {
            postID = postID0;
            score = computeScore(postStats);
        };
    };

    public func cmp(x : PostIDScore, y : PostIDScore) : Order.Order
    {
        if (x.score < y.score)
        {
            return #greater;
        };
        if (x.score > y.score)
        {
            return #less;
        };
        return #equal;
    };
};
