import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface PostID { 'id' : bigint, 'portalPrincipal' : Principal }
export interface _SERVICE {
  'notifyNewPortal' : ActorMethod<[Principal], undefined>,
  'notifyPostUpdate' : ActorMethod<[PostID], undefined>,
}
