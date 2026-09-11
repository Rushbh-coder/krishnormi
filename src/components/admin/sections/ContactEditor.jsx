import { useState } from "react";
import SectionPanel from "../SectionPanel";
import { Field, TextInput, TextArea } from "../fields";
import { useSaveSection } from "../../../hooks/useSaveSection";

export default function ContactEditor({
  initialContent,
  initialVisible,
  onPreview,
}) {
  const [content, setContent] = useState(initialContent);

  const [visible, setVisible] = useState(initialVisible);

  const { save, saving, lastSaved, error } = useSaveSection("contact");

  const set = (key) => (value) =>
    setContent((c) => ({
      ...c,
      [key]: value,
    }));

  return (
    <SectionPanel
      title="Contact Us page"
      description="Banner, clinic details and enquiry form copy on /contact-us"
      visible={visible}
      onVisibleChange={setVisible}
      lastSaved={lastSaved}
    >
      <Field label="Banner eyebrow">
        <TextInput
          value={content.banner_eyebrow}
          onChange={set("banner_eyebrow")}
        />
      </Field>

      <Field label="Banner heading">
        <TextInput
          value={content.banner_heading}
          onChange={set("banner_heading")}
        />
      </Field>

      <Field label="Banner text">
        <TextArea
          value={content.banner_text}
          onChange={set("banner_text")}
          rows={2}
        />
      </Field>

      <Field label="Address">
        <TextArea value={content.address} onChange={set("address")} rows={2} />
      </Field>

      {/* <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Latitude">
          <TextInput value={content.latitude} onChange={set("latitude")} />
        </Field>

        <Field label="Longitude">
          <TextInput value={content.longitude} onChange={set("longitude")} />
        </Field>
      </div> */}

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

      <Field label="Appointment note">
        <TextInput
          value={content.appointment_note}
          onChange={set("appointment_note")}
        />
      </Field>

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

      <Field label="Get in Touch intro text">
        <TextArea
          value={content.connect_text}
          onChange={set("connect_text")}
          rows={2}
        />
      </Field>

      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Appointment form heading">
          <TextInput value={content.form_title} onChange={set("form_title")} />
        </Field>

        <Field label="Appointment form subtitle">
          <TextInput
            value={content.form_subtitle}
            onChange={set("form_subtitle")}
          />
        </Field>
      </div>

      {error && <p className="font-body text-sm text-[#df2759]">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => save(content, visible)}
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
