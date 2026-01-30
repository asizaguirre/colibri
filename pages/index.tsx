import { prisma } from "../lib/prisma";
import { User } from "@prisma/client"; // importa o tipo gerado

// Tipo serializado (datas como string)
type SerializedUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

type Props = {
  users: SerializedUser[];
};

export async function getServerSideProps() {
  const users: User[] = await prisma.user.findMany();

  // Date objects não são serializáveis, então convertemos para string
  const serializedUsers: SerializedUser[] = users.map((user: User) => ({
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
