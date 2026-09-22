import { FaWhatsapp } from "react-icons/fa";

export default function TreatmentAppointment() {
  return (
    <section className="bg-[#f5fbfa] py-[80px]">
      <div className="container grid grid-cols-2 items-center gap-10 max-[750px]:grid-cols-1">
        <div>
          <h2 className="section-title text-navy">Need help choosing a treatment?</h2>
          <hr className="section-divider mb-5" />
          <p className="max-w-[600px] font-body text-[14px] leading-[1.8] text-text">Treatment selection depends on your concern, clinical assessment and individual suitability. Book a consultation with our dermatology team.</p>
        </div>
        <div className="flex flex-wrap justify-end gap-4 max-[750px]:justify-start">
          <a href="/contact-us" className="btn-primary">Book an Appointment</a>
          <a href="https://wa.me/918866589956" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-[6px] bg-[#25D366] px-5 py-3 font-heading font-semibold text-white"><FaWhatsapp /> WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
