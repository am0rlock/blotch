import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface PostID { 'id' : bigint, 'portalPrincipal' : Principal }
export type PostUpdateType = { 'Delete' : null } |
  { 'Create' : null };
export interface _SERVICE {
  'initialize' : ActorMethod<[], undefined>,
  'notifyNewPortal' : ActorMethod<[Principal], undefined>,
  'notifyPostUpdate' : ActorMethod<[PostID, PostUpdateType], undefined>,
}
