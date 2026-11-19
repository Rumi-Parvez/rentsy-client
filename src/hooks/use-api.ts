"use client";

import { useCallback, useEffect, useState } from "react";

import { apiGet, getErrorMessage } from "@/lib/api";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(path: string | null) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: Boolean(path),
    error: null,
  });

  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let cancelled = false;

    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    apiGet<T>(path)
      .then((data) => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: getErrorMessage(error),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path, version]);

  return { ...state, refresh };
}
