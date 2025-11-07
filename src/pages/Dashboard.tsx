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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // filtros
    const [name, setName] = useState("");
    const [artist, setArtist] = useState("");
    const [location, setLocation] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const navigate = useNavigate();

    // buscar eventos
    const fetchEvents = async (query = "") => {
        try {
            setLoading(true);
            const response = await api.get(`/events${query}`);
            setEvents(response.data.data || response.data); // suporta os dois formatos
        } catch {
            setError("Erro ao carregar eventos.");
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
    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (name) params.append("name", name);
        if (artist) params.append("artist", artist);
        if (location) params.append("location", location);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);

        fetchEvents(`?${params.toString()}`);
    };

    const handleReset = () => {
        setName("");
        setArtist("");
        setLocation("");
        setDateFrom("");
        setDateTo("");
        fetchEvents();
    }

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

            {/* Modal de detalhes */}
            {selectedEvent && (
                <div
                    onClick={() => setSelectedEvent(null)}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-fadeIn"
                    >
                        <img
                            src={`https://picsum.photos/800/400?random=${selectedEvent.id}`}
                            alt={selectedEvent.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {selectedEvent.name}
                            </h2>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Artista:</span> {selectedEvent.artist}
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Local:</span> {selectedEvent.location}
                            </p>
                            <p className="text-gray-600 mb-4">
                                <span className="font-semibold">Data:</span>{" "}
                                {new Date(selectedEvent.date).toLocaleDateString("pt-BR")}
                            </p>

                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main */}
            <main className="max-w-6xl mx-auto py-8 px-4">
                {/* Barra de busca */}
                <form
                    onSubmit={handleFilter}
                    className="bg-white rounded-lg shadow p-4 mb-8 flex flex-wrap gap-3 items-end"
                >
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Rock in Rio"
                            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-indigo-400 focus:border-indigo-400"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600">Artista</label>
                        <input
                            type="text"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            placeholder="Ex: Pitty"
                            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-indigo-400 focus:border-indigo-400"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600">Local</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Ex: São Paulo"
                            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-indigo-400 focus:border-indigo-400"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600">De</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-indigo-400 focus:border-indigo-400"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600">Até</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-indigo-400 focus:border-indigo-400"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all"
                        >
                            Filtrar
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-all"
                        >
                            Limpar
                        </button>
                    </div>
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
                                onClick={() => setSelectedEvent(event)}
                                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform hover:-translate-y-1 cursor-pointer"
                            >
                                <img
                                    src={`https://picsum.photos/800/400?random=${event.id}`}
                                    alt={event.name}
                                    className="h-40 w-full object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
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