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
            id = Random.rangeFrom(64, seed);
        };
    };
};
