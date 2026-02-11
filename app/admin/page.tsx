import { Users, UserCheck, Star, Clock, ArrowUpRight, LayoutDashboard, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const StatCard = ({ icon: Icon, label, value, color }: { icon: LucideIcon, label: string, value: string, color: string }) => (
    <div className="glass p-6 rounded-3xl border border-white/5 glass-hover group">
        <div className="flex items-center justify-between mb-4">
            <div className={cn(
                "p-3 rounded-2xl bg-opacity-10 border bg-current border-current",
                color === "blue" ? "text-blue-500" :
                    color === "green" ? "text-green-500" :
                        color === "yellow" ? "text-yellow-500" : "text-purple-500"
            )}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="p-1 rounded-full bg-white/5 text-gray-500 group-hover:bg-blue-500 group-hover:text-white transition-all cursor-pointer">
                <ArrowUpRight className="w-4 h-4" />
            </div>
        </div>
        <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</p>
            <h3 className="text-3xl font-black mt-1 text-gradient">{value}</h3>
        </div>
    </div>
);

export default function AdminDashboard() {
    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-gradient leading-tight">Métrica de Rendimiento</h1>
                    <p className="text-gray-400 mt-1 font-medium italic">Visión general del ecosistema de talentos SIVCA.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-1 rounded-2xl">
                    <button className="px-4 py-2 bg-blue-600 text-[10px] font-bold uppercase tracking-tighter rounded-xl shadow-lg shadow-blue-500/20 transition-all">Hoy</button>
                    <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-tighter text-gray-500 hover:text-white transition-all">Semana</button>
                    <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-tighter text-gray-500 hover:text-white transition-all">Mes</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Base de Datos" value="24" color="blue" />
                <StatCard icon={UserCheck} label="Disponibles" value="18" color="green" />
                <StatCard icon={Star} label="Perfil Elite" value="05" color="yellow" />
                <StatCard icon={Clock} label="Nuevas Altas" value="03" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass rounded-[2rem] p-8 border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black tracking-tight">Actividad en Tiempo Real</h2>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold animate-pulse">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            Sincronizado
                        </span>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition-colors group cursor-pointer">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center overflow-hidden">
                                    <Users className="w-6 h-6 text-gray-600 group-hover:text-blue-500/50 transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm tracking-tight group-hover:text-blue-400 transition-colors">Nuevo registro en Catálogo</h4>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Actualizado por sistema • Hace {i * 15} min</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-600 uppercase">Status</p>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase">Activo</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass rounded-[2rem] p-8 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-700">
                        <LayoutDashboard size={120} />
                    </div>
                    <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-2xl shadow-blue-500/5">
                        <Star className="w-10 h-10 text-blue-500 animate-slow-spin" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">Proyección de Crecimiento</h3>
                    <p className="text-sm text-gray-500 mt-3 max-w-[200px] leading-relaxed font-medium">
                        El sistema de inteligencia artificial está analizando las tendencias del catálogo.
                    </p>
                    <div className="mt-8 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
