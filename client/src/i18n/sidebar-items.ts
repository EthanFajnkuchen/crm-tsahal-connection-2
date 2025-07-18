import {
  House,
  Database,
  Shield,
  CalendarCheck,
  BriefcaseBusiness,
  PersonStanding,
  BookCopy,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  { displayName: "Dashboard", link: "/dashboard", icon: House },
  { displayName: "Data", link: "/data", icon: Database },
  {
    displayName: "Expert Connection",
    link: "/expert-connection",
    icon: Shield,
  },
  { displayName: "Mahzor Giyus", link: "/mahzor-giyus", icon: CalendarCheck },
  { displayName: "Tafkidim", link: "/tafkidim", icon: BriefcaseBusiness },
  { displayName: "Volontaires", link: "/volontaires", icon: PersonStanding },
  {
    displayName: "Forms & Rapports",
    link: "/forms-rapports",
    icon: BookCopy,
  },
];
