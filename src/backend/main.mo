import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    username : Text;
    role : Text; // "admin", "user", "guest"
  };

  public type PhishingScanResult = {
    urlOrText : Text;
    verdict : Text; // "Safe", "Suspicious", "Phishing"
    trustScore : Nat;
    scanDate : Text;
    scannedBy : Principal;
  };

  public type AdminActionLog = {
    action : Text;
    timestamp : Text;
  };

  public type AuditEntry = {
    changeset : Text;
    timestamp : Text;
    userId : Principal;
  };

  public type ScanResponse = {
    verdict : Text;
    trustScore : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let scanResults = Map.empty<Nat, PhishingScanResult>();
  let siteConfig = Map.empty<Text, Text>();
  let bannedUsers = Map.empty<Principal, Bool>();
  let auditLog = Map.empty<Nat, AuditEntry>();
  let adminLog = Map.empty<Nat, AdminActionLog>();
  var scanResultIdCounter = 0;
  var auditLogIdCounter = 0;

  func recordAdminAction(action : Text) {
    let logId = adminLog.size();
    let log : AdminActionLog = {
      action;
      timestamp = "dummyTimestamp";
    };
    adminLog.add(logId, log);
  };

  func addAuditEntry(changeset : Text, userId : Principal) {
    let entry : AuditEntry = {
      changeset;
      timestamp = "dummyTimestamp";
      userId;
    };
    auditLog.add(auditLogIdCounter, entry);
    auditLogIdCounter += 1;
  };

  // User Management
  public shared ({ caller }) func registerUser(profile : UserProfile) : async () {
    // Anyone including guests can register
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already registered");
    };
    userProfiles.add(caller, profile);
    addAuditEntry("User registered: " # profile.username, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Anyone can get their own profile
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    addAuditEntry("User profile updated", caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Can only view your own profile unless you're an admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.toArray();
  };

  public shared ({ caller }) func removeUser(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove users");
    };
    switch (userProfiles.get(user)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?_) {
        userProfiles.remove(user);
        recordAdminAction("Removed user: " # user.toText());
        addAuditEntry("Deleted user profile", caller);
      };
    };
  };

  public shared ({ caller }) func banUser(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can ban users");
    };
    bannedUsers.add(user, true);
    recordAdminAction("Banned user: " # user.toText());
    addAuditEntry("Banned user", caller);
  };

  public query ({ caller }) func isUserBanned(user : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check ban status");
    };
    bannedUsers.containsKey(user);
  };

  // Phishing Detection
  public shared ({ caller }) func scanUrlOrText(urlOrText : Text) : async ScanResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform scans");
    };
    if (bannedUsers.containsKey(caller)) {
      Runtime.trap("Banned users cannot perform scans");
    };
    let result = performPhishingDetection(urlOrText, caller);
    scanResults.add(scanResultIdCounter, result);
    scanResultIdCounter += 1;
    addAuditEntry("Scanned URL/Text: " # urlOrText, caller);
    { verdict = result.verdict; trustScore = result.trustScore };
  };

  func performPhishingDetection(urlOrText : Text, _caller : Principal) : PhishingScanResult {
    var score = 100;
    if (urlOrText.contains(#text "http://")) {
      let urlParts = urlOrText.split(#char '.');
      if (urlParts.size() == 4) { score -= 40 };
    };
    let phishingKeywords = ["login", "verify", "update", "secure", "bank"];
    for (keyword in phishingKeywords.values()) {
      if (urlOrText.contains(#text keyword)) {
        score -= 10;
      };
    };
    if (urlOrText.size() > 75) { score -= 20 };
    let verdict = if (score >= 70) { "Safe" } else if (score >= 40) {
      "Suspicious";
    } else { "Phishing" };
    {
      urlOrText;
      verdict;
      trustScore = if (score < 0) { 0 } else { score };
      scanDate = "dummyDate";
      scannedBy = _caller;
    };
  };

  public query ({ caller }) func getAllScanResults() : async [PhishingScanResult] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all scan results");
    };
    scanResults.values().toArray();
  };

  public shared ({ caller }) func deleteScanResult(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete scan results");
    };
    switch (scanResults.get(index)) {
      case (null) {
        Runtime.trap("Scan result not found");
      };
      case (?_) {
        scanResults.remove(index);
        recordAdminAction("Deleted scan result at index: " # index.toText());
        addAuditEntry("Deleted scan result", caller);
      };
    };
  };

  public shared ({ caller }) func updateScanResult(index : Nat, verdict : Text, trustScore : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update scan results");
    };
    switch (scanResults.get(index)) {
      case (null) {
        Runtime.trap("Scan result not found");
      };
      case (?existing) {
        let updated : PhishingScanResult = {
          existing with verdict;
          trustScore;
        };
        scanResults.add(index, updated);
        recordAdminAction("Updated scan result at index: " # index.toText());
        addAuditEntry("Updated scan result", caller);
      };
    };
  };

  // Admin Helpers
  public shared ({ caller }) func saveConfigValue(key : Text, value : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    siteConfig.add(key, value);
    recordAdminAction("Saved config: " # key);
    addAuditEntry("Saved config value", caller);
  };

  public query ({ caller }) func readConfigValue(key : Text) : async ?Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    siteConfig.get(key);
  };

  public query ({ caller }) func getSystemStats() : async {
    totalScans : Nat;
    safeCount : Nat;
    suspiciousCount : Nat;
    phishingCount : Nat;
    totalUsers : Nat;
  } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view stats");
    };
    var safeCount = 0;
    var suspiciousCount = 0;
    var phishingCount = 0;
    for (result in scanResults.values()) {
      switch (result.verdict) {
        case ("Safe") { safeCount += 1 };
        case ("Suspicious") { suspiciousCount += 1 };
        case ("Phishing") { phishingCount += 1 };
        case (_) {};
      };
    };
    {
      totalScans = scanResults.size();
      safeCount;
      suspiciousCount;
      phishingCount;
      totalUsers = userProfiles.size();
    };
  };

  // Audit & Admin Logs
  public query ({ caller }) func getAdminLog() : async [AdminActionLog] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view action logs");
    };
    adminLog.values().toArray();
  };

  public query ({ caller }) func getAuditLog() : async [AuditEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };
    auditLog.values().toArray();
  };
};
