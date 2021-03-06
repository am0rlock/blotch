export const idlFactory = ({ IDL }) => {
  const Profile = IDL.Record({
    'bio' : IDL.Text,
    'username' : IDL.Text,
    'userPrincipal' : IDL.Principal,
    'avatar' : IDL.Vec(IDL.Nat8),
  });
  return IDL.Service({
    'initialize' : IDL.Func([], [], []),
    'notifyNewPortal' : IDL.Func([IDL.Principal], [], []),
    'notifyProfileUpdate' : IDL.Func([Profile], [], []),
    'search' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Principal)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
