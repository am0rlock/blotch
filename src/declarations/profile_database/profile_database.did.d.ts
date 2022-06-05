import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Profile {
  'bio' : string,
  'username' : string,
  'userPrincipal' : Principal,
  'avatar' : Array<number>,
}
export interface _SERVICE {
  'initialize' : ActorMethod<[], undefined>,
  'notifyNewPortal' : ActorMethod<[Principal], undefined>,
  'notifyProfileUpdate' : ActorMethod<[Profile], undefined>,
}
