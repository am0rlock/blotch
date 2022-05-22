import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

import PortalError "PortalError";
import PostData "PostData";
import PostID "PostID";
import Result "mo:base/Result";

module PostStore
{
    public class PostStore()
    {
        private var idToData : HashMap.HashMap<PostID.PostID, PostData.PostData> = HashMap.HashMap(0, PostID.equal, PostID.hash);

        public func addPostData(key : PostID.PostID, value : PostData.PostData) : ()
        {
            idToData.put(key, value);
        };

        public func deletePostData(key : PostID.PostID) : Result.Result<(), PortalError.PortalError>
        {
            let value : ?PostData.PostData = idToData.remove(key);
            switch (value)
            {
                case null
                {
                    return #err(#PostNotFound);
                };
                case (?value)
                {
                    return #ok(());
                };
            };
        };

        public func getPostData(key : PostID.PostID) : Result.Result<PostData.PostData, PortalError.PortalError>
        {
            let value : ?PostData.PostData = idToData.get(key);
            switch (value)
            {
                case null
                {
                    return #err(#PostNotFound);
                };
                case (?value)
                {
                    return #ok(value);
                };
            };
        };

        public func getPostIDs() : [PostID.PostID] { return Iter.toArray(idToData.keys()); };
    };
}
