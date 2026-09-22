import { useAuthStore } from "@/store/authStore";
import { Action, Section, can as canDo } from "@/lib/permissions";

export function usePermissions() {
  const role = useAuthStore((state) => state.user?.role as string | undefined);

  return {
    role,
    can: (section: Section, action: Action = "view") => canDo(role, section, action),
  };
}