import photo1 from "../assets/why-choose/photo-1.png";
import photo2 from "../assets/why-choose/photo-2.png";
import photo3 from "../assets/why-choose/photo-3.png";
import photo4 from "../assets/why-choose/photo-4.png";
import ornament1 from "../assets/why-choose/ornament-1.svg";
import ornament2 from "../assets/why-choose/ornament-2.svg";
import ornament3 from "../assets/why-choose/ornament-3.svg";
import ornament4 from "../assets/why-choose/ornament-4.svg";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";
import ExpandableText from "../components/ExpandableText";

// Fallback local asset per card slot (position matches the DB `cards` array).
const TEMPLATE = [
  { ornament: ornament3, alt: "" },
  { photo: photo1, alt: "Dermatologist examining a patient's skin" },
  { ornament: ornament4, alt: "" },
  { photo: photo2, alt: "Laser skin treatment procedure" },
  { photo: photo3, alt: "Patient with healthy, glowing skin" },
  { ornament: ornament1, alt: "" },
  { photo: photo4, alt: "Cosmetic injection procedure" },
  { ornament: ornament2, alt: "" },
];

function Card({ card, template }) {
  if (card.type === "image") {
    return (
      <div className="overflow-hidden rounded-[10px] max-[640px]:h-[240px]">
        <img className="h-full w-full object-cover" src={card.image_url || template.photo} alt={template.alt} />
      </div>
    );
  }
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[10px] p-[27px_29px] shadow-[0px_2px_80px_0px_rgba(0,0,0,0.1)] ${
        card.dark ? "bg-navy" : "bg-white"
      }`}
    >
      <div className="mb-6 flex items-center gap-3">
        <span className={`h-6 w-[3px] flex-none ${card.dark ? "bg-white" : "bg-navy"}`} />
        <h3 className={`m-0 font-heading text-xl leading-[1.4] font-semibold ${card.dark ? "text-white" : "text-navy"}`}>
          {card.title}
        </h3>
      </div>
      <ExpandableText
        text={card.text}
        lines={4}
        className={`m-0 font-heading text-[15px] leading-[1.85] ${card.dark ? "text-white" : "text-text"}`}
        toggleClassName={`mt-1.5 font-heading text-xs font-semibold hover:underline ${card.dark ? "text-white/80" : "text-accent"}`}
      />
      <img
        className="pointer-events-none absolute right-4 bottom-3 h-auto w-16 opacity-50"
        src={template.ornament}
        alt=""
        aria-hidden="true"
      />
    </div>
  );
}

export default function WhyChoose() {
  const { row, loading } = useSection('why-choose');
  const content = row?.content ?? DEFAULT_CONTENT['why-choose'];
  const visible = row?.visible ?? true;
  const cards = content.cards ?? DEFAULT_CONTENT['why-choose'].cards;

  if (!loading && !visible) return null;

  return (
    <section className="bg-tint py-[90px]">
      <div className="container">
        <div className="mb-14 text-center">
          <h2 className="section-title">{content.title}</h2>
          <hr className="section-divider mx-auto" />
        </div>
        <div className="grid grid-cols-4 auto-rows-[minmax(278px,auto)] gap-6 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1">
          {cards.map((card, i) => (
            <Card key={i} card={card} template={TEMPLATE[i] ?? {}} />
          ))}
        </div>
      </div>
    </section>
  );
}
