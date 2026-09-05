"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { ProjectWithRelationsDTO } from "@/types/common";

const PROJECTS_ENDPOINT = "/api/projects";

type CreateProjectPayload = Omit<
  Partial<ProjectWithRelationsDTO>,
  "features" | "tech"
> & {
  features?: {
    content: string;
  }[];

  tech?: {
    name: string;
  }[];
};
type UpdateProjectPayload = Omit<
  Partial<ProjectWithRelationsDTO>,
  "features" | "tech"
> & {
  features?: {
    content: string;
  }[];

  tech?: {
    name: string;
  }[];
};
function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

/**
 * Pure API functions.
 * These do not interact with React state.
 */
async function getProjects(
  signal?: AbortSignal,
): Promise<ProjectWithRelationsDTO[]> {
  return api.get<ProjectWithRelationsDTO[]>(PROJECTS_ENDPOINT, { signal });
}

async function getProject(
  id: string,
  signal?: AbortSignal,
): Promise<ProjectWithRelationsDTO> {
  return api.get<ProjectWithRelationsDTO>(`${PROJECTS_ENDPOINT}/${id}`, {
    signal,
  });
}

/**
 * Fetch all projects.
 */
export function useProjects() {
  const [data, setData] = useState<ProjectWithRelationsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getProjects(controller.signal)
      .then((projects) => {
        setData(projects);
        setError(null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setError(getErrorMessage(error, "Failed to load projects"));

        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const projects = await getProjects();

      setData(projects);

      return projects;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load projects"));

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
 * Fetch a single project.
 */
export function useProject(id?: string) {
  const [data, setData] = useState<ProjectWithRelationsDTO | null>(null);

  const [loading, setLoading] = useState(Boolean(id));

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // No request should be made without an id.
    if (!id) {
      return;
    }

    const controller = new AbortController();

    getProject(id, controller.signal)
      .then((project) => {
        setData(project);
        setError(null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setError(getErrorMessage(error, "Failed to load project"));

        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [id]);

  const refetch = useCallback(async () => {
    if (!id) {
      const message = "Project id is required";

      setError(message);

      throw new Error(message);
    }

    setLoading(true);
    setError(null);

    try {
      const project = await getProject(id);

      setData(project);

      return project;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load project"));

      throw error;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * id is the source of truth.
   *
   * Don't synchronize "no id" into state inside useEffect.
   */
  if (!id) {
    return {
      data: null,
      loading: false,
      error: null,
      refetch,
      clearError,
    };
  }

  return {
    data,
    loading,
    error,
    refetch,
    clearError,
  };
}

/**
 * Create a project.
 */
export function useCreateProject() {
  const [data, setData] = useState<ProjectWithRelationsDTO | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const createProject = useCallback(async (payload: CreateProjectPayload) => {
    setLoading(true);
    setError(null);

    try {
      const project = await api.post<ProjectWithRelationsDTO>(
        PROJECTS_ENDPOINT,
        payload,
      );

      setData(project);

      return project;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to create project"));

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
    createProject,
    clearError,
  };
}

/**
 * Update a project.
 */
export function useUpdateProject() {
  const [data, setData] = useState<ProjectWithRelationsDTO | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const updateProject = useCallback(
    async (id: string, payload: UpdateProjectPayload) => {
      if (!id) {
        const message = "Project id is required";

        setError(message);

        throw new Error(message);
      }

      setLoading(true);
      setError(null);

      try {
        const project = await api.patch<ProjectWithRelationsDTO>(
          `${PROJECTS_ENDPOINT}/${id}`,
          payload,
        );

        setData(project);

        return project;
      } catch (error) {
        setError(getErrorMessage(error, "Failed to update project"));

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
    updateProject,
    clearError,
  };
}

/**
 * Delete a project.
 */
export function useDeleteProject() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const deleteProject = useCallback(async (id: string) => {
    if (!id) {
      const message = "Project id is required";

      setError(message);

      throw new Error(message);
    }

    setLoading(true);
    setError(null);

    try {
      await api.delete<{ message: string }>(`${PROJECTS_ENDPOINT}/${id}`);
    } catch (error) {
      setError(getErrorMessage(error, "Failed to delete project"));

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
    deleteProject,
    clearError,
  };
}
