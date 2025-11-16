// src/domain/repositories/IStorageRepository.ts
export interface UploadResult {
    /**
     * La URL pública del archivo subido, lista para ser mostrada.
     */
    publicUrl: string;
    /**
     * La ruta interna o 'path' del archivo en el bucket (ej: 'user_id/video.mp4').
     * A veces es útil guardar esta ruta en la base de datos en lugar de la URL completa.
     */
    path: string;
}

export interface IStorageRepository {
    /**
     * Sube un archivo a un bucket específico.
     * @param bucket - El nombre del bucket (ej: 'videos_ejercicios').
     * @param filePath - La ruta única para el archivo dentro del bucket (ej: 'entrenador_id/video.mp4').
     * @param fileUri - La URI local del archivo en el dispositivo (ej: 'file:///...').
     * @param contentType - El tipo MIME del archivo (ej: 'video/mp4' o 'image/jpeg').
     */
    upload(
        bucket: string,
        filePath: string,
        fileUri: string,
        contentType: string
    ): Promise<UploadResult>;
}