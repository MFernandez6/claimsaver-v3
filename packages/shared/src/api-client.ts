export type ApiOk<T> = { data: T; error?: undefined };
export type ApiErr = { data?: undefined; error: string };
export type ApiResult<T> = ApiOk<T> | ApiErr;

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export type TokenGetter = () => Promise<string | null>;

/**
 * Tiny typed fetch wrapper used by both the Next.js app and Expo.
 * Web can omit getToken (cookies). Mobile must pass the Supabase access token.
 */
export function createApiClient(options: {
  baseUrl: string;
  getToken?: TokenGetter;
}) {
  const base = options.baseUrl.replace(/\/$/, "");

  async function request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(init.headers);
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const token = options.getToken ? await options.getToken() : null;
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(`${base}${path}`, {
      ...init,
      headers,
      credentials: options.getToken ? "omit" : "include",
    });

    const json = (await res.json().catch(() => ({}))) as ApiResult<T> & {
      error?: string;
    };

    if (!res.ok) {
      throw new ApiClientError(
        json.error || `Request failed (${res.status})`,
        res.status,
      );
    }

    if (json && typeof json === "object" && "data" in json) {
      return json.data as T;
    }
    return json as T;
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, {
        method: "POST",
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
    patch: <T>(path: string, body?: unknown) =>
      request<T>(path, {
        method: "PATCH",
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
    upload: async (path: string, form: FormData) => {
      const headers = new Headers();
      const token = options.getToken ? await options.getToken() : null;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      const res = await fetch(`${base}${path}`, {
        method: "POST",
        headers,
        body: form,
        credentials: options.getToken ? "omit" : "include",
      });
      const json = (await res.json().catch(() => ({}))) as ApiResult<unknown>;
      if (!res.ok) {
        throw new ApiClientError(
          json.error || `Upload failed (${res.status})`,
          res.status,
        );
      }
      return ("data" in json ? json.data : json) as unknown;
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
