export async function getServerSideProps({ params }: { params: { id: string } }) {
  return { props: { id: params.id } };
}

export default function DeleteUser({ id }: { id: string }) {
  async function handleDelete() {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    window.location.href = "/users";
  }

  return (
    <main>
      <h1>Excluir Usuário</h1>
      <p>Tem certeza que deseja excluir este usuário?</p>
      <button onClick={handleDelete}>Confirmar exclusão</button>
      <br />
      <a href={`/users/${id}`}>Cancelar</a>
    </main>
  );
}