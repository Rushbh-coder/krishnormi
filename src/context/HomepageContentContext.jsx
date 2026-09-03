import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const HomepageContentContext = createContext(null);

export function HomepageContentProvider({ children }) {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('sort_order');

    if (fetchError) {
      setError(fetchError);
    } else {
      const map = {};
      for (const row of data) map[row.id] = row;
      setSections(map);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <HomepageContentContext.Provider value={{ sections, loading, error, refetch }}>
      {children}
    </HomepageContentContext.Provider>
  );
}

export function useHomepageContent() {
  const ctx = useContext(HomepageContentContext);
  if (!ctx) throw new Error('useHomepageContent must be used within HomepageContentProvider');
  return ctx;
}

/** One section's row (content, visible, ...), falling back to defaults while loading or if a row is missing. */
export function useSection(id) {
  const { sections, loading } = useHomepageContent();
  return { row: sections[id], loading };
}
