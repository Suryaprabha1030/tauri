// Define an enum for icon keys
export enum IconKey {
  Positions = "positions",
  Holdings = "holdings",
  Orders = "orders",
  Funds = "funds",
  Strategies = "strategies",
  News = "news",
  Notes = "notes",
  Settings = "settings",
  FiiDii = "FiiDii",
  Portfolio = "Portfolio",
}

// Define the structure for each icon
interface Icon {
  src: string;
  label: string;
  width?: number;
  height?: number;
  design: string;
  clickSrc: string;
}

// Default icon size

// Icon configuration using the enum keys
export const icons: Record<IconKey, Icon> = {
  [IconKey.Positions]: {
    src: "/svg/Blackposition.svg",
    clickSrc: "/svg/positionrocket.svg",
    label: "Positions",
    width: 30,
    height: 40,
    design: `w-[1.8rem] rotate-45`,
  },
  [IconKey.Holdings]: {
    clickSrc: "/svg/holdingmoney.svg",
    src: "/svg/BlackHoldings.svg",
    label: "Holdings",
    width: 35,
    height: 40,
    design: `w-[2.1rem]`,
  },
  [IconKey.Portfolio]: {
    src: "/svg/portfolio.svg",
    clickSrc: "/svg/greenPortfolio.svg",
    label: "Portfolio",
    width: 30,
    height: 40,
    design: `w-[1.5rem]`,
  },
  [IconKey.Orders]: {
    clickSrc: "/svg/ordersicon.svg",
    src: "/svg/BlackOrder.svg",
    label: "Orders",
    width: 80,
    height: 100,
    design: `h-[2rem] w-[3rem]`,
  },
  [IconKey.Funds]: {
    clickSrc: "/svg/rupee.svg",
    src: "/svg/BlackRupee.svg",
    label: "Funds",
    width: 45,
    height: 40,
    design: `w-[1.5rem]`,
  },
  [IconKey.Strategies]: {
    clickSrc: "/svg/strategy-icon.svg",
    src: "/svg/BlackStrategy.svg",
    label: "Hedged ",
    width: 50,
    height: 50,
    design: `w-[1.5rem]`,
  },
  [IconKey.News]: {
    clickSrc: "/svg/news.svg",
    src: "/svg/BlackNews.svg",
    label: "All News",
    width: 50,
    height: 50,
    design: `w-[1.5rem] max-sm:hidden`,
  },
  [IconKey.Notes]: {
    clickSrc: "/svg/allNotes.svg",
    src: "/svg/BlackNotes.svg",
    label: "All Notes",
    width: 50,
    height: 50,
    design: `w-[1.5rem]  max-sm:hidden `,
  },
  [IconKey.FiiDii]: {
    clickSrc: "/svg/FiiDii.svg",
    src: "/svg/blackFiiDii.svg",
    label: "FII/DII",
    width: 50,
    height: 75,
    design: `w-[2rem]`,
  },
  [IconKey.Settings]: {
    clickSrc: "/svg/infoGreen.svg",
    src: "/svg/info.svg",
    label: "Info",
    width: 50,
    height: 50,
    design: `w-[1.5rem]`,
  },
};
