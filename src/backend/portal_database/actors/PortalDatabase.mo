import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import TrieSet "mo:base/TrieSet";

import Gateway "canister:gateway";

import Portal "../../gateway/actors/Portal";
import Profile "../../gateway/types/Profile";

actor PortalDatabase
{
    var hasSubscribed : Bool = false;
    var portalPrincipals : TrieSet.Set<Principal> = TrieSet.empty();
    var portalPrincipalToProfile : HashMap.HashMap<Principal, Profile.Profile> = HashMap.HashMap(0, Principal.equal, Principal.hash);

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
