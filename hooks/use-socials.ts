"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { SocialDTO } from "@/types/common";

const SOCIALS_ENDPOINT = "/api/social";

type CreateSocialPayload = Partial<SocialDTO>;
type UpdateSocialPayload = Partial<SocialDTO>;

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

/**
 * Pure API function.
 * No React state is accessed here.
 */
async function getSocials(signal?: AbortSignal): Promise<SocialDTO[]> {
  return api.get<SocialDTO[]>(SOCIALS_ENDPOINT, { signal });
}

/**
 * Fetch social links.
 */
export function useSocials() {
  const [data, setData] = useState<SocialDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initial fetch.
   *
   * The effect only starts the asynchronous operation.
   */
  useEffect(() => {
    const controller = new AbortController();

    getSocials(controller.signal)
      .then((socials) => {
        setData(socials);
        setError(null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setError(getErrorMessage(error, "Failed to load social links"));

        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  /**
   * Manually refetch social links.
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const socials = await getSocials();

      setData(socials);

      return socials;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load social links"));

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

/**
 * Create a social link.
 */
export function useCreateSocial() {
  const [data, setData] = useState<SocialDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSocial = useCallback(async (payload: CreateSocialPayload) => {
    setLoading(true);
    setError(null);

    try {
      const social = await api.post<SocialDTO>(SOCIALS_ENDPOINT, payload);

      setData(social);

      return social;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to create social link"));

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
    createSocial,
    clearError,
  };
}

/**
 * Update a social link.
 */
export function useUpdateSocial() {
  const [data, setData] = useState<SocialDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSocial = useCallback(
    async (id: string, payload: UpdateSocialPayload) => {
      if (!id) {
        const message = "Social id is required";

        setError(message);

        throw new Error(message);
      }

      setLoading(true);
      setError(null);

      try {
        const social = await api.patch<SocialDTO>(
          `${SOCIALS_ENDPOINT}/${id}`,
          payload,
        );

        setData(social);

        return social;
      } catch (error) {
        setError(getErrorMessage(error, "Failed to update social link"));

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    updateSocial,
    clearError,
  };
}

/**
 * Delete a social link.
 */
export function useDeleteSocial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSocial = useCallback(async (id: string) => {
    if (!id) {
      const message = "Social id is required";

      setError(message);

      throw new Error(message);
    }

    setLoading(true);
    setError(null);

    try {
      await api.delete<{ message: string }>(`${SOCIALS_ENDPOINT}/${id}`);
    } catch (error) {
      setError(getErrorMessage(error, "Failed to delete social link"));

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    deleteSocial,
    clearError,
  };
}
