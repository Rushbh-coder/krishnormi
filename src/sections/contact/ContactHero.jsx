import bannerBg from "../../assets/contact/banner-bg.png";
import ContactReveal from "./ContactReveal";

export default function ContactHero({ content }) {
  return (
        <section className="relative min-h-[560px] overflow-hidden bg-white max-[960px]:flex max-[960px]:min-h-0 max-[960px]:flex-col">
          <div
            className="absolute inset-0 z-0 max-[960px]:relative max-[960px]:order-2 max-[960px]:h-[300px] max-[560px]:h-[240px]"
            aria-hidden="true"
          >
            <img
              src={bannerBg}
              alt=""
              className="contact-banner-image absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>

          <div className="container relative z-[1] flex min-h-[560px] items-center max-[960px]:order-1 max-[960px]:min-h-0 max-[960px]:py-14">
            <div className="mt-[-10%] max-w-[600px] max-[960px]:mt-0 max-[960px]:max-w-full">
              <ContactReveal variant="left">
                <h3 className="mt-[-20%] font-heading text-[55px] leading-[1.2] font-bold max-[960px]:mt-0 max-[700px]:text-[38px] max-[420px]:text-[30px]">
                  <span className="font-heading text-[55px] not-italic font-bold leading-[77px] text-primary">
                    Contact
                  </span>{" "}
                  <span className="text-text-dark">Us</span>
                </h3>
              </ContactReveal>

              <ContactReveal delay={100}>
                <hr className="section-divider contact-accent-line w-45" />
              </ContactReveal>

              <ContactReveal delay={180}>
                <p className="mt-6 font-heading text-2xl font-bold text-text-dark max-[420px]:text-xl">
                  {content.banner_heading}
                </p>
              </ContactReveal>

              <ContactReveal delay={280}>
                <p className="mt-4 max-w-[450px] font-heading text-[16px] leading-[1.6] text-text">
                  {content.banner_text}
                </p>
              </ContactReveal>
            </div>
          </div>
        </section>
  );
}
