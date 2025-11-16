// app/(tabs)/(components)/TrainerDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ActivityIndicator, TextInput, Button, Alert, FlatList,
} from 'react-native';
import { Link } from 'expo-router';
import { User } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker'; // <-- Importar ImagePicker

// Estilos
import { authStyles } from '../../../src/presentation/styles/authStyles';
import { tabsStyles } from '../../../src/presentation/styles/tabsStyles';

// Entidades y Casos de Uso
import { Routine } from '../../../src/domain/entities/Routine';
import { SupabaseRoutineRepository } from '../../../src/data/repositories/SupabaseRoutineRepository';
import { CreateRoutine } from '../../../src/domain/usecases/CreateRoutine';
import { GetRoutinesByTrainer } from '../../../src/domain/usecases/GetRoutinesByTrainer';
// --- AÑADIR: Importar el Repositorio de Storage ---
import { SupabaseStorageRepository } from '../../../src/data/repositories/SupabaseStorageRepository';

// Instanciamos Repositorios y Casos de Uso
const routineRepository = new SupabaseRoutineRepository();
const createRoutineCase = new CreateRoutine(routineRepository);
const getRoutinesCase = new GetRoutinesByTrainer(routineRepository);
// --- AÑADIR: Instancia de Storage Repo ---
const storageRepository = new SupabaseStorageRepository();

interface TrainerDashboardProps {
    user: User;
}

export default function TrainerDashboard({ user }: TrainerDashboardProps) {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [routineName, setRoutineName] = useState('');
    const [routineDesc, setRoutineDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingRoutines, setIsLoadingRoutines] = useState(false);

    // --- AÑADIR: Estado para la subida de video ---
    const [uploadingId, setUploadingId] = useState<number | null>(null);

    // (Lógica de fetchRoutines... sin cambios)
    const fetchRoutines = useCallback(async () => {
        // ...
        if (user) {
            setIsLoadingRoutines(true);
            try {
                const fetchedRoutines = await getRoutinesCase.execute(user.id);
                setRoutines(fetchedRoutines);
            } catch (error) { Alert.alert('Error', (error as Error).message); }
            setIsLoadingRoutines(false);
        }
    }, [user]);

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    // (Lógica de handleCreateRoutine... sin cambios)
    const handleCreateRoutine = async () => {
        // ...
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
        } catch (error) { Alert.alert('Error', (error as Error).message); }
        setIsSubmitting(false);
    };

    // --- AÑADIR: Lógica para Subir Video ---
    const handlePickAndUploadVideo = async (routine: Routine) => {
        setUploadingId(routine.id);

        try {
            // 1. Pedir permiso a la galería
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.granted === false) {
                Alert.alert("Permiso denegado", "Se necesita acceso a la galería para subir videos.");
                setUploadingId(null);
                return;
            }

            // 2. Abrir el selector de videos
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 0.7, // Comprimir un poco
            });

            if (result.canceled) {
                setUploadingId(null);
                return;
            }

            const asset = result.assets[0];
            const fileUri = asset.uri;
            const contentType = asset.mimeType || 'video/mp4'; // Fallback

            // 3. Crear una ruta única en el bucket
            const fileExt = fileUri.split('.').pop();
            const filePath = `${user.id}/${routine.id}.${fileExt}`;

            // 4. Subir el archivo
            const { publicUrl } = await storageRepository.upload(
                'videos_ejercicios',
                filePath,
                fileUri,
                contentType
            );

            // 5. Actualizar la rutina en la base de datos
            const updatedRoutine = await routineRepository.updateVideoUrl(routine.id, publicUrl);

            // 6. Actualizar el estado local
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


    return (
        <View style={tabsStyles.index_contentBox}>
            {/* (Formulario de Nueva Rutina... sin cambios) */}
            <Text style={tabsStyles.index_contentTitle}>Crear Nueva Rutina</Text>
            {/* ... TextInput, Button ... */}

            <View style={tabsStyles.index_divider} />

            {/* --- Lista de Rutinas Creadas (Con Cambios) --- */}
            <Text style={tabsStyles.index_contentTitle}>Mis Rutinas Creadas</Text>
            {isLoadingRoutines && <ActivityIndicator />}

            <FlatList
                data={routines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={tabsStyles.index_routineItem}>
                        <View style={tabsStyles.index_routineInfo}>
                            <Text style={tabsStyles.index_routineName}>{item.nombre}</Text>
                            <Text>{item.descripcion}</Text>

                            {/* --- MOSTRAR ESTADO DEL VIDEO --- */}
                            {item.video_url && (
                                <Text style={tabsStyles.index_videoLink}>(Video adjunto)</Text>
                            )}
                            {uploadingId === item.id && (
                                <Text style={tabsStyles.index_videoUploading}>Subiendo...</Text>
                            )}
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <Link
                                href={{
                                    pathname: "/(tabs)/assign-plan",
                                    params: { routine_id: item.id, routine_name: item.nombre }
                                }}
                                style={tabsStyles.index_assignButton}
                            >
                                <Text style={tabsStyles.index_assignButtonText}>Asignar</Text>
                            </Link>

                            {/* --- AÑADIR: Botón de Subir Video --- */}
                            <Button
                                title={item.video_url ? "Cambiar Video" : "Subir Video"}
                                onPress={() => handlePickAndUploadVideo(item)}
                                disabled={uploadingId !== null} // Deshabilitar todos si uno se está subiendo
                                color={item.video_url ? "gray" : "#007AFF"}
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    !isLoadingRoutines ? (
                        <Text>Aún no has creado ninguna rutina.</Text>
                    ) : null
                }
            />
        </View>
    );
}