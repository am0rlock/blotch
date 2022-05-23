import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Profile {
  'bio' : string,
  'username' : string,
  'userPrincipal' : Principal,
}
export interface _SERVICE {
  'notifyNewPortal' : ActorMethod<[Principal], undefined>,
  'notifyProfileUpdate' : ActorMethod<[Profile], undefined>,
}
