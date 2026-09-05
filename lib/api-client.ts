export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;

    // Maintains instanceof ApiError in some transpilation environments.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

type QueryParamValue = string | number | boolean | undefined;

type RequestOptions = RequestInit & {
  params?: Record<string, QueryParamValue>;
};

function getErrorMessage(data: unknown, fallback: string): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return fallback;
}

async function parseResponse(response: Response): Promise<unknown> {
  // Avoid attempting JSON parsing when there is no response body.
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers, ...fetchOptions } = options;

  const finalUrl = new URL(url, window.location.origin);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        finalUrl.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(finalUrl, {
    ...fetchOptions,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, response.statusText || "Something went wrong"),
      response.status,
      data,
    );
  }

  return data as T;
}

export const api = {
  get<T>(url: string, options?: RequestOptions) {
    return request<T>(url, {
      ...options,
      method: "GET",
    });
  },

  post<T>(url: string, body?: unknown, options?: RequestOptions) {
    return request<T>(url, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(url: string, body?: unknown, options?: RequestOptions) {
    return request<T>(url, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(url: string, body?: unknown, options?: RequestOptions) {
    return request<T>(url, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(url: string, options?: RequestOptions) {
    return request<T>(url, {
      ...options,
      method: "DELETE",
    });
  },
};
