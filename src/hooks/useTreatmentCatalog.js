import { useCallback, useEffect, useState } from "react";

import { supabase } from "../lib/supabaseClient";
import { FALLBACK_CATALOG } from "../sections/treatment/treatmentData";

const CATEGORY_COLUMNS =
  "id,slug,title,description,description_2,image_url,default_image,visible,sort_order,updated_at";
const TREATMENT_COLUMNS =
  "id,category_id,title,description,image_url,default_image,visible,sort_order,updated_at";

/**
 * Treatment categories with their treatments nested under `treatments`, both
 * ordered by sort_order. Row level security decides what comes back: visitors
 * only get visible rows, a signed-in admin gets everything.
 *
 * `categories` is the bundled fallback while loading or if the tables cannot
 * be read; `isFallback` tells the admin screens not to edit that copy.
 */
export function useTreatmentCatalog() {
  const [categories, setCategories] = useState(FALLBACK_CATALOG);
  const [isFallback, setIsFallback] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    const [categoriesResult, treatmentsResult] = await Promise.all([
      supabase
        .from("treatment_categories")
        .select(CATEGORY_COLUMNS)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("treatments")
        .select(TREATMENT_COLUMNS)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    const fetchError = categoriesResult.error || treatmentsResult.error;

    if (fetchError) {
      console.error("Treatment catalog fetch error:", fetchError);

      setError(fetchError);
      setLoading(false);
      return null;
    }

    const byCategory = {};

    (treatmentsResult.data || []).forEach((treatment) => {
      (byCategory[treatment.category_id] ||= []).push(treatment);
    });

    const next = (categoriesResult.data || []).map((category) => ({
      ...category,
      treatments: byCategory[category.id] || [],
    }));

    setCategories(next);
    setIsFallback(false);
    setError(null);
    setLoading(false);

    return next;
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
      .channel(`treatment_catalog_realtime_${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "treatment_categories" },
        () => refetch(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "treatments" },
        () => refetch(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return {
    categories,
    isFallback,
    loading,
    error,
    refetch,
  };
}
