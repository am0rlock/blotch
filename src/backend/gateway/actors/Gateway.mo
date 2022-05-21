import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

import Portal "Portal";

import GatewayError "../types/GatewayError";

actor Gateway
{
    var userToPortal : HashMap.HashMap<Principal, Principal> = HashMap.HashMap<Principal, Principal>(0, Principal.equal, Principal.hash);

    public shared(msg) func createPortal() : async Result.Result<Principal, GatewayError.GatewayError>
    {
        let value : ?Principal = userToPortal.get(msg.caller);
        switch (value)
        {
            case null
            {
                Cycles.add(200000000000);
                let newPortal : Portal.Portal = await Portal.Portal(msg.caller);
                let portalPrincipal : Principal = Principal.fromActor(newPortal);

                userToPortal.put(msg.caller, portalPrincipal);

                return #ok(portalPrincipal);
            };
            case (?value)
            {
                return #err(#PortalAlreadyExists);
            };
        };
    };

    public shared(msg) func getPortal() : async Result.Result<Principal, GatewayError.GatewayError>
    {
        let value : ?Principal = userToPortal.get(msg.caller);
        switch (value)
        {
            case null
            {
                return #err(#PortalNotFound);
            };
            case (?value)
            {
                return #ok(value);
            };
        };
    };
};
