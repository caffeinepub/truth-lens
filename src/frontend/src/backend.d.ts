import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScanResult {
    isSafe: boolean;
    confidenceScore: bigint;
    urlOrText: string;
}
export interface APIResponse {
    status: string;
    confidence: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminLogin(): Promise<{
        sessionToken: string;
    }>;
    adminLogout(sessionToken: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banUser(user: Principal): Promise<void>;
    deleteScanResult(key: string): Promise<void>;
    getAllScanResults(): Promise<Array<ScanResult>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listUsers(): Promise<Array<[Principal, UserProfile]>>;
    readConfigValue(key: string): Promise<string | null>;
    removeUser(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveConfigValue(key: string, value: string): Promise<void>;
    scanUrlOrText(input: string): Promise<APIResponse>;
}
