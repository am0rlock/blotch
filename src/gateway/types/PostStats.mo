import Timestamp "Timestamp";

module
{
    public type PostStats = 
    {
        postTime : Timestamp.Timestamp;
        numLikers : Nat64;
        numComments : Nat64;
    };
}
