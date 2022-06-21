import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

import Portal "Portal";

import GatewayError "../types/GatewayError";
import GatewaySubscriber "../types/GatewaySubscriber";

actor Gateway
{
    stable var userToPortalStable : [(Principal, Portal.Portal)] = [];
    var userToPortal : HashMap.HashMap<Principal, Portal.Portal> = HashMap.fromIter(userToPortalStable.vals(), 0, Principal.equal, Principal.hash);//HashMap.HashMap(0, Principal.equal, Principal.hash);
    stable var subscribers : [GatewaySubscriber.GatewaySubscriber] = [];

    public shared query func getAllPortalPrincipals() : async [Principal]
    {
        func f(p : Portal.Portal) : Principal = Principal.fromActor(p);
        return Array.map(Iter.toArray(userToPortal.vals()), f);
    };

    public shared(msg) func grabPortal() : async Result.Result<Principal, GatewayError.GatewayError>
    {
        let value : ?Portal.Portal = userToPortal.get(msg.caller);
        switch (value)
        {
            case null
            {
                Cycles.add(200000000000);
                let newPortal : Portal.Portal = await Portal.Portal(msg.caller, isPortalPrincipalValid);
                let newPortalPrincipal : Principal = Principal.fromActor(newPortal);

                userToPortal.put(msg.caller, newPortal);

                for (subscriber in subscribers.vals())
                {
                    ignore subscriber.notifyNewPortal(newPortalPrincipal);
                };

                return #ok(newPortalPrincipal);
            };
            case (?value)
            {
                return #ok(Principal.fromActor(value));
            };
        };
    };

    public shared query func isPortalPrincipalValid(portalPrincipal : Principal) : async Bool
    {
        let rawPortals : [Portal.Portal] = Iter.toArray(userToPortal.vals());
        func gen(i : Nat) : Principal = Principal.fromActor(rawPortals[i]);
        let portalPrincipals : [Principal] = Array.tabulate(rawPortals.size(), gen);

        func f(p : Principal) : Bool = Principal.equal(p, portalPrincipal);
        let value : ?Principal = Array.find(portalPrincipals, f);
        switch (value)
        {
            case null
            {
                return false;
            };
            case (?value)
            {
                return true;
            };
        };
    };

    public shared(msg) func subscribe() : async ()
    {
        let subscriber : GatewaySubscriber.GatewaySubscriber = actor(Principal.toText(msg.caller));
        subscribers := Array.append(subscribers, [subscriber]);
    };

    system func preupgrade()
    {
        userToPortalStable := Iter.toArray(userToPortal.entries());
    };

    system func postupgrade()
    {
        userToPortalStable := [];
    };
};
