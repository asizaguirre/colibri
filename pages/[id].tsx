import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

type SerializedUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export async function getServerSideProps({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
  });

  if (!user) return { notFound: true };

  const serializedUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };

  return { props: { user: serializedUser } };
}

export default function UserPage({ user }: { user: SerializedUser }) {
  return (
    <main>
      <h1>Detalhes do Usuário</h1>
      <p>Email: {user.email}</p>
      <p>Nome: {user.name}</p>
      <p>Criado em: {user.createdAt}</p>

      <a href={`/users/${user.id}/edit`}>Editar</a> |{" "}
      <a href={`/users/${user.id}/delete`}>Excluir</a>
    </main>
  );
}