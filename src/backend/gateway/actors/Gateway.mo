import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

import Portal "Portal";

import GatewayError "../types/GatewayError";

actor Gateway
{
    var userToPortal : HashMap.HashMap<Principal, Portal.Portal> = HashMap.HashMap(0, Principal.equal, Principal.hash);

    public shared(msg) func createPortal() : async Result.Result<Principal, GatewayError.GatewayError>
    {
        let value : ?Portal.Portal = userToPortal.get(msg.caller);
        switch (value)
        {
            case null
            {
                Cycles.add(200000000000);
                let newPortal : Portal.Portal = await Portal.Portal(msg.caller);

                userToPortal.put(msg.caller, newPortal);

                return #ok(Principal.fromActor(newPortal));
            };
            case (?value)
            {
                return #err(#PortalAlreadyExists);
            };
        };
    };

    public shared(msg) func getPortal() : async Result.Result<Principal, GatewayError.GatewayError>
    {
        let value : ?Portal.Portal = userToPortal.get(msg.caller);
        switch (value)
        {
            case null
            {
                return #err(#PortalNotFound);
            };
            case (?value)
            {
                return #ok(Principal.fromActor(value));
            };
        };
    };
};
