export const idlFactory = ({ IDL }) => {
  const PostID = IDL.Record({
    'id' : IDL.Nat64,
    'portalPrincipal' : IDL.Principal,
  });
  const PostDatabaseError = IDL.Variant({ 'InvalidRange' : IDL.Null });
  const Result = IDL.Variant({
    'ok' : IDL.Vec(PostID),
    'err' : PostDatabaseError,
  });
  return IDL.Service({
    'getTopPosts' : IDL.Func([IDL.Nat64, IDL.Int64], [Result], ['query']),
    'initialize' : IDL.Func([], [], []),
    'notifyNewPortal' : IDL.Func([IDL.Principal], [], []),
    'notifyPostUpdate' : IDL.Func([PostID], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
