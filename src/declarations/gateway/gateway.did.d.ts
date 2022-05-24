import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type GatewayError = { 'PortalNotFound' : null } |
  { 'PortalAlreadyExists' : null };
export type Result = { 'ok' : Principal } |
  { 'err' : GatewayError };
export interface _SERVICE {
  'grabPortal' : ActorMethod<[], Result>,
  'isPortalPrincipalValid' : ActorMethod<[Principal], boolean>,
  'subscribe' : ActorMethod<[], undefined>,
}
