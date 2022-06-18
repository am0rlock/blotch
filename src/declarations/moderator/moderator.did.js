<<<<<<< HEAD
export const idlFactory = ({ IDL }) => {
  const PostID = IDL.Record({
    'id' : IDL.Nat64,
    'portalPrincipal' : IDL.Principal,
  });
  return IDL.Service({
    'getTopNReportedPosts' : IDL.Func(
        [IDL.Nat64, IDL.Int64],
        [IDL.Vec(PostID)],
        [],
      ),
    'initialize' : IDL.Func([], [], []),
    'notifyNewPortal' : IDL.Func([IDL.Principal], [], []),
    'notifyPostUpdate' : IDL.Func([PostID], [], []),
  });
};
=======
export const idlFactory = ({ IDL }) => { return IDL.Service({}); };
>>>>>>> 4332f43b0626bc9497fc58118af5e4c032552b8b
export const init = ({ IDL }) => { return []; };
