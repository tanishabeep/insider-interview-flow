// Slug of the one publicly accessible archive reconstruction.
// Anyone can read this one without auth. All others gated.
export const PUBLIC_ARCHIVE_SLUG = "iim-indore-science-stream-2024";

export function isPublicArchive(slug: string | undefined | null) {
  return slug === PUBLIC_ARCHIVE_SLUG;
}
