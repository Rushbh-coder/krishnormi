import { supabase } from "./supabaseClient";

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(title, takenSlugs) {
  const base = slugify(title) || "category";
  let slug = base;
  let suffix = 2;

  while (takenSlugs.includes(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function categoryFields(category) {
  return {
    title: category.title.trim(),
    description: category.description?.trim() || null,
    description_2: category.description_2?.trim() || null,
    image_url: category.image_url || null,
    visible: category.visible !== false,
  };
}

/**
 * Saves a category together with the treatments inside it.
 *
 * `category.id` is empty for a category that does not exist yet. Treatments
 * are written in list order, and any treatment that was in the category before
 * but is missing from `treatments` is deleted.
 *
 * Returns the saved category id.
 */
export async function saveCategory({
  category,
  treatments,
  existingTreatmentIds = [],
  takenSlugs = [],
  nextSortOrder = 1,
}) {
  let categoryId = category.id;

  if (categoryId) {
    const { error } = await supabase
      .from("treatment_categories")
      .update(categoryFields(category))
      .eq("id", categoryId);

    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("treatment_categories")
      .insert({
        ...categoryFields(category),
        slug: uniqueSlug(category.title, takenSlugs),
        sort_order: nextSortOrder,
      })
      .select("id")
      .single();

    if (error) throw error;

    categoryId = data.id;
  }

  const keptIds = treatments.map((treatment) => treatment.id);
  const removedIds = existingTreatmentIds.filter((id) => !keptIds.includes(id));

  if (removedIds.length > 0) {
    const { error } = await supabase
      .from("treatments")
      .delete()
      .in("id", removedIds);

    if (error) throw error;
  }

  if (treatments.length > 0) {
    const rows = treatments.map((treatment, index) => ({
      id: treatment.id,
      category_id: categoryId,
      title: treatment.title.trim(),
      description: treatment.description?.trim() || null,
      image_url: treatment.image_url || null,
      default_image: treatment.default_image || null,
      visible: treatment.visible !== false,
      sort_order: index + 1,
    }));

    const { error } = await supabase
      .from("treatments")
      .upsert(rows, { onConflict: "id" });

    if (error) throw error;
  }

  return categoryId;
}

/** Deletes a category; its treatments go with it (on delete cascade). */
export async function deleteCategory(categoryId) {
  const { error } = await supabase
    .from("treatment_categories")
    .delete()
    .eq("id", categoryId);

  if (error) throw error;
}

/** Rewrites sort_order so the categories follow the order of `categoryIds`. */
export async function reorderCategories(categoryIds) {
  const results = await Promise.all(
    categoryIds.map((id, index) =>
      supabase
        .from("treatment_categories")
        .update({ sort_order: index + 1 })
        .eq("id", id),
    ),
  );

  const failed = results.find((result) => result.error);

  if (failed) throw failed.error;
}
