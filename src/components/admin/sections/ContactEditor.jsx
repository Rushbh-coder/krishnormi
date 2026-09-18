import { useEffect, useState } from "react";
import SectionPanel from "../SectionPanel";
import { Field, TextInput, TextArea } from "../fields";
import { useSaveSection } from "../../../hooks/useSaveSection";

const HEADING_LIMIT = 24;
const TEXT_LIMIT = 250;
const ADDRESS_LIMIT = 100;
const Appointment_Limit=100;
const eyebrow_Limit=20;

export default function ContactEditor({
  initialContent,
  initialVisible,
  onPreview,
}) {
  const [content, setContent] = useState(initialContent);

  const [visible, setVisible] = useState(initialVisible);
  const [savedVisible, setSavedVisible] = useState(initialVisible);

  useEffect(() => {
    setVisible(initialVisible);
    setSavedVisible(initialVisible);
  }, [initialVisible]);

  const { save, saving, lastSaved, error } = useSaveSection("contact");

  const set = (key) => (value) =>
    setContent((c) => ({
      ...c,
      [key]: value,
    }));

  const limitedSet = (key, limit) => (value) => {
    setContent((c) => ({
      ...c,
      [key]: value.slice(0, limit),
    }));
  };

  const handleSave = async () => {
    const saved = await save(content, visible);

    if (saved) {
      setSavedVisible(visible);
    }
  };

  return (
    <SectionPanel
      title="Contact Us page"
      description="Banner, clinic details and enquiry form copy on /contact-us"
      visible={visible}
      savedVisible={savedVisible}
      onVisibleChange={setVisible}
      lastSaved={lastSaved}
    >
      {/* Banner Eyebrow */}
      <Field label="Banner eyebrow">
        <TextInput
          value={content.banner_eyebrow}
          maxLength={eyebrow_Limit}
          onChange={set("banner_eyebrow")}
        />
        <p className="mt-1 text-xs text-[#667085]">
          {content.banner_eyebrow?.length || 0}/{eyebrow_Limit}
        </p>
      </Field>

      {/* Banner Heading */}
      <Field label="Banner heading">
        <TextInput
          value={content.banner_heading}
          maxLength={HEADING_LIMIT}
          onChange={limitedSet("banner_heading", HEADING_LIMIT)}
        />

        <p className="mt-1 text-xs text-[#667085]">
          {content.banner_heading?.length || 0}/{HEADING_LIMIT}
        </p>
      </Field>

      {/* Banner Text */}
      <Field label="Banner text">
        <TextArea
          value={content.banner_text}
          maxLength={TEXT_LIMIT}
          onChange={limitedSet("banner_text", TEXT_LIMIT)}
          rows={2}
        />

        <p className="mt-1 text-xs text-[#667085]">
          {content.banner_text?.length || 0}/{TEXT_LIMIT}
        </p>
      </Field>

      {/* Address */}
      <Field label="Address">
        <TextArea
          value={content.address}
          maxLength={ADDRESS_LIMIT}
          onChange={limitedSet("address", ADDRESS_LIMIT)}
          rows={2}
        />

        <p className="mt-1 text-xs text-[#667085]">
          {content.address?.length || 0}/{ADDRESS_LIMIT}
        </p>
      </Field>

      {/* Phone + Email */}
      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Phone">
          <TextInput value={content.phone} onChange={set("phone")} />
        </Field>

        <Field label="Email">
          <TextInput
            value={content.email}
            onChange={set("email")}
            type="email"
          />
        </Field>
      </div>

      {/* Appointment Note */}
      <Field label="Appointment note">
        <TextInput
          value={content.appointment_note}
          onChange={set("appointment_note")}
        />
      </Field>

      {/* Map Info */}
      <Field label="Map info card">
        <div className="flex flex-col gap-3">
          <TextInput
            value={content.map_label_name}
            onChange={set("map_label_name")}
          />

          <TextInput
            value={content.map_label_line1}
            onChange={set("map_label_line1")}
          />

          <TextInput
            value={content.map_label_line2}
            onChange={set("map_label_line2")}
          />
        </div>
      </Field>

      {/* Get In Touch Text */}
      <Field label="Get in Touch intro text">
        <TextArea
          value={content.connect_text}
          maxLength={TEXT_LIMIT}
          onChange={limitedSet("connect_text", TEXT_LIMIT)}
          rows={2}
        />

        <p className="mt-1 text-xs text-[#667085]">
          {content.connect_text?.length || 0}/{TEXT_LIMIT}
        </p>
      </Field>

      {/* Form Heading + Subtitle */}

      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Appointment form heading">
          <TextInput
            value={content.form_title}
            maxLength={HEADING_LIMIT}
            onChange={limitedSet("form_title", HEADING_LIMIT)}
          />

          <p className="mt-1 text-xs text-[#667085]">
            {content.form_title?.length || 0}/{HEADING_LIMIT}
          </p>
        </Field>

        <Field label="Appointment form subtitle">
          <TextInput
            value={content.form_subtitle}
            maxLength={Appointment_Limit}
            onChange={limitedSet("form_subtitle", Appointment_Limit)}
          />

          <p className="mt-1 text-xs text-[#667085]">
            {content.form_subtitle?.length || 0}/{Appointment_Limit}
          </p>
        </Field>
      </div>

      {error && <p className="font-body text-sm text-[#df2759]">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            rounded-[10px]
            bg-[#df2759]
            px-5
            py-2.5
            font-heading
            text-sm
            font-semibold
            text-white
            disabled:opacity-60
          "
        >
          {saving ? "Saving…" : "Save changes"}
        </button>

        <button
          type="button"
          onClick={() =>
            onPreview({
              content,
              visible,
            })
          }
          className="
            rounded-[10px]
            border
            border-[#df2759]
            px-5
            py-2.5
            font-heading
            text-sm
            font-semibold
            text-[#df2759]
            hover:bg-[#df2759]
            hover:text-white
          "
        >
          Preview Changes
        </button>
      </div>
    </SectionPanel>
  );
}
