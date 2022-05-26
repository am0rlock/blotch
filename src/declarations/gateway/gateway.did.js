export const idlFactory = ({ IDL }) => {
  const GatewayError = IDL.Variant({
    'PortalNotFound' : IDL.Null,
    'PortalAlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Principal, 'err' : GatewayError });
  return IDL.Service({
    'grabPortal' : IDL.Func([], [Result], []),
    'isPortalPrincipalValid' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'subscribe' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
