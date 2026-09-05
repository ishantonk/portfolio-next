"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { ProfileWithRelationsDTO } from "@/types/common";

const PROFILE_ENDPOINT = "/api/profile";

type ProfileUpdatePayload = Partial<ProfileWithRelationsDTO>;

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

async function getProfile(
  signal?: AbortSignal,
): Promise<ProfileWithRelationsDTO> {
  return api.get<ProfileWithRelationsDTO>(PROFILE_ENDPOINT, { signal });
}

export function useProfile() {
  const [data, setData] = useState<ProfileWithRelationsDTO | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /**
   * Initial profile loading.
   *
   * The effect only starts the async operation.
   * State is updated after the request resolves/rejects.
   */
  useEffect(() => {
    const controller = new AbortController();

    getProfile(controller.signal)
      .then((profile) => {
        setData(profile);
        setError(null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setError(getErrorMessage(error, "Failed to load profile"));

        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  /**
   * Manually refetch the profile.
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profile = await getProfile();

      setData(profile);

      return profile;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load profile"));

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    clearError,
  };
}

export function useUpdateProfile() {
  const [data, setData] = useState<ProfileWithRelationsDTO | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (payload: ProfileUpdatePayload) => {
    setLoading(true);
    setError(null);

    try {
      const profile = await api.patch<ProfileWithRelationsDTO>(
        PROFILE_ENDPOINT,
        payload,
      );

      setData(profile);

      return profile;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to update profile"));

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    updateProfile,
    clearError,
  };
}
