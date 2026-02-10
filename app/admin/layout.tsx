"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, UserPlus, LogOut, Search, Bell, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { logout } from "./actions";

interface NavItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    active: boolean;
}

const NavItem = ({ icon: Icon, label, href, active }: NavItemProps) => (
    <Link href={href}>
        <div
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group",
                active
                    ? "bg-blue-600/10 text-blue-500 border border-blue-500/10 shadow-lg shadow-blue-500/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
        >
            <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active && "animate-pulse")} />
            <span className="font-medium">{label}</span>
        </div>
    </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex bg-[#050505]">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 p-6 flex flex-col gap-8 glass hidden md:flex sticky top-0 h-screen">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/30">
                        D
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gradient">DashTalent</span>
                </div>

                <nav className="flex-1 flex flex-col gap-2">
                    <NavItem
                        icon={LayoutDashboard}
                        label="Resumen"
                        href="/admin"
                        active={pathname === "/admin"}
                    />
                    <NavItem
                        icon={Users}
                        label="Catálogo"
                        href="/admin/talents"
                        active={pathname === "/admin/talents"}
                    />
                    <NavItem
                        icon={UserPlus}
                        label="Agregar Talento"
                        href="/admin/talents/add"
                        active={pathname === "/admin/talents/add"}
                    />
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
                        >
                            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span className="font-medium">Cerrar Sesión</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between glass sticky top-0 z-30">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar talentos, etiquetas o estados..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-12 py-3 text-sm outline-none focus:border-blue-500/50 transition-all font-light"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050505]" />
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold tracking-tight">Admin Senior</p>
                                <p className="text-[10px] text-blue-500 font-mono uppercase tracking-widest">Master Auth</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 border border-white/10 shadow-lg p-0.5">
                                <div className="w-full h-full rounded-[14px] overflow-hidden bg-black/40 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white/50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
