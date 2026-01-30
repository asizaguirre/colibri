export async function getServerSideProps({ params }: { params: { id: string } }) {
  return { props: { params } };
}

export default function DeleteUser({ params }: { params: { id: string } }) {
  async function handleDelete() {
    await fetch(`/api/users/${params.id}`, { method: "DELETE" });
    window.location.href = "/users";
  }

  return (
    <main>
      <h1>Excluir Usuário</h1>
      <p>Tem certeza que deseja excluir este usuário?</p>
      <button onClick={handleDelete}>Confirmar exclusão</button>
      <a href={`/users/${params.id}`}>Cancelar</a>
    </main>
  );
}