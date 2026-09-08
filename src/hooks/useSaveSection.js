import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useHomepageContent } from '../context/HomepageContentContext';

export function useSaveSection(id) {
  const { refetch } = useHomepageContent();
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState('');

  const save = async (content, visible) => {
    setSaving(true);
    setError('');
    const { data, error: saveError } = await supabase
      .from('homepage_sections')
      .update({ content, visible })
      .eq('id', id)
      .select('id');
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return false;
    }
    if (!data || data.length === 0) {
      setError(`No "${id}" row exists in homepage_sections yet — run its setup SQL in Supabase first.`);
      return false;
    }
    setLastSaved('just now');
    await refetch();
    return true;
  };

  return { save, saving, lastSaved, error };
}
