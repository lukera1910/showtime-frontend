import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Event {
    id: number;
    name: string;
    location: string;
    date: string;
    artist: string;
}

const Dashboard = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // buscar eventos
    const fetchEvents = async (query = "") => {
        try {
            setLoading(true);
            const response = await api.get(`/events${query}`);
            setEvents(response.data.data || response.data); // suporta os dois formatos
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setError("Erro ao carregar eventos");
        } finally {
            setLoading(false);
        }
    };

    // checa login e busca eventos
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        fetchEvents();
    }, []);

    // filtro de busca
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchEvents(`?name=${search}`);
    };

    // logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
                <h1 className="text-xl font-bold">🎭 ShowTime — Painel de Eventos</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                    Sair
                </button>
            </header>

            {/* Barra de busca */}
            <div className="max-w-5xl mx-auto p-4">
                <form onSubmit={handleSearch} className="flex gap-3 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar evento por nome..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Buscar
                    </button>
                </form>

                {/* Lista */}
                {loading ? (
                    <p className="text-center text-gray-600">Carregando eventos...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : events.length === 0 ? (
                    <p className="text-center text-gray-500">Nenhum evento encontrado.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all"
                            >
                                <h2 className="text-lg font-semibold">{event.name}</h2>
                                <p className="text-gray-600 text-sm">{event.artist}</p>
                                <p className="text-gray-500 text-sm">{event.location}</p>
                                <p className="text-gray-400 text-sm">
                                    {new Date(event.date).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
  );
};  

export default Dashboard;