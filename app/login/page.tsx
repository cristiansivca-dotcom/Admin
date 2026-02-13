"use client";

import { useState } from "react";
import { login } from "./actions";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ email?: boolean; password?: boolean }>({});

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const newErrors: { email?: boolean; password?: boolean } = {};
        if (!email) newErrors.email = true;
        if (!password) newErrors.password = true;

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            // Reset errors after animation
            setTimeout(() => setFieldErrors({}), 500);
            return;
        }

        setLoading(true);
        setError(null);

        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
                    {/* Decorative background pulse */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />

                    {/* Logo */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-10 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-white/10"
                        >
                            <Sparkles className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="text-center">
                            <span className="text-3xl font-black tracking-tighter text-gradient block">DashTalent</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/80 mt-1 block">Administrative Portal</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                Identificación de Acceso
                            </label>
                            <motion.div
                                animate={fieldErrors.email ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="relative"
                            >
                                <Mail className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                    fieldErrors.email ? "text-red-500" : "text-gray-500"
                                )} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={cn(
                                        "w-full bg-white/[0.03] border rounded-2xl px-12 py-4 text-sm outline-none transition-all font-medium",
                                        fieldErrors.email
                                            ? "border-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                                            : "border-white/5 focus:border-blue-500/50 focus:bg-white/[0.07]"
                                    )}
                                    placeholder="admin@sivca.com"
                                />
                            </motion.div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                Clave de Seguridad
                            </label>
                            <motion.div
                                animate={fieldErrors.password ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="relative"
                            >
                                <Lock className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                    fieldErrors.password ? "text-red-500" : "text-gray-500"
                                )} />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className={cn(
                                        "w-full bg-white/[0.03] border rounded-2xl px-12 py-4 text-sm outline-none transition-all font-medium",
                                        fieldErrors.password
                                            ? "border-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                                            : "border-white/5 focus:border-blue-500/50 focus:bg-white/[0.07]"
                                    )}
                                    placeholder="••••••••"
                                />
                            </motion.div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-xs font-medium flex items-center gap-3"
                                >
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                "Iniciando..."
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center mt-6 text-gray-400 text-sm">
                        ¿No tienes cuenta?{" "}
                        <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
