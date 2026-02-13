"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Sparkles, UserPlus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    nombre: string;
    created_at: string;
    read: boolean;
}

export default function HeaderNotifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        // Initial fetch of recent notifications (registrations)
        const fetchInitial = async () => {
            const { data } = await supabase
                .from("talents")
                .select("id, nombre, created_at")
                .order("created_at", { ascending: false })
                .limit(5);

            if (data) {
                const mapped = data.map(n => ({ ...n, read: true })) as Notification[];
                setNotifications(mapped);
            }
        };

        fetchInitial();

        // Listen for new registrations
        const channel = supabase
            .channel("header_notifications")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "talents",
                },
                (payload) => {
                    const newTalent = payload.new as Notification;
                    setNotifications(prev => [{ ...newTalent, read: false }, ...prev].slice(0, 10));
                    setUnreadCount(prev => prev + 1);
                }
            )
            .subscribe();

        // Click outside to close
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            supabase.removeChannel(channel);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [supabase]);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;
        return `${Math.floor(diffInHours / 24)}d`;
    };

    const handleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleOpen}
                className={cn(
                    "relative text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5",
                    isOpen && "bg-white/5 text-white"
                )}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050505] animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 glass border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-bold tracking-tight">Notificaciones</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "p-4 border-b border-white/5 flex gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer relative",
                                            !notification.read && "bg-blue-600/[0.03]"
                                        )}
                                    >
                                        {!notification.read && (
                                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        )}
                                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0 border border-blue-500/10">
                                            <UserPlus className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white truncate">Nuevo registro</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                <span className="text-blue-400">{notification.nombre}</span> se ha unido al catálogo.
                                            </p>
                                            <p className="text-[10px] text-gray-600 mt-1 font-mono">{formatTimeAgo(notification.created_at)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-gray-500">
                                    <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    <p className="text-xs italic">Nada nuevo por aquí</p>
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-3 text-center border-t border-white/5 bg-white/[0.02]">
                                <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-400 transition-colors">
                                    Ver todas las notificaciones
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
