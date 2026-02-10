"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Users, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        router.push("/admin");
      } else {
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-bold tracking-tight text-gradient">DashTalent</span>
          </motion.div>

          {/* Hero Text */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Gestiona tu Catálogo
            <br />
            <span className="text-gradient">de Talento</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Plataforma moderna para administrar y mostrar tu portafolio de talentos con estilo profesional
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-8 py-4 font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group">
                Iniciar Sesión
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/signup">
              <button className="w-full sm:w-auto glass border border-white/10 text-white rounded-xl px-8 py-4 font-medium hover:bg-white/5 transition-all">
                Crear Cuenta
              </button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <Users className="w-8 h-8 text-blue-500 mb-4 mx-auto" />
              <h3 className="font-bold mb-2">Gestión Completa</h3>
              <p className="text-sm text-gray-400">Administra perfiles de talento con facilidad</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <TrendingUp className="w-8 h-8 text-blue-500 mb-4 mx-auto" />
              <h3 className="font-bold mb-2">Dashboard Moderno</h3>
              <p className="text-sm text-gray-400">Interfaz intuitiva y profesional</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <Shield className="w-8 h-8 text-blue-500 mb-4 mx-auto" />
              <h3 className="font-bold mb-2">Seguro y Confiable</h3>
              <p className="text-sm text-gray-400">Autenticación con Supabase</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
