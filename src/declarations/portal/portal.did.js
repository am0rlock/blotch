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
  const PostContent = IDL.Record({ 'words' : IDL.Text });
  const PostID = IDL.Record({
    'id' : IDL.Nat64,
    'portalPrincipal' : IDL.Principal,
  });
  const Timestamp = IDL.Nat64;
  const Post = IDL.Record({
    'postTime' : Timestamp,
    'content' : PostContent,
    'numLikers' : IDL.Nat64,
  });
  const Result_2 = IDL.Variant({ 'ok' : Post, 'err' : PortalError });
  const PostStats = IDL.Record({
    'postTime' : Timestamp,
    'numLikers' : IDL.Nat64,
  });
  const Result_1 = IDL.Variant({ 'ok' : PostStats, 'err' : PortalError });
  const Profile = IDL.Record({
    'bio' : IDL.Text,
    'username' : IDL.Text,
    'userPrincipal' : IDL.Principal,
  });
  const ProfileUpdate = IDL.Record({ 'bio' : IDL.Text, 'username' : IDL.Text });
  const Portal = IDL.Service({
    'addFollower' : IDL.Func([], [Result], []),
    'addFollowing' : IDL.Func([IDL.Principal], [Result], []),
    'createPost' : IDL.Func([PostContent], [Result], []),
    'getFollowers' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getFollowing' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getFollowingPostIDs' : IDL.Func([], [IDL.Vec(PostID)], []),
    'getNumBlotches' : IDL.Func([], [IDL.Nat64], ['query']),
    'getPost' : IDL.Func([PostID], [Result_2], ['query']),
    'getPostIDs' : IDL.Func([], [IDL.Vec(PostID)], ['query']),
    'getPostStats' : IDL.Func([PostID], [Result_1], ['query']),
    'getProfile' : IDL.Func([], [Profile], ['query']),
    'likeMyPost' : IDL.Func([PostID], [Result], []),
    'likePost' : IDL.Func([PostID], [Result], []),
    'rechargeBlotches' : IDL.Func([], [], []),
    'removeFollower' : IDL.Func([], [Result], []),
    'removeFollowing' : IDL.Func([IDL.Principal], [Result], []),
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
