export type VolumePhileSort = {
  by: "date" | "order";
  direction: "asc" | "desc";
};

export type VolumeConfig = {
  title: string;
  subtitle?: string;
  listLabel: string;
  postscript?: string[];
  entryPrefix?: string;
  entryLabel?: "index" | "year";
  reverseEntryNumbers?: boolean;
  phileSort?: VolumePhileSort;
};

export const defaultVolumeConfig = (number: number): VolumeConfig => ({
  title: `Coldhands Volume ${number}`,
  listLabel: `Volume ${number}`,
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
