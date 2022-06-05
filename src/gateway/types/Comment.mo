module
{
    public type Comment = 
    {
        posterPortalPrincipal : Principal;
        content : Text;
    };

    public func construct(posterPortalPrincipal0 : Principal, content0 : Text) : Comment
    {
        return {
            posterPortalPrincipal = posterPortalPrincipal0;
            content = content0;
        };
    };
};
