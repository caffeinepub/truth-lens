import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScanResponse {
    trustScore: bigint;
    verdict: string;
}
export interface PhishingScanResult {
    scanDate: string;
    scannedBy: Principal;
    trustScore: bigint;
    verdict: string;
    urlOrText: string;
}
export interface AuditEntry {
    changeset: string;
    userId: Principal;
    timestamp: string;
}
export interface AdminActionLog {
    action: string;
    timestamp: string;
}
export interface UserProfile {
    username: string;
    name: string;
    role: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banUser(user: Principal): Promise<void>;
    deleteScanResult(index: bigint): Promise<void>;
    getAdminLog(): Promise<Array<AdminActionLog>>;
    getAllScanResults(): Promise<Array<PhishingScanResult>>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getAuditLog(): Promise<Array<AuditEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSystemStats(): Promise<{
        safeCount: bigint;
        suspiciousCount: bigint;
        totalScans: bigint;
        phishingCount: bigint;
        totalUsers: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isUserBanned(user: Principal): Promise<boolean>;
    readConfigValue(key: string): Promise<string | null>;
    registerUser(profile: UserProfile): Promise<void>;
    removeUser(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveConfigValue(key: string, value: string): Promise<void>;
    scanUrlOrText(urlOrText: string): Promise<ScanResponse>;
    updateScanResult(index: bigint, verdict: string, trustScore: bigint): Promise<void>;
}
