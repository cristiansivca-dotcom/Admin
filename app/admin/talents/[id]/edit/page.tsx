import { createClient } from "@/lib/supabase/server";
import TalentForm from "@/components/TalentForm";
import { updateTalent } from "../../add/actions";
import { redirect } from "next/navigation";

// Needed to pass ID to update action from the client component
async function updateAction(id: string, data: any) {
    "use server";
    return updateTalent(id, data);
}

export default async function EditTalentPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = params;

    const { data: talent, error } = await supabase
        .from("talents")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !talent) {
        redirect("/admin/talents");
    }

    // Wrap the update action to pre-fill the ID
    const handleUpdate = async (data: any) => {
        "use server";
        return updateTalent(id, data);
    };

    return <TalentForm initialData={talent} mode="edit" onSubmit={handleUpdate} />;
}
