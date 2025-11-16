// src/presentation/styles/authStyles.ts
import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    link: {
        marginTop: 15,
        textAlign: 'center',
        color: '#007AFF', // Usé el color del botón de rol para consistencia
    },
    // --- Estilos específicos de Register ---
    roleLabel: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    roleButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    roleButtonSelected: {
        backgroundColor: '#007AFF',
    },
    roleText: {
        color: '#007AFF',
    },
    roleTextSelected: {
        color: '#fff',
    },
});