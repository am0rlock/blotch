import Principal "mo:base/Principal";
import TrieSet "mo:base/TrieSet";

import Gateway "canister:gateway";
import Portal "../../gateway/actors/Portal";

import PostID "../../gateway/types/PostID";

actor PostDatabase
{
    var hasSubscribed : Bool = false;
    var portalPrincipals : TrieSet.Set<Principal> = TrieSet.empty();
    var postIDs : TrieSet.Set<PostID.PostID> = TrieSet.empty();

    public shared(msg) func addPortalPrincipal(newPortalPrincipal : Principal) : async ()
    {
        if (TrieSet.mem(portalPrincipals, newPortalPrincipal, Principal.hash(newPortalPrincipal), Principal.equal)) { return; };

        portalPrincipals := TrieSet.put(portalPrincipals, newPortalPrincipal, Principal.hash(newPortalPrincipal), Principal.equal);
    };

    system func heartbeat() : async ()
    {
        if (not hasSubscribed)
        {
            await Gateway.subscribe();
            hasSubscribed := true;
        };
    };
};
