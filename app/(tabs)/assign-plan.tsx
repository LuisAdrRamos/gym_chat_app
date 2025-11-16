// app/(tabs)/assign-plan.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { Picker } from '@react-native-picker/picker';

// Estilos
import { authStyles } from '../../src/presentation/styles/authStyles';
import { tabsStyles } from '../../src/presentation/styles/tabsStyles'; // Añadiremos estilos aquí

// Entidades y Casos de Uso
import { UserProfile } from '../../src/domain/entities/TrainingPlan';
import { SupabaseTrainingPlanRepository } from '../../src/data/repositories/SupabaseTrainingPlanRepository';
import { GetAllUsers } from '../../src/domain/usecases/GetAllUsers';
import { AssignTrainingPlan } from '../../src/domain/usecases/AssignTrainingPlan';

// --- Instanciamos Repositorios y Casos de Uso ---
const planRepository = new SupabaseTrainingPlanRepository();
const getAllUsersCase = new GetAllUsers(planRepository);
const assignPlanCase = new AssignTrainingPlan(planRepository);
// ---

export default function AssignPlanScreen() {
    // 1. Obtener datos de la ruta y del usuario
    const { user: entrenador } = useAuth(); // Renombramos 'user' a 'entrenador'
    const router = useRouter();
    const { routine_id, routine_name } = useLocalSearchParams(); // Parámetros de la rutina

    // 2. Estados del formulario
    const [usersList, setUsersList] = useState<UserProfile[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [planName, setPlanName] = useState(`Plan: ${routine_name || ''}`);
    const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
    const [endDate, setEndDate] = useState('');     // YYYY-MM-DD

    const [loadingUsers, setLoadingUsers] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Cargar lista de usuarios al montar
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getAllUsersCase.execute();
                setUsersList(users);
                if (users.length > 0) {
                    setSelectedUserId(users[0].id); // Seleccionar el primero por defecto
                }
            } catch (error) {
                Alert.alert("Error", "No se pudo cargar la lista de usuarios.");
            }
            setLoadingUsers(false);
        };
        fetchUsers();
    }, []);

    // 4. Lógica de envío
    const handleAssignPlan = async () => {
        if (!entrenador || !selectedUserId || !routine_id || !planName || !startDate || !endDate) {
            Alert.alert("Error", "Por favor, complete todos los campos.");
            return;
        }

        setIsSubmitting(true);
        try {
            await assignPlanCase.execute({
                entrenador_id: entrenador.id,
                usuario_id: selectedUserId,
                nombre: planName,
                fecha_inicio: startDate,
                fecha_fin: endDate,
                // Nota: routine_id no está en la tabla 'planes_entrenamiento'
                // Lo que asignamos es el *plan*. 
                // Deberíamos asociar rutinas a un plan (tabla intermedia)
                // Por ahora, el nombre del plan incluye el nombre de la rutina.
            });

            Alert.alert("Éxito", `Plan "${planName}" asignado correctamente.`);
            router.back(); // Volver al dashboard

        } catch (error) {
            Alert.alert("Error", (error as Error).message);
        }
        setIsSubmitting(false);
    };

    if (loadingUsers) {
        return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
    }

    return (
        <ScrollView style={tabsStyles.assign_container}>
            <Text style={tabsStyles.assign_label}>Asignando Rutina:</Text>
            <Text style={tabsStyles.assign_routineName}>{routine_name}</Text>

            <Text style={tabsStyles.assign_label}>Nombre del Plan:</Text>
            <TextInput
                style={authStyles.input}
                value={planName}
                onChangeText={setPlanName}
                placeholder="Ej: Plan de Pecho 4 Semanas"
            />

            <Text style={tabsStyles.assign_label}>Asignar a Usuario:</Text>
            <View style={tabsStyles.assign_pickerContainer}>
                <Picker
                    selectedValue={selectedUserId}
                    onValueChange={(itemValue) => setSelectedUserId(itemValue)}
                    style={tabsStyles.assign_picker}
                >
                    {usersList.length === 0 ? (
                        <Picker.Item label="No hay usuarios para asignar" value="" enabled={false} />
                    ) : (
                        usersList.map((user) => (
                            <Picker.Item
                                key={user.id}
                                label={user.id}
                                value={user.id}
                            />
                        ))
                    )}
                </Picker>
            </View>

            <Text style={tabsStyles.assign_label}>Fecha de Inicio:</Text>
            <TextInput
                style={authStyles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                keyboardType="numeric"
            />

            <Text style={tabsStyles.assign_label}>Fecha de Fin:</Text>
            <TextInput
                style={authStyles.input}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                keyboardType="numeric"
            />

            <View style={{ marginTop: 20 }}>
                <Button
                    title={isSubmitting ? "Asignando..." : "Asignar Plan"}
                    onPress={handleAssignPlan}
                    disabled={isSubmitting || usersList.length === 0}
                />
            </View>
        </ScrollView>
    );
}