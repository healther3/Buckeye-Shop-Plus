import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod' ;
import { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require' })


export async function getUser(identifier: string): Promise<User | undefined> {
    try{
        const users = await sql<User[]>`
            SELECT 
            id, 
            name, 
            email, 
            password, 
            create_date AS "createDate", 
            image_url AS "imageUrl"
            FROM users 
            WHERE email=${identifier} OR name=${identifier}
        `;

        const user = users[0];

        if (!user) {
            return undefined;
        }

        const userPermissions = await sql<{permission_name: string}[]>`
            SELECT 
                p.name AS permission_name
            FROM 
                users u
            JOIN 
                user_roles ur ON u.id = ur.user_id
            JOIN 
                role_permissions rp ON ur.role_id = rp.role_id
            JOIN 
                permissions p ON rp.permission_id = p.id
            WHERE 
                u.id = ${user.id}
        `;

        user.permissions = userPermissions.map(p => p.permission_name);

        console.log('Fetched user with permissions:', user.permissions);
        
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [Credentials({
        credentials: {
            identifier: { label: "Email or Username", type: "text" },
            password: {  label: "Password", type: "password" }  
        },
        async authorize(credentials) {
            const parsedCredentials = z
                .object({identifier: z.string(), password: z.string().min(6)})
                .safeParse(credentials);

            if(!parsedCredentials.success){
                console.log('Validation failed:', parsedCredentials.error);
                return null;
            } else {
                const { identifier, password } = parsedCredentials.data;
                const user = await getUser(identifier);
                if(!user) return null;
                const passwordMatch = await bcrypt.compare(password, user.password);
                if(passwordMatch) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createDate: user.createDate,
                        imageUrl: user.imageUrl,
                        permissions: user.permissions,
                    } as any;
                }
            }

            console.log('Invalid credentials');
            return null;
        },
    })],
    callbacks: {
        ...authConfig.callbacks, // Preserve the authorized callback
        async jwt({ token, user }) {
            if (user) {
                const authUser = user as unknown as User; 

                token.id = authUser.id;
                token.name = authUser.name;
                token.email = authUser.email;
                token.createDate = authUser.createDate;
                token.imageUrl = authUser.imageUrl;
                token.permissions = authUser.permissions;   
                console.log('JWT callback - permissions:', token.permissions); // 添加日志
                         
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.createDate = token.createDate as string;
                session.user.imageUrl = token.imageUrl as string; 
                session.user.permissions = token.permissions as string[];
                console.log('Session callback - permissions:', session.user.permissions); // 添加日志

            }
            return session;
        },
    },
});