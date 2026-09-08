import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { supabase } from '../../lib/supabaseClient';
import { formatRelativeTime } from '../../lib/formatRelativeTime';

export default function Appointments() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('contact_enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEnquiries(data);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    const { error: deleteError } = await supabase.from('contact_enquiries').delete().eq('id', id);
    setDeletingId(null);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setEnquiries((rows) => rows.filter((row) => row.id !== id));
  };

  return (
    <AdminLayout activeNav="appointments" pageTitle="Appointments">
      <div className="flex flex-col gap-[22px]">
        <div>
          <h1 className="font-heading text-[28px] font-bold text-[#101828]">Appointment Enquiries</h1>
          <p className="mt-1 font-body text-sm text-[#667085]">
            Submissions from the "Book a Consultation" form on the Contact Us page.
          </p>
        </div>

        {loading ? (
          <p className="font-body text-sm text-[#667085]">Loading…</p>
        ) : error ? (
          <p className="font-body text-sm text-[#df2759]">{error}</p>
        ) : enquiries.length === 0 ? (
          <p className="font-body text-sm text-[#667085]">No enquiries yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="flex flex-col gap-2 rounded-2xl border border-[#e4eae7] bg-white p-5 shadow-[0_8px_24px_-8px_rgba(15,33,28,0.05)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-base font-semibold text-[#101828]">{enquiry.name}</p>
                    <p className="font-body text-xs text-[#98a2b3]">{formatRelativeTime(enquiry.created_at)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(enquiry.id)}
                    disabled={deletingId === enquiry.id}
                    className="rounded-[8px] border border-[#f7c8d5] bg-[#fce8ee] px-3 py-1.5 font-heading text-xs font-semibold text-[#df2759] hover:bg-[#df2759] hover:text-white disabled:opacity-50"
                  >
                    {deletingId === enquiry.id ? 'Removing…' : 'Remove'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-body text-sm text-[#344054]">
                  <a href={`mailto:${enquiry.email}`} className="hover:text-primary hover:underline">
                    {enquiry.email}
                  </a>
                  <a href={`tel:${enquiry.phone}`} className="hover:text-primary hover:underline">
                    {enquiry.phone}
                  </a>
                </div>
                {enquiry.message && (
                  <p className="font-body text-sm text-[#536660]">{enquiry.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
