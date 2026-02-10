import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import TalentCard from "@/components/TalentCard";

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

export default async function TalentsPage() {
    const supabase = await createClient();

    const { data: talents, error } = await supabase
        .from("talents")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching talents:", error);
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Catálogo de Talentos</h1>
                    <p className="text-gray-400 mt-1">
                        {talents?.length || 0} talento{talents?.length !== 1 ? "s" : ""} registrado{talents?.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link href="/admin/talents/add">
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 group">
                        <UserPlus className="w-5 h-5" />
                        Agregar Talento
                    </button>
                </Link>
            </div>

            {/* Talents Grid */}
            {talents && talents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {talents.map((talent) => (
                        <TalentCard key={talent.id} talent={talent as Talent} />
                    ))}
                </div>
            ) : (
                <div className="glass rounded-2xl p-12 text-center border border-white/10">
                    <UserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No hay talentos registrados</h3>
                    <p className="text-gray-400 mb-6">Comienza agregando tu primer talento al catálogo</p>
                    <Link href="/admin/talents/add">
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                            Agregar Primer Talento
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
