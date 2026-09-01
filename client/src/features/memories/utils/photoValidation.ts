const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface PhotoValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePhoto(
  file: File
): PhotoValidationResult {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  ) {
    return {
      valid: false,
      error:
        "Format non supporté. Utilisez JPG, PNG ou WebP.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error:
        "La photo ne doit pas dépasser 5 MB.",
    };
  }

  return {
    valid: true,
  };
}