// app/(tabs)/index.tsx
import {
    View, Text, StyleSheet, ActivityIndicator, TextInput, Button, Alert, FlatList
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routine } from '../../src/domain/entities/Routine'; // Importamos la entidad

// --- Importaciones de Clean Architecture ---
import { SupabaseRoutineRepository } from '../../src/data/repositories/SupabaseRoutineRepository';
import { CreateRoutine } from '../../src/domain/usecases/CreateRoutine';
import { GetRoutinesByTrainer } from '../../src/domain/usecases/GetRoutinesByTrainer';
import { authStyles } from '../../src/presentation/styles/authStyles'; // Reutilizamos estilos

// --- Instanciamos Repositorio y Casos de Uso ---
// (En una app más grande, esto iría en un inyector de dependencias)
const routineRepository = new SupabaseRoutineRepository();
const createRoutineCase = new CreateRoutine(routineRepository);
const getRoutinesCase = new GetRoutinesByTrainer(routineRepository);
// ---

export default function DashboardScreen() {
    const { user, role, loading } = useAuth();

    // --- Estados para el Entrenador ---
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [routineName, setRoutineName] = useState('');
    const [routineDesc, setRoutineDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingRoutines, setIsLoadingRoutines] = useState(false);

    // --- Lógica de Cargar Rutinas ---
    const fetchRoutines = useCallback(async () => {
        if (user && role === 'Entrenador') {
            setIsLoadingRoutines(true);
            try {
                const fetchedRoutines = await getRoutinesCase.execute(user.id);
                setRoutines(fetchedRoutines);
            } catch (error) {
                Alert.alert("Error", (error as Error).message);
            }
            setIsLoadingRoutines(false);
        }
    }, [user, role]); // Depende de user y role

    // Ejecutamos fetchRoutines cuando el componente carga
    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]); // El hook useCallback asegura que fetchRoutines sea estable

    // --- Lógica de Crear Rutina ---
    const handleCreateRoutine = async () => {
        if (!user) return; // Guardia de seguridad

        setIsSubmitting(true);
        try {
            const newRoutine = await createRoutineCase.execute({
                nombre: routineName,
                descripcion: routineDesc,
                entrenador_id: user.id,
            });

            Alert.alert("Éxito", "Rutina creada correctamente");
            setRoutines([newRoutine, ...routines]); // Añadimos la nueva rutina al inicio de la lista
            setRoutineName('');
            setRoutineDesc('');

        } catch (error) {
            Alert.alert("Error", (error as Error).message);
        }
        setIsSubmitting(false);
    };

    // --- Renderizado ---

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Bienvenido, {user?.email}</Text>
            <Text style={styles.roleText}>(Rol: {role})</Text>

            {/* =========================================== */}
            {/* ============ VISTA DE ENTRENADOR ============ */}
            {/* =========================================== */}
            {role === 'Entrenador' && (
                <View style={styles.contentBox}>

                    {/* --- Formulario de Nueva Rutina --- */}
                    <Text style={styles.contentTitle}>Crear Nueva Rutina</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Nombre de la rutina"
                        value={routineName}
                        onChangeText={setRoutineName}
                    />
                    <TextInput
                        style={[authStyles.input, { height: 80 }]} // Más alto
                        placeholder="Descripción (ej: Día de Pecho)"
                        value={routineDesc}
                        onChangeText={setRoutineDesc}
                        multiline
                    />
                    <Button
                        title={isSubmitting ? "Creando..." : "Crear Rutina"}
                        onPress={handleCreateRoutine}
                        disabled={isSubmitting || !routineName}
                    />

                    <View style={styles.divider} />

                    {/* --- Lista de Rutinas Creadas --- */}
                    <Text style={styles.contentTitle}>Mis Rutinas Creadas</Text>
                    {isLoadingRoutines && <ActivityIndicator />}

                    <FlatList
                        data={routines}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.routineItem}>
                                <Text style={styles.routineName}>{item.nombre}</Text>
                                <Text>{item.descripcion}</Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            !isLoadingRoutines ? <Text>Aún no has creado ninguna rutina.</Text> : null
                        }
                    />
                </View>
            )}

            {/* =========================================== */}
            {/* ============= VISTA DE USUARIO ============= */}
            {/* =========================================== */}
            {role === 'Usuario' && (
                <View style={styles.contentBox}>
                    <Text style={styles.contentTitle}>Mis Rutinas Asignadas</Text>
                    <Text>Próximamente: Aquí verás tus rutinas asignadas por tu entrenador.</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

// (Estilos)
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    roleText: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', marginBottom: 20, color: 'gray' },
    contentBox: { flex: 1, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 10 },
    contentTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    divider: { height: 1, backgroundColor: '#ccc', marginVertical: 20 },
    routineItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    routineName: { fontWeight: 'bold', fontSize: 16 }
});