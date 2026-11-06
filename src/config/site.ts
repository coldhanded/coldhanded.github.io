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
          label: "About",
          href: "/about/"
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
      title: "PROJ",
      philes: {
        volume: 0,
        showEmpty: false
      }
    },
    {
      title: "COMMS",
      items: [
        {
          label: "root@coldhands.net"
        },
        {
          label: "Email: cd /mail/",
          linkLabel: "cd /mail/",
          href: "mailto:sysop@coldhands.net"
        },
        {
          label: "Memo: cd /wall/",
          linkLabel: "cd /wall/",
          href: "https://wall.coldhands.net/",
          external: true
        }
      ]
    }
  ]
};
