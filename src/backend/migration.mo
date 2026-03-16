import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Old types
  type OldUserProfile = {
    name : Text;
  };

  // New types
  type NewUserProfile = {
    name : Text;
    username : Text;
    role : Text;
  };

  type OldScanResult = {
    urlOrText : Text;
    isSafe : Bool;
    confidenceScore : Nat;
  };

  type NewPhishingScanResult = {
    urlOrText : Text;
    verdict : Text;
    trustScore : Nat;
    scanDate : Text;
    scannedBy : Principal;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    scanResults : Map.Map<Text, OldScanResult>;
    adminSessions : Map.Map<Text, { adminId : Principal; sessionToken : Text }>;
    siteConfig : Map.Map<Text, Text>;
    bannedUsers : Map.Map<Principal, Bool>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    scanResults : Map.Map<Nat, NewPhishingScanResult>;
    siteConfig : Map.Map<Text, Text>;
    bannedUsers : Map.Map<Principal, Bool>;
    adminLog : Map.Map<Nat, { action : Text; timestamp : Text }>;
    auditLog : Map.Map<Nat, { changeset : Text; timestamp : Text; userId : Principal }>;
    scanResultIdCounter : Nat;
    auditLogIdCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_, oldProfile) {
        {
          oldProfile with
          username = "";
          role = "user";
        };
      }
    );

    let newScanResults = Map.empty<Nat, NewPhishingScanResult>();

    {
      userProfiles = newUserProfiles;
      scanResults = newScanResults;
      siteConfig = old.siteConfig;
      bannedUsers = old.bannedUsers;
      adminLog = Map.empty<Nat, { action : Text; timestamp : Text }>();
      auditLog = Map.empty<Nat, { changeset : Text; timestamp : Text; userId : Principal }>();
      scanResultIdCounter = 0;
      auditLogIdCounter = 0;
    };
  };
};
