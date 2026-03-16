import type { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PhishingScanResult, ScanResponse, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerUser(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useScanUrlOrText() {
  const { actor } = useActor();
  return useMutation<ScanResponse, Error, string>({
    mutationFn: async (input: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.scanUrlOrText(input);
    },
  });
}

export function useGetAllScanResults() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<PhishingScanResult[]>({
    queryKey: ["allScanResults"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllScanResults();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useDeleteScanResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteScanResult(index);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allScanResults"] });
      queryClient.invalidateQueries({ queryKey: ["systemStats"] });
    },
  });
}

export function useUpdateScanResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      index,
      verdict,
      trustScore,
    }: { index: bigint; verdict: string; trustScore: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateScanResult(index, verdict, trustScore);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allScanResults"] });
    },
  });
}

export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useBanUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error("Actor not available");
      return actor.banUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}

export function useRemoveUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["systemStats"] });
    },
  });
}

export function useGetSystemStats() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["systemStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getSystemStats();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAdminLog() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["adminLog"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAdminLog();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSiteConfig(key: string) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<string | null>({
    queryKey: ["siteConfig", key],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.readConfigValue(key);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveConfigValue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveConfigValue(key, value);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["siteConfig", variables.key],
      });
    },
  });
}
