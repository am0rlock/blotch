import Hash "mo:base/Hash";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Random "mo:base/Random";

module
{
    public type PostID = 
    {
        portalPrincipal : Principal;
        id : Nat64;
    };

    public func construct(portalPrincipal0 : Principal, seed : Blob) : PostID
    {
        return {
            portalPrincipal = portalPrincipal0;
            id = Nat64.fromNat(Random.rangeFrom(64, seed));
        };
    };

    public func equal(x : PostID, y : PostID) : Bool
    {
        return x.id == y.id;
    };

    public func hash(x : PostID) : Hash.Hash
    {
        return Nat32.fromNat(Nat64.toNat(x.id));
    };
};
