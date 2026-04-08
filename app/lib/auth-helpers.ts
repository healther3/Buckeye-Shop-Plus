import { Session } from 'next-auth';

/**
 * * @param session NextAuth Session object
 *  @param requiredPermission names of permission e.g. 'post:create', 'user:delete'
 *  @returns if the targeted permission can pass
 */
export function can(session: Session | null, requiredPermission: string): boolean {
    if (!session || !session.user) {
        return false;
    }

    const userPermissions = (session.user as { permissions?: string[] }).permissions;

    if (!userPermissions || userPermissions.length === 0) {
        return false;
    }

    return userPermissions.includes(requiredPermission);
}

