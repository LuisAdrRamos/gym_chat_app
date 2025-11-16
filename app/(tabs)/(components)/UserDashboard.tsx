// app/(tabs)/_components/UserDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ActivityIndicator, Alert, FlatList,
} from 'react-native';
import { User } from '@supabase/supabase-js';

// Estilos
import { tabsStyles } from '../../../src/presentation/styles/tabsStyles';

// Entidades y Casos de Uso
import { TrainingPlan } from '../../../src/domain/entities/TrainingPlan';
import { SupabaseTrainingPlanRepository } from '../../../src/data/repositories/SupabaseTrainingPlanRepository';
import { GetPlansForUser } from '../../../src/domain/usecases/GetPlansForUser';

// Instanciamos Repositorio y Casos de Uso
const planRepository = new SupabaseTrainingPlanRepository();
const getPlansForUserCase = new GetPlansForUser(planRepository);

// Definimos los Props
interface UserDashboardProps {
    user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
    // --- Estados para el Usuario ---
    const [userPlans, setUserPlans] = useState<TrainingPlan[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);

    // --- Lógica de Cargar Planes (Usuario) ---
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

    // --- Efecto Principal para cargar datos ---
    useEffect(() => {
        fetchUserPlans();
    }, [fetchUserPlans]);

    return (
        <View style={tabsStyles.index_contentBox}>
            <Text style={tabsStyles.index_contentTitle}>Mis Planes Asignados</Text>

            {/* --- Lista de Planes del Usuario --- */}
            {isLoadingPlans && <ActivityIndicator />}

            <FlatList
                data={userPlans}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={tabsStyles.index_planItem}>
                        <Text style={tabsStyles.index_planName}>{item.nombre}</Text>
                        <Text>Asignado por: (ID: ...{item.entrenador_id.slice(-6)})</Text>
                        <Text>Válido del {item.fecha_inicio} al {item.fecha_fin}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    !isLoadingPlans ? (
                        <Text>Aún no tienes planes asignados.</Text>
                    ) : null
                }
            />
        </View>
    );
}