import { prisma } from "../lib/prisma";
import { User } from "@prisma/client";

type Props = {
  users: User[];
};

export async function getServerSideProps() {
  const users = await prisma.user.findMany();
  return { props: { users } };
}

export default function Home({ users }: Props) {
  // Agora o parâmetro user tem tipo User
  const serializedUsers = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }));

  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {serializedUsers.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
