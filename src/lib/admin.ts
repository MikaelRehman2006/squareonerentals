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
export const ADMIN_EMAILS = ['volcanxic@gmail.com', 'ibadbbari@gmail.com', 'squareone.rental@gmail.com'];

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

export const isAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.some(adminEmail => email.toLowerCase() === adminEmail.toLowerCase());
};

export const getAdminRole = (email: string | null | undefined): AdminRole | null => {
  if (isOwner(email)) return 'OWNER';
  if (isAdmin(email)) return 'ADMIN';
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
