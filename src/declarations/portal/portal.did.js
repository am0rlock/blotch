export const idlFactory = ({ IDL }) => {
  const Branch = IDL.Rec();
  const List = IDL.Rec();
  const PortalError = IDL.Variant({
    'CannotLike' : IDL.Null,
    'ProfileInvalid' : IDL.Null,
    'InvalidPortal' : IDL.Null,
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
  const Hash = IDL.Nat32;
  const Key = IDL.Record({ 'key' : IDL.Principal, 'hash' : Hash });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Null), List)));
  const AssocList = IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Null), List));
  const Leaf = IDL.Record({ 'size' : IDL.Nat, 'keyvals' : AssocList });
  const Trie = IDL.Variant({
    'branch' : Branch,
    'leaf' : Leaf,
    'empty' : IDL.Null,
  });
  Branch.fill(IDL.Record({ 'left' : Trie, 'size' : IDL.Nat, 'right' : Trie }));
  const Set = IDL.Variant({
    'branch' : Branch,
    'leaf' : Leaf,
    'empty' : IDL.Null,
  });
  const PostData = IDL.Record({
    'postTime' : Timestamp,
    'content' : PostContent,
    'likers' : Set,
  });
  const Result_1 = IDL.Variant({ 'ok' : PostData, 'err' : PortalError });
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
    'deletePost' : IDL.Func([PostID], [Result], []),
    'getFollowers' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getFollowing' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getFollowingPostIDs' : IDL.Func([], [IDL.Vec(PostID)], []),
    'getPostData' : IDL.Func([PostID], [Result_1], ['query']),
    'getPostIDs' : IDL.Func([], [IDL.Vec(PostID)], ['query']),
    'getProfile' : IDL.Func([], [Profile], ['query']),
    'likeMyPost' : IDL.Func([PostID], [Result], []),
    'likePost' : IDL.Func([PostID], [Result], []),
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
