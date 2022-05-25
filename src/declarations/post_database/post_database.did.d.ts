import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type PostDatabaseError = { 'InvalidRange' : null };
export interface PostID { 'id' : bigint, 'portalPrincipal' : Principal }
export type PostUpdateType = { 'Delete' : null } |
  { 'Create' : null };
export type Result = { 'ok' : Array<PostID> } |
  { 'err' : PostDatabaseError };
export interface _SERVICE {
  'getTopPosts' : ActorMethod<[bigint, bigint], Result>,
  'initialize' : ActorMethod<[], undefined>,
  'notifyNewPortal' : ActorMethod<[Principal], undefined>,
  'notifyPostUpdate' : ActorMethod<[PostID, PostUpdateType], undefined>,
}
