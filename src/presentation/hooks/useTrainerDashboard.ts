// src/presentation/hooks/useTrainerDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { User } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
import { Routine } from '../../domain/entities/Routine';

// Repositorios y Casos de Uso
import { SupabaseRoutineRepository } from '../../data/repositories/SupabaseRoutineRepository';
import { CreateRoutine } from '../../domain/usecases/CreateRoutine';
import { GetRoutinesByTrainer } from '../../domain/usecases/GetRoutinesByTrainer';
import { SupabaseStorageRepository } from '../../data/repositories/SupabaseStorageRepository';

// Instancias (Podríamos mover esto a un inyector de dependencias, pero está bien por ahora)
const routineRepository = new SupabaseRoutineRepository();
const createRoutineCase = new CreateRoutine(routineRepository);
const getRoutinesCase = new GetRoutinesByTrainer(routineRepository);
const storageRepository = new SupabaseStorageRepository();

export function useTrainerDashboard(user: User) {
    // Estados de UI
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [routineName, setRoutineName] = useState('');
    const [routineDesc, setRoutineDesc] = useState('');

    // Estados de carga
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingRoutines, setIsLoadingRoutines] = useState(false);
    const [uploadingId, setUploadingId] = useState<number | null>(null);

    // --- LÓGICA DE DATOS ---

    // Cargar rutinas
    const fetchRoutines = useCallback(async () => {
        if (user) {
            setIsLoadingRoutines(true);
            try {
                const fetchedRoutines = await getRoutinesCase.execute(user.id);
                setRoutines(fetchedRoutines);
            } catch (error) {
                Alert.alert('Error', (error as Error).message);
            }
            setIsLoadingRoutines(false);
        }
    }, [user]);

    // Efecto para cargar al inicio
    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    // Handler para crear rutina
    const handleCreateRoutine = async () => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            const newRoutine = await createRoutineCase.execute({
                nombre: routineName,
                descripcion: routineDesc,
                entrenador_id: user.id,
            });
            Alert.alert('Éxito', 'Rutina creada correctamente');
            setRoutines([newRoutine, ...routines]);
            setRoutineName('');
            setRoutineDesc('');
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        }
        setIsSubmitting(false);
    };

    // Handler para subir video
    const handlePickAndUploadVideo = async (routine: Routine) => {
        setUploadingId(routine.id);
        try {
            // 1. Permiso
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.granted === false) {
                Alert.alert("Permiso denegado", "Se necesita acceso a la galería.");
                setUploadingId(null);
                return;
            }

            // 2. Abrir selector
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 0.7,
            });

            if (result.canceled) {
                setUploadingId(null);
                return;
            }

            const asset = result.assets[0];
            const fileUri = asset.uri;
            const contentType = asset.mimeType || 'video/mp4';

            // 3. Subir
            const fileExt = fileUri.split('.').pop();
            const filePath = `${user.id}/${routine.id}.${fileExt}`;

            const { publicUrl } = await storageRepository.upload(
                'videos_ejercicios',
                filePath,
                fileUri,
                contentType
            );

            // 4. Actualizar DB
            const updatedRoutine = await routineRepository.updateVideoUrl(routine.id, publicUrl);

            // 5. Actualizar UI
            setRoutines(currentRoutines =>
                currentRoutines.map(r => (r.id === updatedRoutine.id ? updatedRoutine : r))
            );
            Alert.alert("Éxito", "Video subido y asociado a la rutina.");

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo subir el video: " + (error as Error).message);
        } finally {
            setUploadingId(null);
        }
    };

    // Devolvemos todo lo que la UI necesita
    return {
        routines,
        routineName,
        setRoutineName,
        routineDesc,
        setRoutineDesc,
        isSubmitting,
        isLoadingRoutines,
        uploadingId,
        handleCreateRoutine,
        handlePickAndUploadVideo,
    };
}