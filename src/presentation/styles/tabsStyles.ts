// src/presentation/styles/tabsStyles.ts
import { StyleSheet } from 'react-native';

export const tabsStyles = StyleSheet.create({
    // --- Estilos de app/(tabs)/index.tsx ---
    index_centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    index_container: { flex: 1, padding: 20 },
    index_title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    index_roleText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 20,
        color: 'gray',
    },
    index_contentBox: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    index_contentTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    index_divider: { height: 1, backgroundColor: '#ccc', marginVertical: 20 },

    // --- ESTILOS DE TARJETA DE RUTINA (ACTUALIZADOS) ---
    index_routineItemCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    index_routineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    index_routineInfo: {
        flex: 1, // Ocupa el espacio disponible
    },
    index_routineName: { fontWeight: 'bold', fontSize: 16 },
    index_routineButtons: {
        flexDirection: 'column',
        marginLeft: 10, // Separación
    },
    index_assignButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginBottom: 5, // Espacio entre botones
        alignItems: 'center', // Centrar texto
    },
    index_assignButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12, // Tamaño más pequeño
    },
    // --- (Fin de estilos actualizados) ---

    index_planItem: {
        backgroundColor: '#E6F7FF',
        padding: 12,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#B0E0FF',
    },
    index_planName: { fontWeight: 'bold', fontSize: 16, color: '#005699' },

    // --- Estilos de app/(tabs)/profile.tsx ---
    profile_container: { flex: 1, padding: 20, paddingTop: 40 },
    profile_title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    profile_info: { fontSize: 18, marginBottom: 10 },
    profile_buttonContainer: { marginTop: 30 },

    // --- Estilos de app/(tabs)/assign-plan.tsx ---
    assign_container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    assign_label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        color: '#333',
    },
    assign_routineName: {
        fontSize: 18,
        fontStyle: 'italic',
        color: 'gray',
        marginBottom: 10,
    },
    assign_pickerContainer: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    assign_picker: {
        height: 50,
        width: '100%',
    },

    // --- Estilos de TrainerDashboard ---
    index_videoLink: { // Este estilo ya no se usa, pero no hace daño
        color: 'green',
        fontStyle: 'italic',
        fontSize: 12,
        marginTop: 4,
    },
    index_videoUploading: {
        color: '#007AFF',
        fontStyle: 'italic',
        fontSize: 12,
        marginTop: 4,
    },
    index_videoPreview: {
        width: '100%', // Ocupa el ancho del contenedor
        height: 100,     // Altura fija
        marginTop: 8,
        borderRadius: 5,
        backgroundColor: '#000', // Fondo negro mientras carga
    },

    // --- Estilos de UserDashboard ---
    user_progressImagePreview: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginVertical: 10,
        alignSelf: 'center',
    },
    user_progressItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    user_progressImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10,
    },
    user_progressText: {
        flex: 1,
    },
    user_progressComment: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    user_progressDate: {
        fontSize: 12,
        color: 'gray',
        marginTop: 4,
    },
});