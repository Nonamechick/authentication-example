'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import { Roles } from "../../../types/globals";
import { revalidatePath } from "next/cache"; // ensure this is imported

export async function setRole(formData: FormData) {
    const { sessionClaims } = await auth();

    if (sessionClaims?.metadata?.role !== "admin") {
        throw new Error("not authorized");
    }

    const id = formData.get("id") as string;
    const role = formData.get("role") as Roles;

    try {
        await clerkClient.users.updateUser(id, {
            publicMetadata: { role },
        });
        revalidatePath("/admin");
    } catch (err) {
        console.error("Error setting role:", err);
        throw new Error("failed to set role");
    }
}

export async function removeRole(formData: FormData) {
    const { sessionClaims } = await auth();

    if (sessionClaims?.metadata?.role !== "admin") {
        throw new Error("Not Authorized");
    }

    const id = formData.get("id") as string;

    try {
        await clerkClient.users.updateUser(id, {
            publicMetadata: { role: null },
        });
        revalidatePath("/admin");
    } catch (err) {
        console.error("Error removing role:", err);
        throw new Error("Failed to remove role");
    }
}
