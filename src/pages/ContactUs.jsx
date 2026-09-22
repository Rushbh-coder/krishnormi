import Header from "../sections/Header";
import Footer from "../sections/Footer";
import FAQ from "../sections/FAQ";
import Testimonials from "../sections/Testimonials";
import ContactHero from "../sections/contact/ContactHero";
import ContactFormSection from "../sections/contact/ContactFormSection";
import ContactMap from "../sections/contact/ContactMap";
import ContactReveal from "../sections/contact/ContactReveal";
import CONTACT_ANIMATION_CSS from "../sections/contact/contactStyles";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

export default function ContactUs() {
  const { row } = useSection("contact");

  const previewMode = new URLSearchParams(window.location.search).get("preview") === "true";
  let previewData = null;
  if (previewMode) {
    try { previewData = JSON.parse(sessionStorage.getItem("contact_preview") || "null"); }
    catch { previewData = null; }
  }

  const content = previewData?.content ? previewData.content : (row?.content ?? DEFAULT_CONTENT.contact);
  const mapQuery = content.latitude && content.longitude ? `${content.latitude},${content.longitude}` : content.address;

  return (
    <>
      <Header />
      <main className="contact-page">
        <style>{CONTACT_ANIMATION_CSS}</style>
        <ContactHero content={content} />
        <ContactFormSection content={content} />
        <ContactMap content={content} mapQuery={mapQuery} />
        <ContactReveal variant="fade" className="py-0"><FAQ /></ContactReveal>
        <ContactReveal variant="fade"><Testimonials /></ContactReveal>
      </main>
      <Footer />
    </>
  );
}
