import Profile "Profile";

module
{
    public type PortalProfileSubscriber = actor
    {
        notifyProfileUpdate : (oldProfile : Profile.Profile, newProfile : Profile.Profile) -> async ()
    };
}
