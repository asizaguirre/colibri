import { useState, useEffect } from "react";

export async function getServerSideProps({ params }: { params: { id: string } }) {
  return { props: { params } };
}

export default function EditUser({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmail(data.email);
        setName(data.name || "");
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/users/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    window.location.href = `/users/${params.id}`;
  }

  return (
    <main>
      <h1>Editar Usuário</h1>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Salvar</button>
      </form>
    </main>
  );
}