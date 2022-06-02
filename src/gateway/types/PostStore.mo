import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import TrieSet "mo:base/TrieSet";

import Comment "Comment";
import PortalError "PortalError";
import Post "Post";
import PostData "PostData";
import PostID "PostID";
import PostStats "PostStats";
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

        public func getPost(key : PostID.PostID) : Result.Result<Post.Post, PortalError.PortalError>
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
                    return #ok(PostData.toPost(value));
                };
            };
        };

        public func getPostStats(key : PostID.PostID) : ?PostStats.PostStats
        {
            let value : ?PostData.PostData = idToData.get(key);
            switch (value)
            {
                case null
                {
                    return null;
                };
                case (?value)
                {
                    return ?(PostData.toPostStats((value)));
                }
            }
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
                    let comments : [Comment.Comment] = value.comments;
                    let newPostData : PostData.PostData = PostData.constructWithChange(value.content, newLikers, comments);

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
                    let comments : [Comment.Comment] = value.comments;
                    let newPostData : PostData.PostData = PostData.constructWithChange(value.content, newLikers, comments);

                    ignore idToData.replace(postID, newPostData);

                    return #ok(());
                };
            };
        };

        public func addComment(postID : PostID.PostID, comment : Comment.Comment, otherPortalPrincipal : Principal) : Result.Result<(), PortalError.PortalError>
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
                    let likers : TrieSet.Set<Principal> = TrieSet.put(value.likers, otherPortalPrincipal, Principal.hash(otherPortalPrincipal), Principal.equal);
                    let newComments : [Comment.Comment] = Array.append(value.comments, [comment]);
                    let newPostData : PostData.PostData = PostData.constructWithChange(value.content, likers, newComments);

                    ignore idToData.replace(postID, newPostData);

                    return #ok(());
                };
            };
        };
    };
}
