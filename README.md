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
func grabPortal() : async Result<Principal, GatewayError>
```

<h3>Portal Canister</h3>

```
func getProfile() : async Profile
```

```
func getFollowing() : async [Principal]
```

```
func getFollowers() : async [Principal]
```

```
func getPostIDs() : async [PostID]
```

```
func getPost(postID : PostID) : async Result<Post, PortalError>
```

```
func setProfile(newProfile : ProfileUpdate) : async Result<(), PortalError>
```

```
func addFollowing(newPortalPrincipal : Principal) : async Result<(), PortalError>
```

```
func removeFollowing(otherPortalPrincipal : Principal) : async Result<(), PortalError>
```

```
func createPost(postContent : PostContent) : async Result<(), PortalError>
```

```
func deletePost(postID : PostID) : async Result<(), PortalError>
```

```
func likePost(postID : PostID) : async Result<(), PortalError>
```

```
func unlikePost(postID : PostID) : async Result<(), PortalError>
```