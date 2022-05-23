export const idlFactory = ({ IDL }) => {
  const Profile = IDL.Record({
    'bio' : IDL.Text,
    'username' : IDL.Text,
    'userPrincipal' : IDL.Principal,
  });
  return IDL.Service({
    'notifyNewPortal' : IDL.Func([IDL.Principal], [], []),
    'notifyProfileUpdate' : IDL.Func([Profile, Profile], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
