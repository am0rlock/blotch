import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AssocList = [] | [[[Key, null], List]];
export interface Branch { 'left' : Trie, 'size' : bigint, 'right' : Trie }
export type Hash = number;
export interface Key { 'key' : Principal, 'hash' : Hash }
export interface Leaf { 'size' : bigint, 'keyvals' : AssocList }
export type List = [] | [[[Key, null], List]];
export interface Portal {
  'addFollower' : ActorMethod<[], Result>,
  'addFollowing' : ActorMethod<[Principal], Result>,
  'createPost' : ActorMethod<[PostContent], Result>,
  'deletePost' : ActorMethod<[PostID], Result>,
  'getFollowers' : ActorMethod<[], Array<Principal>>,
  'getFollowing' : ActorMethod<[], Array<Principal>>,
  'getPostData' : ActorMethod<[PostID], Result_1>,
  'getPostIDs' : ActorMethod<[], Array<PostID>>,
  'getProfile' : ActorMethod<[], Profile>,
  'likeMyPost' : ActorMethod<[PostID], Result>,
  'likePost' : ActorMethod<[PostID], Result>,
  'removeFollower' : ActorMethod<[], Result>,
  'removeFollowing' : ActorMethod<[Principal], Result>,
  'setProfile' : ActorMethod<[ProfileUpdate], Result>,
  'subscribePortalDatabase' : ActorMethod<[], undefined>,
  'subscribePostDatabase' : ActorMethod<[], undefined>,
  'unlikeMyPost' : ActorMethod<[PostID], Result>,
  'unlikePost' : ActorMethod<[PostID], Result>,
}
export type PortalError = { 'CannotLike' : null } |
  { 'ProfileInvalid' : null } |
  { 'InvalidPortal' : null } |
  { 'CannotCreatePost' : null } |
  { 'NotAuthorized' : null } |
  { 'CannotUnlike' : null } |
  { 'PostNotFound' : null };
export interface PostContent { 'words' : string }
export interface PostData {
  'postTime' : Timestamp,
  'content' : PostContent,
  'likers' : Set,
}
export interface PostID { 'id' : bigint, 'portalPrincipal' : Principal }
export interface Profile {
  'bio' : string,
  'username' : string,
  'userPrincipal' : Principal,
}
export interface ProfileUpdate { 'bio' : string, 'username' : string }
export type Result = { 'ok' : null } |
  { 'err' : PortalError };
export type Result_1 = { 'ok' : PostData } |
  { 'err' : PortalError };
export type Set = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export type Timestamp = bigint;
export type Trie = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export interface _SERVICE extends Portal {}
