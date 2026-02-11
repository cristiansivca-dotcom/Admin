"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

interface TalentForm {
    nombre: string;
    genero: string;
    altura: string;
    experiencia: string;
    especialidad: string;
    descripcion: string;
    rating: string; // Recibimos como string del formulario, convertimos a numero si es necesario
    fotosFiles?: File[];
    tags: string[];
}

export async function addTalent(formData: TalentForm) {
    // Prefer using the Service Role key on the server to bypass RLS for admin actions.
    // Ensure SUPABASE_SERVICE_ROLE_KEY is set in your server env (never expose it to the client).
    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
        ? createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        : await createClient();

    const uploadedUrls: string[] = [];

    // Solo subir archivos locales
    if (formData.fotosFiles && formData.fotosFiles.length > 0) {
        for (const file of formData.fotosFiles) {
            const ext = file.name.split(".").pop() ?? "jpg";
            const key = `talents/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("talent-photos")
                .upload(key, file, { cacheControl: "3600", upsert: false });

            if (uploadError) {
                console.error("Upload Error:", uploadError);
                return { success: false, error: uploadError.message };
            }

            // Get public URL (bucket must be public) — if bucket is private, use createSignedUrl instead
            const { data: publicData } = await supabase.storage.from("talent-photos").getPublicUrl(key);
            if (publicData && publicData.publicUrl) {
                uploadedUrls.push(publicData.publicUrl);
            }
        }
    }

    const fotosToStore = uploadedUrls;
    const mainPhoto = fotosToStore.length > 0 ? fotosToStore[0] : null;

    const { error } = await supabase.from("talents").insert([
        {
            nombre: formData.nombre,
            genero: formData.genero,
            altura: formData.altura,
            experiencia: formData.experiencia,
            especialidad: formData.especialidad,
            descripcion: formData.descripcion,
            rating: parseFloat(formData.rating) || 0,
            foto: mainPhoto,
            fotos: fotosToStore,
            tags: formData.tags,
            active: true,
        },
    ]);

    if (error) {
        console.error("Supabase Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/talents");
    return { success: true };
}

export async function updateTalent(id: string, formData: any) {
    const supabase = await createClient();

    const uploadedUrls: string[] = [];

    // 1. Upload new files if any
    if (formData.fotosFiles && formData.fotosFiles.length > 0) {
        for (const file of formData.fotosFiles) {
            const ext = file.name.split(".").pop() ?? "jpg";
            const key = `talents/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("talent-photos")
                .upload(key, file, { cacheControl: "3600", upsert: false });

            if (uploadError) {
                console.error("Upload Error:", uploadError);
                return { success: false, error: uploadError.message };
            }

            const { data: publicData } = await supabase.storage.from("talent-photos").getPublicUrl(key);
            if (publicData?.publicUrl) {
                uploadedUrls.push(publicData.publicUrl);
            }
        }
    }

    // 2. Combine existing photos + new photos
    // formData.existingPhotos should be an array of strings (URLs) sent from the client
    const existingPhotos = formData.existingPhotos || [];
    const finalPhotos = [...existingPhotos, ...uploadedUrls];
    const mainPhoto = finalPhotos.length > 0 ? finalPhotos[0] : null;

    // 3. Update database
    const { error } = await supabase
        .from("talents")
        .update({
            nombre: formData.nombre,
            genero: formData.genero,
            altura: formData.altura,
            experiencia: formData.experiencia,
            especialidad: formData.especialidad,
            descripcion: formData.descripcion,
            rating: parseFloat(formData.rating) || 0,
            foto: mainPhoto,
            fotos: finalPhotos,
            tags: formData.tags,
            // active: true // usually we don't reset active status on edit unless specified
        })
        .eq("id", id);

    if (error) {
        console.error("Update Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/talents");
    revalidatePath(`/admin/talents/${id}`);
    revalidatePath(`/admin/talents/${id}/edit`);

    return { success: true };
}
