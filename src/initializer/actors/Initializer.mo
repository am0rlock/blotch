import PostDatabase "canister:post_database";
import ProfileDatabase "canister:profile_database";

actor Initializer
{
    var hasInitialized : Bool = false;

    system func heartbeat() : async ()
    {
        if (not hasInitialized)
        {
            await PostDatabase.initialize();
            await ProfileDatabase.initialize();
            hasInitialized := true;
        };
    };
}
