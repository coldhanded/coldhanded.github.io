export type VolumePhileSort = {
  by: "date" | "order";
  direction: "asc" | "desc";
};

export type VolumeConfig = {
  title: string;
  subtitle?: string;
  listLabel: string;
  path: string;
  postscript?: string[];
  entryPrefix?: string;
  entryLabel?: "index" | "year";
  reverseEntryNumbers?: boolean;
  phileSort?: VolumePhileSort;
};

export const defaultVolumeConfig = (number: number): VolumeConfig => ({
  title: `Coldhands Volume ${number}`,
  listLabel: `Volume ${number}`,
  path: `volume/${number}`,
  phileSort: {
    by: "date",
    direction: "desc"
  },
  postscript: ["  --[ EOF ]----------------------------------------------------------//---"]
});

export const volumeConfigs = new Map<number, VolumeConfig>([
  [
    0,
    {
      title: "Projects",
      subtitle: "Builds, configurations, and experiments.",
      listLabel: "Projects",
      path: "projects",
      phileSort: {
        by: "order",
        direction: "asc"
      },
      entryPrefix: "P",
      postscript: ["  --[ END PROJECT ]--------------------------------------------------//---"]
    }
  ],
  [
    1,
    {
      title: "Notes",
      subtitle: "Ideas, guides, and observations.",
      listLabel: "Notes",
      path: "notes",
      phileSort: {
        by: "date",
        direction: "desc"
      },
      entryPrefix: "N",
      postscript: ["  --[ END NOTE ]-----------------------------------------------------//---"]
    }
  ]
]);

export function volumeConfig(number: number): VolumeConfig {
  return volumeConfigs.get(number) ?? defaultVolumeConfig(number);
}

export function volumePath(number: number): string {
  return volumeConfig(number).path;
}

export function volumeHref(number: number): string {
  return `/${volumePath(number)}/`;
}
