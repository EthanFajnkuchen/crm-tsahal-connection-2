import {
  House,
  Database,
  Shield,
  CalendarCheck,
  BriefcaseBusiness,
  PersonStanding,
  BookCopy,
} from "lucide-react";
import { RoleType } from "@/types/role-types";

export const SIDEBAR_ITEMS = [
  {
    displayName: "Dashboard",
    link: "/dashboard",
    icon: House,
    roles: [RoleType.ADMINISTRATEUR, RoleType.VOLONTAIRE],
  },
  {
    displayName: "Data",
    link: "/data",
    icon: Database,
    roles: [RoleType.ADMINISTRATEUR],
  },
  {
    displayName: "Expert Connection",
    link: "/expert-connection",
    icon: Shield,
    roles: [RoleType.ADMINISTRATEUR],
  },
  {
    displayName: "Mahzor Giyus",
    link: "/mahzor-giyus",
    icon: CalendarCheck,
    roles: [RoleType.ADMINISTRATEUR, RoleType.VOLONTAIRE],
  },
  {
    displayName: "Tafkidim",
    link: "/tafkidim",
    icon: BriefcaseBusiness,
    roles: [RoleType.ADMINISTRATEUR],
  },
  {
    displayName: "Volontaires",
    link: "/volontaires",
    icon: PersonStanding,
    roles: [RoleType.VOLONTAIRE],
  },
  {
    displayName: "Forms & Rapports",
    link: "/forms-rapports",
    icon: BookCopy,
    roles: [RoleType.ADMINISTRATEUR],
  },
];
