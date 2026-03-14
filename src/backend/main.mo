import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type AdminSession = {
    adminId : Principal;
    sessionToken : Text;
  };

  public type ScanResult = {
    urlOrText : Text;
    isSafe : Bool;
    confidenceScore : Nat;
  };

  public type APIResponse = {
    status : Text;
    confidence : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let scanResults = Map.empty<Text, ScanResult>();
  let adminSessions = Map.empty<Text, AdminSession>();
  let siteConfig = Map.empty<Text, Text>();
  let bannedUsers = Map.empty<Principal, Bool>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (bannedUsers.containsKey(caller)) {
      Runtime.trap("Banned users cannot update profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func scanUrlOrText(input : Text) : async APIResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform scans");
    };
    if (bannedUsers.containsKey(caller)) {
      Runtime.trap("Banned users cannot perform scans");
    };
    if (input.contains(#text "unsafe")) {
      let newResult : ScanResult = {
        urlOrText = input;
        isSafe = false;
        confidenceScore = 85;
      };
      scanResults.add(input, newResult);
      { status = "Unsafe"; confidence = 85 };
    } else {
      let newResult : ScanResult = {
        urlOrText = input;
        isSafe = true;
        confidenceScore = 95;
      };
      scanResults.add(input, newResult);
      { status = "Safe"; confidence = 95 };
    };
  };

  public shared ({ caller }) func adminLogin() : async { sessionToken : Text } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let sessionToken = "dummySessionToken";
    let newSession : AdminSession = {
      adminId = caller;
      sessionToken;
    };
    adminSessions.add(sessionToken, newSession);
    { sessionToken };
  };

  public query ({ caller }) func getAllScanResults() : async [ScanResult] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    scanResults.values().toArray();
  };

  public shared ({ caller }) func adminLogout(sessionToken : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (adminSessions.get(sessionToken)) {
      case (null) {
        Runtime.trap("Invalid session token");
      };
      case (?session) {
        if (session.adminId != caller) {
          Runtime.trap("Unauthorized: Cannot logout another admin's session");
        };
        adminSessions.remove(sessionToken);
      };
    };
  };

  // ADMIN OPS
  public query ({ caller }) func listUsers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    userProfiles.toArray();
  };

  public shared ({ caller }) func banUser(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    bannedUsers.add(user, true);
  };

  public shared ({ caller }) func removeUser(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (userProfiles.get(user)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?_) {
        userProfiles.remove(user);
      };
    };
  };

  public shared ({ caller }) func deleteScanResult(key : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (scanResults.get(key)) {
      case (null) {
        Runtime.trap("Scan result not found");
      };
      case (?_) {
        scanResults.remove(key);
      };
    };
  };

  public shared ({ caller }) func saveConfigValue(key : Text, value : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    siteConfig.add(key, value);
  };

  public query ({ caller }) func readConfigValue(key : Text) : async ?Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    siteConfig.get(key);
  };
};
