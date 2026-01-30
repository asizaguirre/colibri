import { prisma } from "../lib/prisma";
import { User } from "@prisma/client"; // importa o tipo gerado

type Props = {
  users: User[];
};

export async function getServerSideProps() {
  const users = await prisma.user.findMany();

  // Date objects are not serializable, so we convert them to strings.
  const serializedUsers = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }));

  return { props: { users: serializedUsers } };
}

export default function Home({ users }: Props) {
  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
