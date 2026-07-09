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
  philes?: {
    volume: number;
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
      philes: {
        volume: 0,
        showEmpty: false
      }
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
