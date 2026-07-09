import { volumeHref } from "../../config/volumes";
import type { PhileEntry, PhileRoute } from "./model";

const volumePathPattern = /^volume-(\d+)\/(.+?)(?:\.txt)?$/;

export function routeForPhile(entry: PhileEntry): PhileRoute {
  const match = entry.id.match(volumePathPattern);

  if (!match) {
    throw new Error(`Invalid phile path "${entry.id}". Expected content/philes/volume-<number>/**/*.txt.`);
  }

  const volume = Number(match[1]);
  const pathWithoutVolume = match[2];
  const basename = pathWithoutVolume.split("/").at(-1);
  const slug = entry.data.slug ?? basename?.toLowerCase();

  if (!slug) {
    throw new Error(`Unable to derive slug for "${entry.id}".`);
  }

  const parentHref = volumeHref(volume);

  return {
    volume,
    slug,
    href: `${parentHref}${slug}/`,
    volumeHref: parentHref,
    sourcePath: entry.id
  };
}
