import { createClient } from "@/lib/supabase/server";
import TalentCatalog from "./TalentCatalog";



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

    // Ensure talents is an array, even if null/undefined
    const safeTalents = (talents || []).map(t => ({
        ...t,
        // Ensure arrays are arrays in case Supabase returns null
        fotos: t.fotos || [],
        tags: t.tags || []
    }));

    return (
        <TalentCatalog initialTalents={safeTalents} />
    );
}
