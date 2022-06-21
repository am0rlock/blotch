export const idlFactory = ({ IDL }) => {
  const PortalError = IDL.Variant({
    'CannotLike' : IDL.Null,
    'ProfileInvalid' : IDL.Null,
    'InvalidPortal' : IDL.Null,
    'NotEnoughBlotches' : IDL.Null,
    'CannotCreatePost' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'CannotUnlike' : IDL.Null,
    'PostNotFound' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : PortalError });
  const PostID = IDL.Record({
    'id' : IDL.Nat64,
    'portalPrincipal' : IDL.Principal,
  });
  const Comment = IDL.Record({
    'content' : IDL.Text,
    'posterPortalPrincipal' : IDL.Principal,
  });
  const PostContent = IDL.Record({
    'media' : IDL.Vec(IDL.Nat8),
    'description' : IDL.Text,
  });
  const Timestamp = IDL.Nat64;
  const Post = IDL.Record({
    'postTime' : Timestamp,
    'content' : PostContent,
    'numLikers' : IDL.Nat64,
    'comments' : IDL.Vec(Comment),
  });
  const Result_1 = IDL.Variant({ 'ok' : Post, 'err' : PortalError });
  const PostStats = IDL.Record({
    'postTime' : Timestamp,
    'numLikers' : IDL.Nat64,
    'numReporters' : IDL.Nat64,
    'numComments' : IDL.Nat64,
  });
  const Profile = IDL.Record({
    'bio' : IDL.Text,
    'username' : IDL.Text,
    'userPrincipal' : IDL.Principal,
    'avatar' : IDL.Vec(IDL.Nat8),
  });
  const ProfileUpdate = IDL.Record({
    'bio' : IDL.Text,
    'username' : IDL.Text,
    'avatar' : IDL.Vec(IDL.Nat8),
  });
  const Portal = IDL.Service({
    'addFollower' : IDL.Func([], [Result], []),
    'addFollowing' : IDL.Func([IDL.Principal], [Result], []),
    'createComment' : IDL.Func([PostID, IDL.Text], [Result], []),
    'createMyComment' : IDL.Func([PostID, Comment], [Result], []),
    'createPost' : IDL.Func([PostContent], [Result], []),
    'deleteAllComments' : IDL.Func([PostID], [Result], []),
    'deletePost' : IDL.Func([PostID], [Result], []),
    'deleteReportedPost' : IDL.Func([PostID], [Result], []),
    'getFollowers' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getFollowing' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getFollowingFollowers' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'getFollowingPostIDs' : IDL.Func([], [IDL.Vec(PostID)], []),
    'getLikedPosts' : IDL.Func([], [IDL.Vec(PostID)], ['query']),
    'getNumBlotches' : IDL.Func([], [IDL.Nat64], ['query']),
    'getPost' : IDL.Func([PostID], [Result_1], ['query']),
    'getPostIDs' : IDL.Func([], [IDL.Vec(PostID)], ['query']),
    'getPostStats' : IDL.Func([PostID], [IDL.Opt(PostStats)], ['query']),
    'getProfile' : IDL.Func([], [Profile], ['query']),
    'giveReward' : IDL.Func([], [], []),
    'likeMyPost' : IDL.Func([PostID], [Result], []),
    'likePost' : IDL.Func([PostID], [Result], []),
    'rechargeBlotches' : IDL.Func([], [], []),
    'removeFollower' : IDL.Func([], [Result], []),
    'removeFollowing' : IDL.Func([IDL.Principal], [Result], []),
    'reportMyPost' : IDL.Func([PostID], [Result], []),
    'reportPost' : IDL.Func([PostID], [Result], []),
    'setProfile' : IDL.Func([ProfileUpdate], [Result], []),
    'subscribePostDatabase' : IDL.Func([], [], []),
    'subscribeProfileDatabase' : IDL.Func([], [], []),
    'unlikeMyPost' : IDL.Func([PostID], [Result], []),
    'unlikePost' : IDL.Func([PostID], [Result], []),
  });
  return Portal;
};
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Func([IDL.Principal], [IDL.Bool], ['query'])];
};
