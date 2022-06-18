import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

<<<<<<< HEAD
export interface PostID { 'id' : bigint, 'portalPrincipal' : Principal }
export interface _SERVICE {
  'getTopNReportedPosts' : ActorMethod<[bigint, bigint], Array<PostID>>,
  'initialize' : ActorMethod<[], undefined>,
  'notifyNewPortal' : ActorMethod<[Principal], undefined>,
  'notifyPostUpdate' : ActorMethod<[PostID], undefined>,
}
=======
export interface _SERVICE {}
>>>>>>> 4332f43b0626bc9497fc58118af5e4c032552b8b
