// app/(tabs)/(components)/UserDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ActivityIndicator, Alert, FlatList, Button, TextInput, Image,
} from 'react-native';
import { User } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';

// Estilos
import { tabsStyles } from '../../../src/presentation/styles/tabsStyles';
import { authStyles } from '../../../src/presentation/styles/authStyles';

// Entidades y Casos de Uso (Planes)
import { TrainingPlan } from '../../../src/domain/entities/TrainingPlan';
import { SupabaseTrainingPlanRepository } from '../../../src/data/repositories/SupabaseTrainingPlanRepository';
import { GetPlansForUser } from '../../../src/domain/usecases/GetPlansForUser';

// Importaciones de Progreso y Storage
import { Progress } from '../../../src/domain/entities/Progress';
import { SupabaseProgressRepository } from '../../../src/data/repositories/SupabaseProgressRepository';
import { SupabaseStorageRepository } from '../../../src/data/repositories/SupabaseStorageRepository';

// Instancias (Planes)
const planRepository = new SupabaseTrainingPlanRepository();
const getPlansForUserCase = new GetPlansForUser(planRepository);

// Instancias (Progreso y Storage)
const progressRepository = new SupabaseProgressRepository();
const storageRepository = new SupabaseStorageRepository();

interface UserDashboardProps {
    user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
    // --- Estados de Planes ---
    const [userPlans, setUserPlans] = useState<TrainingPlan[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);

    // --- Estados de Progreso (CON CAMBIOS) ---
    const [progressList, setProgressList] = useState<Progress[]>([]);
    const [isLoadingProgress, setIsLoadingProgress] = useState(false);
    const [comment, setComment] = useState('');

    // --- CAMBIO: Guardamos el Asset completo, no solo la URI ---
    const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);

    // (Lógica de fetchUserPlans... sin cambios)
    const fetchUserPlans = useCallback(async () => {
        if (user) {
            setIsLoadingPlans(true);
            try {
                const fetchedPlans = await getPlansForUserCase.execute(user.id);
                setUserPlans(fetchedPlans);
            } catch (error) { Alert.alert('Error', (error as Error).message); }
            setIsLoadingPlans(false);
        }
    }, [user]);

    // (Lógica de fetchProgress... sin cambios)
    const fetchProgress = useCallback(async () => {
        if (user) {
            setIsLoadingProgress(true);
            try {
                const progress = await progressRepository.findByUser(user.id);
                setProgressList(progress);
            } catch (error) { Alert.alert('Error', (error as Error).message); }
            setIsLoadingProgress(false);
        }
    }, [user]);

    // (Efecto Principal... sin cambios)
    useEffect(() => {
        fetchUserPlans();
        fetchProgress();
    }, [fetchUserPlans, fetchProgress]);

    // --- Lógica para Seleccionar Imagen (CON CAMBIOS) ---
    const handlePickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            Alert.alert("Permiso denegado", "Se necesita acceso a la galería.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
            aspect: [4, 3],
        });

        if (!result.canceled) {
            // --- CAMBIO: Guardamos el asset completo ---
            setImageAsset(result.assets[0]);
        }
    };

    // --- Lógica para Subir Progreso (CON CAMBIOS) ---
    const handleSubmitProgress = async () => {
        // --- CAMBIO: Verificamos 'imageAsset' ---
        if (!imageAsset || !comment) {
            Alert.alert("Error", "Por favor, añade una foto y un comentario.");
            return;
        }
        if (!user) return;

        setIsSubmittingProgress(true);
        try {
            // 1. Subir la imagen al storage
            // --- CAMBIO: Usamos los datos del asset en estado ---
            const fileUri = imageAsset.uri;
            const contentType = imageAsset.mimeType || "image/jpeg"; // Usamos el mimeType real
            const fileExt = fileUri.split('.').pop();
            const filePath = `${user.id}/${new Date().toISOString()}.${fileExt}`;

            const { publicUrl } = await storageRepository.upload(
                'fotos_progreso',
                filePath,
                fileUri,
                contentType
            );

            // 2. Crear el registro en la base de datos
            const newProgress = await progressRepository.create({
                usuario_id: user.id,
                comentarios: comment,
                foto_url: publicUrl,
            });

            // 3. Actualizar la UI
            setProgressList([newProgress, ...progressList]);
            setComment('');
            // --- CAMBIO: Reseteamos el asset ---
            setImageAsset(null);
            Alert.alert("Éxito", "¡Progreso guardado!");

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo guardar el progreso: " + (error as Error).message);
        } finally {
            setIsSubmittingProgress(false);
        }
    };


    return (
        <View style={tabsStyles.index_contentBox}>
            {/* (Sección de Planes Asignados... sin cambios) */}
            <Text style={tabsStyles.index_contentTitle}>Mis Planes Asignados</Text>
            {/* ...FlatList de Planes... */}
            <View style={tabsStyles.index_divider} />

            {/* --- Sección de Progreso (CON CAMBIOS) --- */}
            <Text style={tabsStyles.index_contentTitle}>Mi Progreso</Text>

            {/* Formulario de Subida */}
            <TextInput
                style={authStyles.input}
                placeholder="Comentarios (ej: Semana 4, 80kg)"
                value={comment}
                onChangeText={setComment}
            />
            {/* --- CAMBIO: Título del botón --- */}
            <Button title={imageAsset ? "Foto seleccionada" : "Seleccionar Foto"} onPress={handlePickImage} />

            {/* --- CAMBIO: Leemos la URI del asset --- */}
            {imageAsset && (
                <Image source={{ uri: imageAsset.uri }} style={tabsStyles.user_progressImagePreview} />
            )}

            <Button
                title={isSubmittingProgress ? "Guardando..." : "Guardar Progreso"}
                onPress={handleSubmitProgress}
                disabled={isSubmittingProgress}
            />

            <View style={tabsStyles.index_divider} />

            {/* (Lista de Historial de Progreso... sin cambios) */}
            <FlatList
                data={progressList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={tabsStyles.user_progressItem}>
                        <Image source={{ uri: item.foto_url }} style={tabsStyles.user_progressImage} />
                        <View style={tabsStyles.user_progressText}>
                            <Text style={tabsStyles.user_progressComment}>{item.comentarios}</Text>
                            <Text style={tabsStyles.user_progressDate}>
                                {new Date(item.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text>Aún no has guardado fotos de tu progreso.</Text>}
            />
        </View>
    );
}