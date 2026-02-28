import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, APIResponse, ScanResult } from '../backend';
import type { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useScanAnalysis() {
  const { actor } = useActor();

  return useMutation<APIResponse, Error, string>({
    mutationFn: async (input: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.scanUrlOrText(input);
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useAdminLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminLogin();
    },
    onSuccess: (data) => {
      sessionStorage.setItem('adminSessionToken', data.sessionToken);
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}

export function useGetAllScanResults() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ScanResult[]>({
    queryKey: ['allScanResults'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllScanResults();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAdminLogout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = sessionStorage.getItem('adminSessionToken') ?? '';
      return actor.adminLogout(token);
    },
    onSuccess: () => {
      sessionStorage.removeItem('adminSessionToken');
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}

// Admin: User Management
export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useBanUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.banUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useDeleteUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

// Admin: Submission Moderation
export function useDeleteSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteScanResult(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allScanResults'] });
    },
  });
}

// Admin: Site Configuration
export function useGetSiteConfig(key: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['siteConfig', key],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.readConfigValue(key);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveSiteConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveConfigValue(key, value);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['siteConfig', variables.key] });
    },
  });
}
