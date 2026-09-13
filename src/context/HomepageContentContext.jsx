import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

const HomepageContentContext = createContext(null);

export function HomepageContentProvider({ children }) {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from("homepage_sections")
        .select("id,title,description,visible,sort_order,content,updated_at")
        .order("sort_order", {
          ascending: true,
        });

      if (fetchError) {
        console.error("Homepage content fetch error:", fetchError);

        setError(fetchError);
        return;
      }

      const map = {};

      (data || []).forEach((row) => {
        map[row.id] = row;
      });

      console.log("Latest homepage sections:", map);

      console.log("Latest about_page:", map.about_page);

      setSections(map);
      setError(null);
    } catch (err) {
      console.error("Homepage content error:", err);

      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Initial load
   */
  useEffect(() => {
    refetch();
  }, [refetch]);

  /*
   * Realtime updates
   */
  useEffect(() => {
    const channel = supabase
      .channel("homepage_sections_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "homepage_sections",
        },
        (payload) => {
          console.log("Homepage realtime update:", payload);

          if (payload.eventType === "DELETE") {
            setSections((current) => {
              const next = {
                ...current,
              };

              delete next[payload.old.id];

              return next;
            });

            return;
          }

          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            setSections((current) => ({
              ...current,
              [payload.new.id]: payload.new,
            }));
          }
        },
      )
      .subscribe((status) => {
        console.log("Homepage realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <HomepageContentContext.Provider
      value={{
        sections,
        loading,
        error,
        refetch,
      }}
    >
      {children}
    </HomepageContentContext.Provider>
  );
}

export function useHomepageContent() {
  const ctx = useContext(HomepageContentContext);

  if (!ctx) {
    throw new Error(
      "useHomepageContent must be used within HomepageContentProvider",
    );
  }

  return ctx;
}

export function useSection(id) {
  const { sections, loading } = useHomepageContent();

  return {
    row: sections[id] || null,
    loading,
  };
}

const { data, error: fetchError } = await supabase
  .from("homepage_sections")
  .select("id,title,description,visible,sort_order,content,updated_at")
  .order("sort_order", {
    ascending: true,
  });

console.log("SUPABASE RESPONSE:", {
  data,
  fetchError,
});