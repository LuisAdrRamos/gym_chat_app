// src/presentation/hooks/useTrainerDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { User } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
// Quitamos la importación de MediaType que no se usa
import { Routine } from '../../domain/entities/Routine';

// Repositorios y Casos de Uso
import { SupabaseRoutineRepository } from '../../data/repositories/SupabaseRoutineRepository';
import { CreateRoutine } from '../../domain/usecases/CreateRoutine';
import { GetRoutinesByTrainer } from '../../domain/usecases/GetRoutinesByTrainer';
import { SupabaseStorageRepository } from '../../data/repositories/SupabaseStorageRepository';

// Instancias
const routineRepository = new SupabaseRoutineRepository();
const createRoutineCase = new CreateRoutine(routineRepository);
const getRoutinesCase = new GetRoutinesByTrainer(routineRepository);
const storageRepository = new SupabaseStorageRepository();

export function useTrainerDashboard(user: User) {
    // ... (Estados sin cambios) ...
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [routineName, setRoutineName] = useState('');
    const [routineDesc, setRoutineDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingRoutines, setIsLoadingRoutines] = useState(false);
    const [uploadingId, setUploadingId] = useState<number | null>(null);

    // ... (fetchRoutines y handleCreateRoutine sin cambios) ...
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

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

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

    const handlePickAndUploadVideo = async (routine: Routine) => {
        Alert.alert(
            "Seleccionar Video",
            "¿Deseas grabar un video nuevo o elegir uno de tu galería?",
            [
                { text: "Grabar Video", onPress: () => launchVideoCamera(routine) },
                { text: "Elegir de Galería", onPress: () => launchVideoGallery(routine) },
                { text: "Cancelar", style: "cancel", onPress: () => setUploadingId(null) },
            ]
        );
    };

    const launchVideoCamera = async (routine: Routine) => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.granted === false) {
            Alert.alert("Permiso denegado", "Se necesita acceso a la cámara.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            // --- CORRECCIÓN: 'videos' en minúscula ---
            mediaTypes: 'videos',
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            await uploadVideo(result.assets[0], routine);
        }
    };

    const launchVideoGallery = async (routine: Routine) => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            Alert.alert("Permiso denegado", "Se necesita acceso a la galería.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            // --- CORRECCIÓN: 'videos' en minúscula ---
            mediaTypes: 'videos',
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            await uploadVideo(result.assets[0], routine);
        }
    };

    const uploadVideo = async (asset: ImagePicker.ImagePickerAsset, routine: Routine) => {
        setUploadingId(routine.id);
        try {
            const fileUri = asset.uri;
            const contentType = asset.mimeType || 'video/mp4';
            const fileExt = fileUri.split('.').pop();
            const filePath = `${user.id}/${routine.id}.${fileExt}`;

            const { publicUrl } = await storageRepository.upload(
                'videos_ejercicios',
                filePath,
                fileUri,
                contentType
            );

            const updatedRoutine = await routineRepository.updateVideoUrl(routine.id, publicUrl);

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