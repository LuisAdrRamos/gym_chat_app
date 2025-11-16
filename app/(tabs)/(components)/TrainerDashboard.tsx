// app/(tabs)/_components/TrainerDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ActivityIndicator, TextInput, Button, Alert, FlatList,
} from 'react-native';
import { Link } from 'expo-router';
import { User } from '@supabase/supabase-js';

// Estilos
import { authStyles } from '../../../src/presentation/styles/authStyles';
import { tabsStyles } from '../../../src/presentation/styles/tabsStyles';

// Entidades y Casos de Uso
import { Routine } from '../../../src/domain/entities/Routine';
import { SupabaseRoutineRepository } from '../../../src/data/repositories/SupabaseRoutineRepository';
import { CreateRoutine } from '../../../src/domain/usecases/CreateRoutine';
import { GetRoutinesByTrainer } from '../../../src/domain/usecases/GetRoutinesByTrainer';

// Instanciamos Repositorio y Casos de Uso
const routineRepository = new SupabaseRoutineRepository();
const createRoutineCase = new CreateRoutine(routineRepository);
const getRoutinesCase = new GetRoutinesByTrainer(routineRepository);

// Definimos los Props que recibirá (el usuario)
interface TrainerDashboardProps {
    user: User;
}

export default function TrainerDashboard({ user }: TrainerDashboardProps) {
    // --- Estados para el Entrenador ---
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [routineName, setRoutineName] = useState('');
    const [routineDesc, setRoutineDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingRoutines, setIsLoadingRoutines] = useState(false);

    // --- Lógica de Cargar Rutinas ---
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

    // Ejecutamos fetchRoutines cuando el componente carga
    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    // --- Lógica de Crear Rutina ---
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

    return (
        <View style={tabsStyles.index_contentBox}>
            {/* --- Formulario de Nueva Rutina --- */}
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
                    <View style={tabsStyles.index_routineItem}>
                        <View style={tabsStyles.index_routineInfo}>
                            <Text style={tabsStyles.index_routineName}>{item.nombre}</Text>
                            <Text>{item.descripcion}</Text>
                        </View>

                        <Link
                            href={{
                                pathname: '/(tabs)/assign-plan',
                                params: {
                                    routine_id: item.id,
                                    routine_name: item.nombre,
                                },
                            }}
                            style={tabsStyles.index_assignButton}
                        >
                            <Text style={tabsStyles.index_assignButtonText}>Asignar</Text>
                        </Link>
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