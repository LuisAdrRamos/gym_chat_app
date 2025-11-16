// src/presentation/hooks/useUserDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { User } from '@supabase/supabase-js';
// --- CORRECCIÓN: Eliminar { MediaType } ---
import * as ImagePicker from 'expo-image-picker';

// Entidades y Repositorios
import { TrainingPlan } from '../../domain/entities/TrainingPlan';
import { SupabaseTrainingPlanRepository } from '../../data/repositories/SupabaseTrainingPlanRepository';
import { GetPlansForUser } from '../../domain/usecases/GetPlansForUser';
import { Progress } from '../../domain/entities/Progress';
import { SupabaseProgressRepository } from '../../data/repositories/SupabaseProgressRepository';
import { SupabaseStorageRepository } from '../../data/repositories/SupabaseStorageRepository';

// Instancias
const planRepository = new SupabaseTrainingPlanRepository();
const getPlansForUserCase = new GetPlansForUser(planRepository);
const progressRepository = new SupabaseProgressRepository();
const storageRepository = new SupabaseStorageRepository();

export function useUserDashboard(user: User) {
    // ... (Estados sin cambios) ...
    const [userPlans, setUserPlans] = useState<TrainingPlan[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [progressList, setProgressList] = useState<Progress[]>([]);
    const [isLoadingProgress, setIsLoadingProgress] = useState(false);
    const [comment, setComment] = useState('');
    const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);

    // ... (fetchUserPlans y fetchProgress sin cambios) ...
    const fetchUserPlans = useCallback(async () => {
        if (user) {
            setIsLoadingPlans(true);
            try {
                const fetchedPlans = await getPlansForUserCase.execute(user.id);
                setUserPlans(fetchedPlans);
            } catch (error) {
                Alert.alert('Error', (error as Error).message);
            }
            setIsLoadingPlans(false);
        }
    }, [user]);

    const fetchProgress = useCallback(async () => {
        if (user) {
            setIsLoadingProgress(true);
            try {
                const progress = await progressRepository.findByUser(user.id);
                setProgressList(progress);
            } catch (error) {
                Alert.alert('Error', (error as Error).message);
            }
            setIsLoadingProgress(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUserPlans();
        fetchProgress();
    }, [fetchUserPlans, fetchProgress]);


    const handlePickImage = async () => {
        Alert.alert(
            "Seleccionar Foto",
            "¿Deseas tomar una foto nueva o elegir una de tu galería?",
            [
                { text: "Tomar Foto", onPress: () => launchCamera() },
                { text: "Elegir de Galería", onPress: () => launchGallery() },
                { text: "Cancelar", style: "cancel" },
            ]
        );
    };

    const launchCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.granted === false) {
            Alert.alert("Permiso denegado", "Se necesita acceso a la cámara.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            // --- CORRECCIÓN: 'images' en minúscula ---
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 0.7,
            aspect: [4, 3],
        });

        if (!result.canceled) {
            setImageAsset(result.assets[0]);
        }
    };

    const launchGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            Alert.alert("Permiso denegado", "Se necesita acceso a la galería.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            // --- CORRECCIÓN: 'images' en minúscula ---
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 0.7,
            aspect: [4, 3],
        });

        if (!result.canceled) {
            setImageAsset(result.assets[0]);
        }
    };

    // ... (handleSubmitProgress sin cambios) ...
    const handleSubmitProgress = async () => {
        if (!imageAsset || !comment) {
            Alert.alert("Error", "Por favor, añade una foto y un comentario.");
            return;
        }
        if (!user) return;

        setIsSubmittingProgress(true);
        try {
            const fileUri = imageAsset.uri;
            const contentType = imageAsset.mimeType || "image/jpeg";
            const fileExt = fileUri.split('.').pop();
            const filePath = `${user.id}/${new Date().toISOString()}.${fileExt}`;

            const { publicUrl } = await storageRepository.upload(
                'fotos_progreso',
                filePath,
                fileUri,
                contentType
            );

            const newProgress = await progressRepository.create({
                usuario_id: user.id,
                comentarios: comment,
                foto_url: publicUrl,
            });

            setProgressList([newProgress, ...progressList]);
            setComment('');
            setImageAsset(null);
            Alert.alert("Éxito", "¡Progreso guardado!");

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo guardar el progreso: " + (error as Error).message);
        } finally {
            setIsSubmittingProgress(false);
        }
    };

    return {
        userPlans,
        isLoadingPlans,
        progressList,
        isLoadingProgress,
        comment,
        setComment,
        imageAsset,
        isSubmittingProgress,
        handlePickImage,
        handleSubmitProgress,
    };
}