export type Role = "admin" | "manager" | "support";
export type Section =
  | "analytics"
  | "categories"
  | "products"
  | "orders"
  | "coupons"
  | "shipping"
  | "users";
export type Action = "view" | "create" | "update" | "delete";

const FULL: Action[] = ["view", "create", "update", "delete"];
const NO_DELETE: Action[] = ["view", "create", "update"];

// Mirrors the `authorize(...)` rules in the backend routes.
// This only controls what the UI shows — the backend is still the one enforcing access.
export const PERMISSIONS: Record<Role, Partial<Record<Section, Action[]>>> = {
  admin: {
    analytics: ["view"],
    categories: FULL,
    products: FULL,
    orders: ["view", "update"],
    coupons: FULL,
    shipping: FULL,
    users: ["view", "delete"],
  },
  manager: {
    categories: NO_DELETE,
    products: NO_DELETE,
    orders: ["view", "update"],
    coupons: NO_DELETE,
    shipping: NO_DELETE,
  },
  support: {
    orders: ["view"],
    users: ["view"],
  },
};

export const STAFF_ROLES: Role[] = ["admin", "manager", "support"];

// Order matters: the first section a role can view is its landing page.
const SECTIONS: Section[] = [
  "analytics",
  "orders",
  "products",
  "categories",
  "coupons",
  "shipping",
  "users",
];

export const isStaffRole = (role: unknown): role is Role => STAFF_ROLES.includes(role as Role);

export const isSection = (value: string): value is Section => SECTIONS.includes(value as Section);

export const can = (
  role: string | null | undefined,
  section: Section,
  action: Action = "view"
): boolean => {
  if (!isStaffRole(role)) return false;
  return PERMISSIONS[role][section]?.includes(action) ?? false;
};

// "/admin/orders/123" -> "orders"
export const getSectionFromPath = (pathname: string | null): string =>
  pathname?.split("/")[2] || "";

export const getHomePath = (role: string | null | undefined): string => {
  const first = SECTIONS.find((section) => can(role, section));
  return first ? `/admin/${first}` : "/";
};