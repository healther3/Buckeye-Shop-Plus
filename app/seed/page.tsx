import { fetchUsers } from '../lib/data';

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.password}
          </li>
        ))}
      </ul>
    </div>
  );
}
