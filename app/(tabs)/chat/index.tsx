// app/(tabs)/chat/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../../src/presentation/context/AuthContext';
// --- ¡NUEVA RUTA DE IMPORTACIÓN DE ESTILOS! ---
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
            if (!currentUser) return;
            try {
                const allUsers = await getAllUsersCase.execute();
                const otherUsers = allUsers.filter(u => u.id !== currentUser.id);
                setUsers(otherUsers);
            } catch (error) {
                Alert.alert("Error", "No se pudo cargar la lista de usuarios.");
            }
            setLoading(false);
        };
        fetchUsers();
    }, [currentUser]);

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
                            // La ruta ahora es relativa, solo '[receiver_id]'
                            pathname: `./${item.id}`,
                            params: { receiver_name: item.username || item.full_name || 'Usuario' }
                        }}
                        asChild
                    >
                        <Pressable style={chatStyles.chat_listItem}>
                            <Text style={chatStyles.chat_listName}>
                                {item.username || item.full_name || 'Usuario sin nombre'}
                            </Text>
                            <Text style={chatStyles.chat_listRole}>(Rol: {item.role})</Text>
                        </Pressable>
                    </Link>
                )}
                ListEmptyComponent={<Text>No se encontraron otros usuarios.</Text>}
            />
        </View>
    );
}