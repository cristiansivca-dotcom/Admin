"use client";

import { motion } from "framer-motion";
import { User, Tag, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

interface TalentCardProps {
    talent: Talent;
}

export default function TalentCard({ talent }: TalentCardProps) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const photos = talent.fotos && talent.fotos.length > 0 ? talent.fotos : ["/placeholder-avatar.png"];

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all group"
        >
            {/* Photo Gallery */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-blue-600/10 to-indigo-600/10 overflow-hidden">
                <Image
                    src={photos[currentPhotoIndex]}
                    alt={talent.nombre}
                    fill
                    className="object-cover"
                />

                {/* Photo Navigation */}
                {photos.length > 1 && (
                    <>
                        <button
                            onClick={prevPhoto}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={nextPhoto}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Photo Indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {photos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPhotoIndex(index)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentPhotoIndex
                                        ? "bg-white w-4"
                                        : "bg-white/50 hover:bg-white/75"
                                        }`}
                                />
                            ))}
                        </div>

                    </>
                )}
            </div>

            {/* Edit Button (Top Right Absolute) */}
            <Link
                href={`/admin/talents/${talent.id}/edit`}
                className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/80 hover:text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                title="Editar Talento"
            >
                <Edit className="w-4 h-4" />
            </Link>

            {/* Content */}
            <div className="p-5 space-y-3">
                {/* Name & Gender */}
                <div>
                    <h3 className="text-xl font-bold tracking-tight">{talent.nombre}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <User className="w-4 h-4" />
                        <span>{talent.genero}</span>
                        {talent.altura && (
                            <>
                                <span>•</span>
                                <span>{talent.altura}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Specialty & Experience */}
                <div className="flex gap-2 flex-wrap">
                    {talent.especialidad && (
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium border border-blue-500/20">
                            {talent.especialidad}
                        </span>
                    )}
                    {talent.experiencia && (
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-medium border border-indigo-500/20">
                            {talent.experiencia}
                        </span>
                    )}
                </div>

                {/* Description */}
                {talent.descripcion && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                        {talent.descripcion}
                    </p>
                )}

                {/* Tags */}
                {talent.tags && talent.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5">
                        <Tag className="w-3.5 h-3.5 text-gray-500" />
                        {talent.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                        {talent.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{talent.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </motion.div >
    );
}
