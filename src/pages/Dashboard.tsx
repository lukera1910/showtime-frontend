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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-indigo-600 text-white py-4 shadow-md sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
                    <h1 className="text-2xl font-bold tracking-wide">ShowTime</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-indigo-800 hover:bg-indigo-700 text-sm px-4 py-2 rounded-md font-medium transition-all"
                    >
                        Sair
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-6xl mx-auto py-8 px-4">
                {/* Barra de busca */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                    <input
                        type="text"
                        placeholder="Buscar evento por nome..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                    >
                        Buscar
                    </button>
                </form>

                {/* Conteúdo */}
                {loading ? (
                    <p className="text-center text-gray-500">Carregando eventos...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : events.length === 0 ? (
                    <p className="text-center text-gray-500">Nenhum evento encontrado.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform hover:-translate-y-1"
                            >
                                <img
                                    src={`https://picsum.photos/800/400?random=${event.artist}`}
                                    alt={event.name}
                                    className="h-40 w-full object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {event.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{event.artist}</p>
                                    <div className="flex justify-between mt-3 text-sm text-gray-500">
                                        <span>{event.location}</span>
                                        <span className="text-indigo-600 font-medium">
                                            {new Date(event.date).toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};  

export default Dashboard;