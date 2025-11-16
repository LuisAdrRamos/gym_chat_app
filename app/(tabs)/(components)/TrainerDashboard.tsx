// app/(tabs)/(components)/TrainerDashboard.tsx
import React from 'react';
import {
    View, Text, ActivityIndicator, TextInput, Button, FlatList,
} from 'react-native';
import { Link } from 'expo-router';
import { User } from '@supabase/supabase-js';
// --- CORRECCIÓN: Importar nuestro componente wrapper ---
import RoutineVideoPlayer from './RoutineVideoPlayer';

// Estilos
import { authStyles } from '../../../src/presentation/styles/authStyles';
import { tabsStyles } from '../../../src/presentation/styles/tabsStyles';

// Hook
import { useTrainerDashboard } from '../../../src/presentation/hooks/useTrainerDashboard';

interface TrainerDashboardProps {
    user: User;
}

export default function TrainerDashboard({ user }: TrainerDashboardProps) {
    const {
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
    } = useTrainerDashboard(user);

    return (
        <View style={tabsStyles.index_contentBox}>
            {/* ... (Formulario de Nueva Rutina sin cambios) ... */}
            <Text style={tabsStyles.index_contentTitle}>Crear Nueva Rutina</Text>
            <TextInput
                style={authStyles.input}
                placeholder="Nombre de la rutina"
                value={routineName}
                onChangeText={setRoutineName}
            />
            <TextInput
                style={[authStyles.input, { height: 80 }]}
                placeholder="Descripción (ej: Día de Pecho)"
                value={routineDesc}
                onChangeText={setRoutineDesc}
                multiline
            />
            <Button
                title={isSubmitting ? 'Creando...' : 'Crear Rutina'}
                onPress={handleCreateRoutine}
                disabled={isSubmitting || !routineName}
            />

            <View style={tabsStyles.index_divider} />

            {/* --- Lista de Rutinas Creadas --- */}
            <Text style={tabsStyles.index_contentTitle}>Mis Rutinas Creadas</Text>
            {isLoadingRoutines && <ActivityIndicator />}

            <FlatList
                data={routines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={tabsStyles.index_routineItemCard}>
                        <View style={tabsStyles.index_routineHeader}>
                            <View style={tabsStyles.index_routineInfo}>
                                <Text style={tabsStyles.index_routineName}>{item.nombre}</Text>
                                <Text>{item.descripcion}</Text>
                            </View>

                            <View style={tabsStyles.index_routineButtons}>
                                <Link
                                    href={{
                                        pathname: "/(tabs)/assign-plan",
                                        params: { routine_id: item.id, routine_name: item.nombre }
                                    }}
                                    style={tabsStyles.index_assignButton}
                                >
                                    <Text style={tabsStyles.index_assignButtonText}>Asignar</Text>
                                </Link>

                                <Button
                                    title={item.video_url ? "Cambiar Video" : "Subir Video"}
                                    onPress={() => handlePickAndUploadVideo(item)}
                                    disabled={uploadingId !== null}
                                    color={item.video_url ? "gray" : "#007AFF"}
                                />
                            </View>
                        </View>

                        {/* --- CORRECCIÓN: Usar nuestro componente wrapper --- */}
                        {item.video_url && (
                            <RoutineVideoPlayer uri={item.video_url} />
                        )}

                        {uploadingId === item.id && (
                            <Text style={tabsStyles.index_videoUploading}>Subiendo...</Text>
                        )}
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