export type HomeItem = {
  label: string;
  href?: string;
  linkLabel?: string;
  external?: boolean;
  prefix?: string;
};

export type HomeSection = {
  title: string;
  items?: HomeItem[];
  volumes?: {
    include?: number[];
    exclude?: number[];
    sort?: "asc" | "desc";
    showEmpty?: boolean;
  };
};

export type SiteConfig = {
  name: string;
  description: string;
  homeAsciiArt: string;
  homeSections: HomeSection[];
};

export const siteConfig: SiteConfig = {
  name: "Coldhands",
  description: "Projects, notes, and experiments",
  homeAsciiArt: ` ▄████▄   ▒█████   ██▓    ▓█████▄  ██░ ██  ▄▄▄       ███▄    █ ▓█████▄   ██████
▒██▀ ▀█  ▒██▒  ██▒▓██▒    ▒██▀ ██▌▓██░ ██▒▒████▄     ██ ▀█   █ ▒██▀ ██▌▒██    ▒
▒▓█    ▄ ▒██░  ██▒▒██░    ░██   █▌▒██▀▀██░▒██  ▀█▄  ▓██  ▀█ ██▒░██   █▌░ ▓██▄
▒▓▓▄ ▄██▒▒██   ██░▒██░    ░▓█▄   ▌░▓█ ░██ ░██▄▄▄▄██ ▓██▒  ▐▌██▒░▓█▄   ▌  ▒   ██▒
▒ ▓███▀ ░░ ████▓▒░░██████▒░▒████▓ ░▓█▒░██▓ ▓█   ▓██▒▒██░   ▓██░░▒████▓ ▒██████▒▒
░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒░▓  ░ ▒▒▓  ▒  ▒ ░░▒░▒ ▒▒   ▓▒█░░ ▒░   ▒ ▒  ▒▒▓  ▒ ▒ ▒▓▒ ▒ ░
  ░  ▒     ░ ▒ ▒░ ░ ░ ▒  ░ ░ ▒  ▒  ▒ ░▒░ ░  ▒   ▒▒ ░░ ░░   ░ ▒░ ░ ▒  ▒ ░ ░▒  ░ ░
░        ░ ░ ░ ▒    ░ ░    ░ ░  ░  ░  ░░ ░  ░   ▒      ░   ░ ░  ░ ░  ░ ░  ░  ░
░ ░          ░ ░      ░  ░   ░     ░  ░  ░      ░  ░         ░    ░          ░
░                          ░                                    ░`,
  homeSections: [
    {
      title: "TL;DR",
      items: [
        {
          label: "Projects, ideas, and notes from things I build and use."
        },
        {
          label: "GitHub",
          linkLabel: "@coldhanded",
          href: "https://github.com/coldhanded",
          external: true
        }
      ]
    },
    {
      title: ".TXT",
      volumes: {
        include: [0, 1],
        sort: "asc",
        showEmpty: false
      }
    },
    {
      title: "Projects",
      items: [
        {
          label: "Nexus Homelab",
          href: "/volume/0/nexus-homelab/"
        },
        {
          label: "OpenWrt Router & SQM",
          href: "/volume/0/openwrt-router-sqm/"
        },
        {
          label: "De-Googled Pixel",
          href: "/volume/0/de-googled-pixel/"
        },
        {
          label: "Personal Knowledge Sync",
          href: "/volume/0/personal-knowledge-sync/"
        },
        {
          label: "Homelab Backup Strategy",
          href: "/volume/0/homelab-backup-strategy/"
        }
      ]
    },
    {
      title: "COMMS",
      items: [
        {
          label: "Email: sysop@coldhands.net",
          linkLabel: "sysop@coldhands.net",
          href: "mailto:sysop@coldhands.net"
        },
        {
          label: "Signal: message me",
          linkLabel: "message me",
          href: "https://signal.me/#eu/L5_uGA5ccCjNMzKJLvq9U9gULXRTojHS98lj-rMSG9CfsxoUERNJrpYOmgsFRaPe",
          external: true
        }
      ]
    }
  ]
};
