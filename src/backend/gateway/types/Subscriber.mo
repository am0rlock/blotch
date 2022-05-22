module
{
    public type Subscriber = actor
    {
        addPortalPrincipal : (newPortalPrincipal : Principal) -> async ()
    };
}
