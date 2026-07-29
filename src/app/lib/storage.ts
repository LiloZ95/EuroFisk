// localStorage throws (it does not just return null) when a browser blocks storage —
// Safari private mode, "block all cookies", some embedded webviews. Every read/write goes
// through here so a blocked jar degrades to "no saved preference" instead of a white screen.

export function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Preference simply will not persist across visits.
  }
}
