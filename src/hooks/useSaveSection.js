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
    const { error: saveError } = await supabase.from('homepage_sections').update({ content, visible }).eq('id', id);
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return false;
    }
    setLastSaved('just now');
    await refetch();
    return true;
  };

  return { save, saving, lastSaved, error };
}
