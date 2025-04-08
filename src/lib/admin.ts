export type AdminRole = 'OWNER' | 'ADMIN';

export interface AdminPermissions {
  canManageAdmins: boolean;
  canAccessSettings: boolean;
  canManageListings: boolean;
  canViewAnalytics: boolean;
  canModerateContent: boolean;
  canViewReports: boolean;
}

export const OWNER_EMAIL = 'mikaelr112@gmail.com';

export const rolePermissions: Record<AdminRole, AdminPermissions> = {
  OWNER: {
    canManageAdmins: true,
    canAccessSettings: true,
    canManageListings: true,
    canViewAnalytics: true,
    canModerateContent: true,
    canViewReports: true,
  },
  ADMIN: {
    canManageAdmins: false,
    canAccessSettings: false,
    canManageListings: true,
    canViewAnalytics: true,
    canModerateContent: true,
    canViewReports: true,
  },
};

export const isOwner = (email: string | null | undefined): boolean => {
  return email?.toLowerCase() === OWNER_EMAIL.toLowerCase();
};

export const getAdminRole = (email: string | null | undefined): AdminRole | null => {
  if (isOwner(email)) return 'OWNER';
  // This will be replaced with a database check for admin status
  return null;
};

export const hasPermission = (
  email: string | null | undefined,
  permission: keyof AdminPermissions
): boolean => {
  const role = getAdminRole(email);
  if (!role) return false;
  return rolePermissions[role][permission];
};
