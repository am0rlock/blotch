import Profile "Profile";

module
{
    public type PortalPortalSubscriber = actor
    {
        notifyProfileUpdate : (newProfile : Profile.Profile) -> async ()
    };
}
