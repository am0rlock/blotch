import Moderator "canister:moderator";
import PostDatabase "canister:post_database";
import ProfileDatabase "canister:profile_database";

actor Initializer
{
    stable var hasInitialized : Bool = false;

    system func heartbeat() : async ()
    {
        if (not hasInitialized)
        {
            await Moderator.initialize();
            await PostDatabase.initialize();
            await ProfileDatabase.initialize();
            hasInitialized := true;
        };
    };
}
