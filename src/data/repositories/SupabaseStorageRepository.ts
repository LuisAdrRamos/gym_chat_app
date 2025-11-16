// src/data/repositories/SupabaseStorageRepository.ts
import { supabase } from "../../config/supabaseCliente";
import {
    IStorageRepository,
    UploadResult
} from "../../domain/repositories/IStorageRepository";

export class SupabaseStorageRepository implements IStorageRepository {

    /**
     * Sube un archivo (video, imagen) a un bucket de Supabase.
     */
    async upload(
        bucket: string,
        filePath: string,
        fileUri: string,
        contentType: string
    ): Promise<UploadResult> {

        // FormData es la forma estándar de enviar archivos en React Native.
        const formData = new FormData();
        const fileName = filePath.split('/').pop() || 'file'; // Extrae 'video.mp4' de 'user_id/video.mp4'

        // Añadimos el archivo al formulario.
        // El 'as any' es necesario por diferencias de tipo entre RN y la web.
        formData.append('file', {
            uri: fileUri,
            name: fileName,
            type: contentType,
        } as any);

        // 1. Subir el archivo
        // Usamos 'upsert: true' para sobrescribir si ya existe un archivo con ese nombre.
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

        // 2. Obtener la URL pública del archivo recién subido
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(uploadData.path);

        if (!urlData) {
            throw new Error("No se pudo obtener la URL pública.");
        }

        return {
            publicUrl: urlData.publicUrl,
            path: uploadData.path, // Usaremos 'path' para guardar en la DB
        };
    }
}