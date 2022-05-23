import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import TrieSet "mo:base/TrieSet";

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

        public func likePost(postID : PostID.PostID, otherPortalPrincipal : Principal) : Result.Result<(), PortalError.PortalError>
        {
            let value : ?PostData.PostData = idToData.get(postID);
            switch (value)
            {
                case null
                {
                    return #err(#PostNotFound);
                };
                case (?value)
                {
                    if (TrieSet.mem(value.likers, otherPortalPrincipal, Principal.hash(otherPortalPrincipal), Principal.equal)) { return #err(#CannotLike); };

                    let newLikers : TrieSet.Set<Principal> = TrieSet.put(value.likers, otherPortalPrincipal, Principal.hash(otherPortalPrincipal), Principal.equal);
                    let newPostData : PostData.PostData = PostData.constructWithLikers(value.content, newLikers);

                    ignore idToData.replace(postID, newPostData);

                    return #ok(());
                };
            };
        };

        public func unlikePost(postID : PostID.PostID, otherPortalPrincipal : Principal) : Result.Result<(), PortalError.PortalError>
        {
            let value : ?PostData.PostData = idToData.get(postID);
            switch (value)
            {
                case null
                {
                    return #err(#PostNotFound);
                };
                case (?value)
                {
                    if (not TrieSet.mem(value.likers, otherPortalPrincipal, Principal.hash(otherPortalPrincipal), Principal.equal)) { return #err(#CannotUnlike); };

                    let newLikers : TrieSet.Set<Principal> = TrieSet.delete(value.likers, otherPortalPrincipal, Principal.hash(otherPortalPrincipal), Principal.equal);
                    let newPostData : PostData.PostData = PostData.constructWithLikers(value.content, newLikers);

                    ignore idToData.replace(postID, newPostData);

                    return #ok(());
                };
            };
        };
    };
}