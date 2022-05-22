import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";

module
{
    public type Timestamp = Nat64;

    public func construct() : Timestamp 
    {
        let timeMilliseconds : Int = Time.now() / 1000;
        
        return Nat64.fromIntWrap(timeMilliseconds);
    };
};
