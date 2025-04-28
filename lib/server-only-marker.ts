// This file is used to mark modules as server-only
import "server-only"

// Export a marker function to make it clear when importing
export function markAsServerOnly() {
  // This function does nothing but makes imports more explicit
  if (typeof window !== "undefined") {
    throw new Error("This module can only be used on the server")
  }
}
