// lib/middleware/checkPermission.ts
import { getUserById } from "../getUser";
import { getRoleById } from "../getRole";

export function checkPermission(module: string, action: string) {
  return async function (req: any) {
    if (!req.user || !req.user.id) return false;

    const user = await getUserById(req.user.id);
    if (!user) return false;

    // FIX → Firestore uses "roleId"
    const role = await getRoleById(user.roleId);
    if (!role) return false;

    const allowed = role.permissions?.[module]?.[action] === true;
    return allowed;
  };
}
