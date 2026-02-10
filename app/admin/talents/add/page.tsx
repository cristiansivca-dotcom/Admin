"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Image as ImageIcon, CheckCircle2, AlertCircle, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { addTalent } from "./actions";

export default function AddTalentPage() {
    const [formData, setFormData] = useState({
        nombre: "",
        genero: "Dama",
        altura: "",
        experiencia: "",
        especialidad: "",
        descripcion: "",
        tags: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [files, setFiles] = useState<File[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);

    // Validation function
    const validateField = (name: string, value: string | File[]) => {
        let error = "";

        switch (name) {
            case "nombre":
                if (!value || (typeof value === "string" && value.trim().length < 3)) {
                    error = "El nombre debe tener al menos 3 caracteres";
                }
                break;
            case "altura":
                if (value && typeof value === "string" && !/^\d+(\.\d+)?\s*(m|cm)?$/i.test(value.trim())) {
                    error = "Formato inválido (ej: 1.75m o 175cm)";
                }
                break;
            case "files":
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        error = "Debes agregar al menos una foto";
                    }
                }
                break;
        }

        return error;
    };

    const handleBlur = (name: string) => {
        setTouched({ ...touched, [name]: true });
        const error = validateField(name, formData[name as keyof typeof formData]);
        setErrors({ ...errors, [name]: error });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        // Validate all fields
        const newErrors: Record<string, string> = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key as keyof typeof formData]);
            if (error) newErrors[key] = error;
        });
        // Validar archivos
        const filesError = validateField("files", files);
        if (filesError) newErrors["files"] = filesError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            setLoading(false);
            setStatus("error");
            return;
        }

        const dataToSend = {
            ...formData,
            fotosFiles: files,
            tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
        };

        try {
            const result = await addTalent(dataToSend);
            if (result.success) {
                setStatus("success");
                setServerError(null);
                setFormData({
                    nombre: "",
                    genero: "Dama",
                    altura: "",
                    experiencia: "",
                    especialidad: "",
                    descripcion: "",
                    fotos: [""],
                    tags: ""
                });
                setTouched({});
                setErrors({});
            } else {
                console.error("addTalent error:", result.error);
                setServerError(result.error ?? "Error desconocido en el servidor");
                setStatus("error");
            }
        } catch (error: any) {
            console.error(error);
            setServerError(error?.message ?? String(error));
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al Panel
                    </Link>
                    <h1 className="text-4xl font-black tracking-tighter text-gradient leading-tight">Registrar Nuevo Talento</h1>
                    <p className="text-gray-400 mt-1 font-medium italic">Expande el alcance de la agencia SIVCA.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass p-10 rounded-[2.5rem] border border-white/5 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <UserPlus size={180} />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                                <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                Perfil Identitario
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Nombre Artístico / Completo</label>
                                    <Input
                                        required
                                        value={formData.nombre}
                                        onChange={e => {
                                            setFormData({ ...formData, nombre: e.target.value });
                                            if (touched.nombre) {
                                                const error = validateField("nombre", e.target.value);
                                                setErrors({ ...errors, nombre: error });
                                            }
                                        }}
                                        onBlur={() => handleBlur("nombre")}
                                        placeholder="Ej. Isabella Rodríguez"
                                        className={cn(
                                            "bg-white/[0.03] border-white/5 focus:bg-white/[0.07] transition-all",
                                            touched.nombre && errors.nombre && "border-red-500/50 bg-red-500/5",
                                            touched.nombre && !errors.nombre && formData.nombre && "border-green-500/50 bg-green-500/5"
                                        )}
                                    />
                                    <AnimatePresence>
                                        {touched.nombre && errors.nombre && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                                            >
                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                {errors.nombre}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Género</label>
                                        <select
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all appearance-none font-medium"
                                            value={formData.genero}
                                            onChange={e => setFormData({ ...formData, genero: e.target.value })}
                                        >
                                            <option value="Dama">Dama</option>
                                            <option value="Caballero">Caballero</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Estatura</label>
                                        <Input
                                            value={formData.altura}
                                            onChange={e => {
                                                setFormData({ ...formData, altura: e.target.value });
                                                if (touched.altura) {
                                                    const error = validateField("altura", e.target.value);
                                                    setErrors({ ...errors, altura: error });
                                                }
                                            }}
                                            onBlur={() => handleBlur("altura")}
                                            placeholder="1.78 m"
                                            className={cn(
                                                "bg-white/[0.03] border-white/5 text-center",
                                                touched.altura && errors.altura && "border-red-500/50 bg-red-500/5",
                                                touched.altura && !errors.altura && formData.altura && "border-green-500/50 bg-green-500/5"
                                            )}
                                        />
                                        <AnimatePresence>
                                            {touched.altura && errors.altura && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5" />
                                                    {errors.altura}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Descripción de Trayectoria</label>
                                <textarea
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all min-h-[160px] resize-none font-medium leading-relaxed"
                                    value={formData.descripcion}
                                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder="Describe la experiencia, estudios y aptitudes del talento..."
                                />
                            </div>
                        </div>
                    </section>

                    <section className="glass p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                        <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                            Expertise y Tags
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Especialidad Principal</label>
                                <Input
                                    value={formData.especialidad}
                                    onChange={e => setFormData({ ...formData, especialidad: e.target.value })}
                                    placeholder="Ej. Pasarela / Fotografía"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Etiquetas (Separar por coma)</label>
                                <Input
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="Fashion, TV, Eventos"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6 sticky top-28">
                        <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                            Visual Center
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Subir Fotos</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={e => {
                                        const selected = Array.from(e.target.files || []);
                                        setFiles(selected);
                                    }}
                                    className="w-full text-xs text-white/80"
                                />
                                {files.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                        {files.map((f, i) => (
                                            <img key={i} src={URL.createObjectURL(f)} alt={f.name} className="w-12 h-16 object-cover rounded-lg" />
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Solo input de archivos y previews */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Subir Fotos</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={e => {
                                        const selected = Array.from(e.target.files || []);
                                        setFiles(selected);
                                        if (touched.files) {
                                            const error = validateField("files", selected);
                                            setErrors({ ...errors, files: error });
                                        }
                                    }}
                                    className="w-full text-xs text-white/80"
                                />
                                <AnimatePresence>
                                    {touched.files && errors.files && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                                        >
                                            <AlertTriangle className="w-3.5 h-3.5" />
                                            {errors.files}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {files.length > 0 && (
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {files.map((f, i) => (
                                            <img key={i} src={URL.createObjectURL(f)} alt={f.name} className="w-12 h-16 object-cover rounded-lg" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <Button
                                type="submit"
                                className="w-full py-5 text-sm font-black uppercase tracking-widest"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Procesando...
                                    </div>
                                ) : "Confirmar Registro"}
                            </Button>

                            <AnimatePresence>
                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={cn(
                                            "p-4 rounded-2xl flex flex-col gap-3 border",
                                            status === "success"
                                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                : "bg-red-500/10 text-red-500 border-red-500/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            {status === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                                            <span className="text-[10px] font-black uppercase tracking-tight">
                                                {status === "success" ? "Base de datos actualizada correctamente" : "Error crítico en el enlace de datos"}
                                            </span>
                                        </div>
                                        {serverError && (
                                            <div className="text-[10px] font-medium text-red-300 bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10">
                                                {serverError}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
}

// Icon helper
function UserPlus(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
    );
}
