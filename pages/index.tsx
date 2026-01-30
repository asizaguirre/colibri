import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

type SerializedUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export async function getServerSideProps() {
  const users = await prisma.user.findMany();
  
  const serializedUsers = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }));

  return { props: { users: serializedUsers } };
}

export default function UsersPage({ users }: { users: SerializedUser[] }) {
  return (
    <main>
      <h1>Usuários cadastrados</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <a href={`/users/${u.id}`}>{u.email}</a>
          </li>
        ))}
      </ul>
      <a href="/users/create">Criar novo usuário</a>
    </main>
  );
}