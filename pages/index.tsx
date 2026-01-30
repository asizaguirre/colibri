import { prisma } from "@/lib/prisma";

export async function getServerSideProps() {
  const users = await prisma.user.findMany();

  const serializedUsers = users.map((user: any) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }));

  return { props: { users: serializedUsers } }
}

export default function UsersPage({ users }: { users: any[] }) {
  return (
    <html>
      <body>
        <h1>Usuários</h1>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              <a href={`/users/${u.id}`}>{u.email}</a>
            </li>
          ))}
        </ul>
        <a href="/users/create">Criar novo</a>
      </body>
    </html>
  )
}