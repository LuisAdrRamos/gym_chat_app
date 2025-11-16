// src/data/repositories/SupabaseStorageRepository.ts
import { supabase } from "../../config/supabaseCliente";
import {
    IStorageRepository,
    UploadResult
} from "../../domain/repositories/IStorageRepository";

export class SupabaseStorageRepository implements IStorageRepository {

    async upload(
        bucket: string,
        filePath: string,
        fileUri: string,
        contentType: string
    ): Promise<UploadResult> {

        // FormData... (esto está bien)
        const formData = new FormData();
        const fileName = filePath.split('/').pop() || 'file';
        formData.append('file', {
            uri: fileUri,
            name: fileName,
            type: contentType,
        } as any);

        // 1. Subir el archivo (esto está bien)
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, formData, {
                upsert: true,
            });

        if (uploadError) {
            console.error("Error uploading file:", uploadError.message);
            throw new Error(`Error al subir el archivo: ${uploadError.message}`);
        }
        if (!uploadData) {
            throw new Error("No se recibió respuesta de Supabase Storage.");
        }

        // --- INICIO DE LA CORRECCIÓN ---

        // 2. Generar una URL firmada (Signed URL) para el archivo
        // Esta es la forma correcta de acceder a archivos en buckets PRIVADOS.
        // Damos una caducidad de 10 años (en segundos)
        const expiresIn = 60 * 60 * 24 * 365 * 10;

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(uploadData.path, expiresIn); // <-- CAMBIO AQUÍ

        if (signedUrlError) {
            console.error("Error creating signed URL:", signedUrlError.message);
            throw new Error(`Error al obtener la URL firmada: ${signedUrlError.message}`);
        }

        if (!signedUrlData) {
            throw new Error("No se pudo obtener la URL firmada.");
        }

        return {
            publicUrl: signedUrlData.signedUrl, // <-- Devolvemos la URL firmada
            path: uploadData.path,
        };

        // --- FIN DE LA CORRECCIÓN ---
    }
}