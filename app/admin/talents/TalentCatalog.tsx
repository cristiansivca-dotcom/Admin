"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Filter } from "lucide-react";
import TalentCard from "@/components/TalentCard";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Talent {
    id: string;
    nombre: string;
    genero: string;
    altura: string;
    experiencia: string;
    especialidad: string;
    descripcion: string;
    fotos: string[];
    tags: string[];
    active: boolean;
}

interface TalentCatalogProps {
    initialTalents: Talent[];
}

export default function TalentCatalog({ initialTalents }: TalentCatalogProps) {
    const [filter, setFilter] = useState<"Todos" | "Dama" | "Caballero">("Todos");

    const filteredTalents = initialTalents.filter(talent => {
        if (filter === "Todos") return true;
        return talent.genero === filter;
    });

    const categories = ["Todos", "Dama", "Caballero"] as const;

    return (
        <div className="space-y-8">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Catálogo de Talentos</h1>
                    <p className="text-gray-400 mt-1">
                        {filteredTalents.length} talento{filteredTalents.length !== 1 ? "s" : ""} registrado{filteredTalents.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Filter Tabs */}
                    <div className="bg-white/5 p-1 rounded-xl flex items-center border border-white/10">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setFilter(category)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all relative",
                                    filter === category ? "text-white" : "text-gray-400 hover:text-white"
                                )}
                            >
                                {filter === category && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className="absolute inset-0 bg-white/10 rounded-lg"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">
                                    {category === "Todos" ? "Todos" : category === "Dama" ? "Damas" : "Caballeros"}
                                </span>
                            </button>
                        ))}
                    </div>

                    <Link href="/admin/talents/add">
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 group whitespace-nowrap">
                            <UserPlus className="w-5 h-5" />
                            Agregar Talento
                        </button>
                    </Link>
                </div>
            </div>

            {/* Talents Grid */}
            <AnimatePresence mode="popLayout">
                {filteredTalents.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredTalents.map((talent) => (
                            <motion.div
                                key={talent.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TalentCard talent={talent} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass rounded-2xl p-12 text-center border border-white/10"
                    >
                        <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No hay talentos en esta categoría</h3>
                        <p className="text-gray-400 mb-6">Intenta cambiar el filtro o agrega un nuevo talento.</p>
                        {filter !== "Todos" && (
                            <button
                                onClick={() => setFilter("Todos")}
                                className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
                            >
                                Ver todos los talentos
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
