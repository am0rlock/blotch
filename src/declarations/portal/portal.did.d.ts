import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Comment {
  'content' : string,
  'posterPortalPrincipal' : Principal,
}
export interface Portal {
  'addFollower' : ActorMethod<[], Result>,
  'addFollowing' : ActorMethod<[Principal], Result>,
  'createComment' : ActorMethod<[PostID, string], Result>,
  'createMyComment' : ActorMethod<[PostID, Comment], Result>,
  'createPost' : ActorMethod<[PostContent], Result>,
  'getFollowers' : ActorMethod<[], Array<Principal>>,
  'getFollowing' : ActorMethod<[], Array<Principal>>,
  'getFollowingPostIDs' : ActorMethod<[], Array<PostID>>,
  'getNumBlotches' : ActorMethod<[], bigint>,
  'getPost' : ActorMethod<[PostID], Result_1>,
  'getPostIDs' : ActorMethod<[], Array<PostID>>,
  'getPostStats' : ActorMethod<[PostID], [] | [PostStats]>,
  'getProfile' : ActorMethod<[], Profile>,
  'likeMyPost' : ActorMethod<[PostID], Result>,
  'likePost' : ActorMethod<[PostID], Result>,
  'rechargeBlotches' : ActorMethod<[], undefined>,
  'removeFollower' : ActorMethod<[], Result>,
  'removeFollowing' : ActorMethod<[Principal], Result>,
  'reportMyPost' : ActorMethod<[PostID], Result>,
  'reportPost' : ActorMethod<[PostID], Result>,
  'setProfile' : ActorMethod<[ProfileUpdate], Result>,
  'subscribePostDatabase' : ActorMethod<[], undefined>,
  'subscribeProfileDatabase' : ActorMethod<[], undefined>,
  'unlikeMyPost' : ActorMethod<[PostID], Result>,
  'unlikePost' : ActorMethod<[PostID], Result>,
}
export type PortalError = { 'CannotLike' : null } |
  { 'ProfileInvalid' : null } |
  { 'InvalidPortal' : null } |
  { 'NotEnoughBlotches' : null } |
  { 'CannotCreatePost' : null } |
  { 'NotAuthorized' : null } |
  { 'CannotUnlike' : null } |
  { 'PostNotFound' : null };
export interface Post {
  'postTime' : Timestamp,
  'content' : PostContent,
  'numLikers' : bigint,
  'comments' : Array<Comment>,
}
export interface PostContent { 'media' : Array<number>, 'description' : string }
export interface PostID { 'id' : bigint, 'portalPrincipal' : Principal }
export interface PostStats {
  'postTime' : Timestamp,
  'numLikers' : bigint,
  'numComments' : bigint,
}
export interface Profile {
  'bio' : string,
  'username' : string,
  'userPrincipal' : Principal,
  'avatar' : Array<number>,
}
export interface ProfileUpdate {
  'bio' : string,
  'username' : string,
  'avatar' : Array<number>,
}
export type Result = { 'ok' : null } |
  { 'err' : PortalError };
export type Result_1 = { 'ok' : Post } |
  { 'err' : PortalError };
export type Timestamp = bigint;
export interface _SERVICE extends Portal {}
