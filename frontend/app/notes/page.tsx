"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Nota = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type FormData = {
  title: string;
  content: string;
};

export default function NotasPage() {
  const router = useRouter();

  const [notas, setNotas] = useState<Nota[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estado do formulário de criação
  const [mostrarFormCriacao, setMostrarFormCriacao] = useState(false);
  const [novaNota, setNovaNotaForm] = useState<FormData>({ title: "", content: "" });

  // Estado de edição
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [notaEditada, setNotaEditada] = useState<FormData>({ title: "", content: "" });

  const [erro, setErro] = useState("");

  async function carregarNotas() {
    try {
      const { data } = await api.get<Nota[]>("/notes");
      setNotas(data);
    } catch {
      router.push("/login");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarNotas();
  }, []);

  async function handleCriar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    try {
      await api.post("/notes", novaNota);
      setNovaNotaForm({ title: "", content: "" });
      setMostrarFormCriacao(false);
      carregarNotas();
    } catch {
      setErro("Erro ao criar nota.");
    }
  }

  function iniciarEdicao(nota: Nota) {
    setEditandoId(nota.id);
    setNotaEditada({ title: nota.title, content: nota.content });
  }

  async function handleAtualizar(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setErro("");

    try {
      await api.put(`/notes/${id}`, notaEditada);
      setEditandoId(null);
      carregarNotas();
    } catch {
      setErro("Erro ao atualizar nota.");
    }
  }

  async function handleExcluir(id: string) {
    if (!confirm("Deseja excluir esta nota?")) return;

    await api.delete(`/notes/${id}`);
    carregarNotas();
  }

  async function handleLogout() {
    await api.post("/auth/logout");
    router.push("/login");
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">SmartNotes</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {erro && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
            {erro}
          </p>
        )}

        {/* Botão / Formulário de criação */}
        {mostrarFormCriacao ? (
          <form
            onSubmit={handleCriar}
            className="bg-white rounded-lg shadow p-4 space-y-3"
          >
            <h2 className="font-semibold text-gray-700">Nova Nota</h2>

            <input
              type="text"
              required
              placeholder="Título"
              value={novaNota.title}
              onChange={(e) => setNovaNotaForm({ ...novaNota, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              required
              placeholder="Conteúdo"
              rows={4}
              value={novaNota.content}
              onChange={(e) => setNovaNotaForm({ ...novaNota, content: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormCriacao(false)}
                className="text-gray-500 px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setMostrarFormCriacao(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Nova Nota
          </button>
        )}

        {/* Lista de notas */}
        {notas.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Nenhuma nota ainda.</p>
            <p className="text-sm mt-1">Clique em &quot;+ Nova Nota&quot; para começar.</p>
          </div>
        ) : (
          notas.map((nota) =>
            editandoId === nota.id ? (
              // Formulário de edição inline
              <form
                key={nota.id}
                onSubmit={(e) => handleAtualizar(e, nota.id)}
                className="bg-white rounded-lg shadow p-4 space-y-3"
              >
                <input
                  type="text"
                  required
                  value={notaEditada.title}
                  onChange={(e) =>
                    setNotaEditada({ ...notaEditada, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />

                <textarea
                  required
                  rows={4}
                  value={notaEditada.content}
                  onChange={(e) =>
                    setNotaEditada({ ...notaEditada, content: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditandoId(null)}
                    className="text-gray-500 px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              // Cartão da nota
              <div key={nota.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-800 truncate">
                      {nota.title}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
                      {nota.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(nota.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => iniciarEdicao(nota)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(nota.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </main>
    </div>
  );
}
