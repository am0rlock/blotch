export const idlFactory = ({ IDL }) => {
  const PostID = IDL.Record({
    'id' : IDL.Nat64,
    'portalPrincipal' : IDL.Principal,
  });
  return IDL.Service({
    'getTopPosts' : IDL.Func(
        [IDL.Nat64, IDL.Int64],
        [IDL.Vec(PostID)],
        ['query'],
      ),
    'initialize' : IDL.Func([], [], []),
    'notifyNewPortal' : IDL.Func([IDL.Principal], [], []),
    'notifyPostUpdate' : IDL.Func([PostID], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
