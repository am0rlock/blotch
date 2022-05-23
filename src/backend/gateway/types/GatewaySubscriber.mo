module
{
    public type GatewaySubscriber = actor
    {
        notifyNewPortal : (newPortalPrincipal : Principal) -> async ()
    };
}
