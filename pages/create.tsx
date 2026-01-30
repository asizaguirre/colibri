export default function CreateUser() {
  return (
    <html>
      <body>
        <h1>Criar Usuário</h1>
        <form method="POST" action="/api/users">
          <input name="email" placeholder="Email" />
          <input name="name" placeholder="Nome" />
          <button type="submit">Salvar</button>
        </form>
      </body>
    </html>
  )
}