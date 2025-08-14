'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import { Roles } from "../../../types/globals";
import { revalidatePath } from "next/cache";

export async function setRole(formData: FormData) {
    const { sessionClaims } = await auth();

    if (sessionClaims?.metadata?.role !== "admin") {
        throw new Error("Not authorized");
    }

    const id = formData.get("id") as string;
    const role = formData.get("role") as Roles;

    try {
        const clerk = await clerkClient(); // ✅ get the actual client

        await clerk.users.updateUser(id, {
            publicMetadata: { role },
        });

        revalidatePath("/admin");
    } catch (err) {
        console.error("Error setting role:", err);
        throw new Error("Failed to set role");
    }
}

export async function removeRole(formData: FormData) {
    const { sessionClaims } = await auth();

    if (sessionClaims?.metadata?.role !== "admin") {
        throw new Error("Not authorized");
    }

    const id = formData.get("id") as string;

    try {
        const clerk = await clerkClient(); // ✅ same fix here

        await clerk.users.updateUser(id, {
            publicMetadata: { role: null },
        });

        revalidatePath("/admin");
    } catch (err) {
        console.error("Error removing role:", err);
        throw new Error("Failed to remove role");
    }
}
