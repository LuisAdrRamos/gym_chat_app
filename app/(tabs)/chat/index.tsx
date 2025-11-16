// app/(tabs)/chat/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../../src/presentation/context/AuthContext';
import { chatStyles } from '../../../src/presentation/styles/chatStyles';

// Reutilizamos el caso de uso que trae a todos los usuarios
import { UserProfile } from '../../../src/domain/entities/TrainingPlan';
import { SupabaseTrainingPlanRepository } from '../../../src/data/repositories/SupabaseTrainingPlanRepository';
import { GetAllUsers } from '../../../src/domain/usecases/GetAllUsers';

// Instancias
const planRepository = new SupabaseTrainingPlanRepository();
const getAllUsersCase = new GetAllUsers(planRepository);

export default function ChatListScreen() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!currentUser) {
                setLoading(false); // Detener loading si no hay usuario
                return;
            }
            try {
                const allUsers = await getAllUsersCase.execute();

                // Filtramos para no chatear con nosotros mismos
                const otherUsers = allUsers.filter(u => u.id !== currentUser.id);
                setUsers(otherUsers);

            } catch (error) {
                Alert.alert("Error de Chat", "No se pudo cargar la lista de usuarios. Revisa la política RLS de 'profiles'.");
            }
            setLoading(false);
        };
        fetchUsers();
    }, [currentUser]); // Depende del currentUser para asegurar que se ejecuta logueado

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
    }

    return (
        <View style={chatStyles.chat_listContainer}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Link
                        href={{
                            pathname: `./${item.id}`,
                            // Aseguramos que el nombre del usuario se pase correctamente
                            params: { receiver_name: item.username || item.full_name || item.id }
                        }}
                        asChild
                    >
                        <Pressable style={chatStyles.chat_listItem}>
                            <Text style={chatStyles.chat_listName}>
                                {item.username || item.full_name || `ID: ${item.id.slice(0, 8)}...`}
                            </Text>
                            <Text style={chatStyles.chat_listRole}>(Rol: {item.role})</Text>
                        </Pressable>
                    </Link>
                )}
                ListEmptyComponent={<Text style={{ padding: 20 }}>No se encontraron otros usuarios. Crea otra cuenta para chatear.</Text>}
            />
        </View>
    );
}