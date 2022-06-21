# blotch

Blotch is a decentralized social media running on the Internet Computer that allows users to share rich content on the blockchain at traditional web speeds.

Interfacing to the backend via a frontend involves completing a handoff procedure with the Gateway canister:

1) The frontend talks to the Gateway canister and either creates a new Portal canister for a new user or gets the principal of the Portal canister for an existing user.
2) The frontend then talks to this Portal canister to perform all user related tasks (get followers, get profile, change username, create post, like post, etc.)
3) The frontend may also talk to other fixed canisters to get access to new or trending content.

---

<h2 align="center"><b>Documentation</b></h2>

<h3>Gateway Canister</h3>

```
/*
 * Returns the Principals of all Portals 
 */
func getAllPortalPrincipals() : async [Principal]
```

```
/*
 * Returns the Principal of the callers Portal or 
 * creates a new Portal and returns its Principal.
 */
func grabPortal() : async Result<Principal, GatewayError>
```

<h3>Portal Canister</h3>

```
/*
 * Returns the Profile of this Portal
 */
func getProfile() : async Profile
```

```
/*
 * Returns an array of Principals corresponding 
 * to the other Portals this Portal is following
 */
func getFollowing() : async [Principal]
```

```
/*
 * Returns an array of Principals corresponding 
 * to the other Portals this Portal is followed by
 */
func getFollowers() : async [Principal]
```

```
/*
 * Returns an array of PostIDs of the posts created 
 * by this user
 */
func getPostIDs() : async [PostID]
```

```
/*
 * Gets the post corresponding to the postID 
 * (make sure the PostID.portalPrincipal 
 * corresponds to this Portal)
 */
func getPost(postID : PostID) : async Result<Post, PortalError>
```

```
/*
 * Get's all the PostIDs of this Portal's
 * liked posts.
 */
func getLikedPosts() : async [PostID]
```

```
/*
 * Get's all the PostIDs of the other Portals
 * this Portal is following
 */
func getFollowingPostIDs() : async [PostID]
```

```
/*
 * Get's all the Portal principal's of the
 * Portal's this portal is following is 
 * following
 */
func getFollowingFollowers() : async [Principal]
```

```
/*
 * Sets the Portal's profile to newProfile
 */
func setProfile(newProfile : ProfileUpdate) : async Result<(), PortalError>
```

```
/*
 * Starts following the Portal corresponding 
 * to newPortalPrincipal
 */
func addFollowing(newPortalPrincipal : Principal) : async Result<(), PortalError>
```

```
/*
 * Stops following the Portal corresponding 
 * to otherPortalPrincipal
 */
func removeFollowing(otherPortalPrincipal : Principal) : async Result<(), PortalError>
```

```
/*
 * Creates a post for this user with postContent
 */
func createPost(postContent : PostContent) : async Result<(), PortalError>
```

```
/*
 * Like the post corresponding to postID
 */
func likePost(postID : PostID) : async Result<(), PortalError>
```

```
/*
 * Unlikes the post corresponding to postID
 */
func unlikePost(postID : PostID) : async Result<(), PortalError>
```

```
/*
 * Creates comment with the specified content
 */
func createComment(postID : PostID, content : Text) : async Result<(), PortalError>
```

```
/*
 * Reports the post and charges blotches
 */
func reportPost(postID : PostID) : async Result<(), PortalError>
```

```
/*
 * Deletes all comments off the specified
 * post. Post must belong to this Portal
 */
func deleteAllComments(postID : PostID) : async Result<(), PortalError>
```

<h3>PostDatabase Canister</h3>

```
/*
 * Returns an array of the PostIDs of the top 
 * posts from the specified range. If the range 
 * is invalid, it returns an error
 */
func getTopPosts(start : Nat64, end : Int64) : async [PostID]
```
