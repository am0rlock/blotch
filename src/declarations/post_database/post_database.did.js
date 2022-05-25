export const idlFactory = ({ IDL }) => {
  const PostID = IDL.Record({
    'id' : IDL.Nat64,
    'portalPrincipal' : IDL.Principal,
  });
  const PostUpdateType = IDL.Variant({
    'Delete' : IDL.Null,
    'Create' : IDL.Null,
  });
  return IDL.Service({
    'notifyNewPortal' : IDL.Func([IDL.Principal], [], []),
    'notifyPostUpdate' : IDL.Func([PostID, PostUpdateType], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
