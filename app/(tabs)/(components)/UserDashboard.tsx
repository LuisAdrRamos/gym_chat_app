// app/(tabs)/(components)/UserDashboard.tsx
import React from 'react';
import {
    View, Text, ActivityIndicator, Alert, FlatList, Button, TextInput, Image,
} from 'react-native';
import { User } from '@supabase/supabase-js';

// Estilos
import { tabsStyles } from '../../../src/presentation/styles/tabsStyles';
import { authStyles } from '../../../src/presentation/styles/authStyles';

// --- 1. Importamos el nuevo hook de lógica ---
import { useUserDashboard } from '../../../src/presentation/hooks/useUserDashboard';

interface UserDashboardProps {
    user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
    // --- 2. Consumimos el hook ---
    const {
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
    } = useUserDashboard(user); // Le pasamos el 'user'

    // --- 3. El JSX se mantiene idéntico ---
    return (
        <View style={tabsStyles.index_contentBox}>
            {/* --- Sección de Planes Asignados --- */}
            <Text style={tabsStyles.index_contentTitle}>Mis Planes Asignados</Text>
            {isLoadingPlans ? <ActivityIndicator /> : (
                <FlatList
                    data={userPlans}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={tabsStyles.index_planItem}>
                            <Text style={tabsStyles.index_planName}>{item.nombre}</Text>
                            <Text>Válido del {item.fecha_inicio} al {item.fecha_fin}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text>Aún no tienes planes asignados.</Text>}
                />
            )}

            <View style={tabsStyles.index_divider} />

            {/* --- Sección de Progreso --- */}
            <Text style={tabsStyles.index_contentTitle}>Mi Progreso</Text>

            {/* Formulario de Subida */}
            <TextInput
                style={authStyles.input}
                placeholder="Comentarios (ej: Semana 4, 80kg)"
                value={comment}
                onChangeText={setComment}
            />
            <Button
                title={imageAsset ? "Foto seleccionada" : "Seleccionar Foto"}
                onPress={handlePickImage}
            />
            {imageAsset && (
                <Image
                    source={{ uri: imageAsset.uri }}
                    style={tabsStyles.user_progressImagePreview}
                />
            )}
            <Button
                title={isSubmittingProgress ? "Guardando..." : "Guardar Progreso"}
                onPress={handleSubmitProgress}
                disabled={isSubmittingProgress}
            />

            <View style={tabsStyles.index_divider} />

            {/* Lista de Historial de Progreso */}
            {isLoadingProgress ? <ActivityIndicator /> : (
                <FlatList
                    data={progressList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={tabsStyles.user_progressItem}>
                            <Image
                                source={{ uri: item.foto_url }}
                                style={tabsStyles.user_progressImage}
                            />
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
            )}
        </View>
    );
}