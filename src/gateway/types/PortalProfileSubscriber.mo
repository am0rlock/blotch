import Profile "Profile";

module
{
    public type PortalProfileSubscriber = actor
    {
        notifyProfileUpdate : (newProfile : Profile.Profile) -> async ();
    };
}
