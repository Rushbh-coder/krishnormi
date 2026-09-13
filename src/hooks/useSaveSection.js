import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useHomepageContent } from "../context/HomepageContentContext";

export function useSaveSection(id) {
  const { refetch } = useHomepageContent();

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState("");

  const save = async (content, visible = true) => {
    setSaving(true);
    setError("");

    try {
      /*
       * Your homepage_sections table has NOT NULL columns:
       *
       * id
       * title
       * description
       * visible
       * sort_order
       * content
       * updated_at
       *
       * Therefore all required values must be supplied.
       */

      const sectionData = {
        id,

        title: id === "about_page" ? "About Us Page" : id,

        description: id === "about_page" ? "Content for the About Us page" : "",

        visible: Boolean(visible),

        /*
         * Keep existing sort order.
         * About Us = 20
         */
        sort_order: id === "about_page" ? 20 : 0,

        content: content || {},

        updated_at: new Date().toISOString(),
      };

      const { data, error: saveError } = await supabase
        .from("homepage_sections")
        .upsert(sectionData, {
          onConflict: "id",
        })
        .select("id,title,description,visible,sort_order,content,updated_at")
        .single();

      if (saveError) {
        console.error("Supabase save error:", saveError);

        setError(saveError.message);

        return false;
      }

      if (!data) {
        setError("The section could not be saved.");

        return false;
      }

      console.log("Section saved successfully:", data);

      setLastSaved("just now");
      setError("");

      await refetch();

      return true;
    } catch (err) {
      console.error("Unexpected save error:", err);

      setError(err?.message || "Something went wrong while saving.");

      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    save,
    saving,
    lastSaved,
    error,
  };
}
