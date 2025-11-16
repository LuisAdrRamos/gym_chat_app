// app/(tabs)/(components)/RoutineVideoPlayer.tsx
import React from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { tabsStyles } from '../../../src/presentation/styles/tabsStyles';

interface RoutineVideoPlayerProps {
    uri: string;
}

export default function RoutineVideoPlayer({ uri }: RoutineVideoPlayerProps) {
    // 1. Creamos la instancia del player
    const player = useVideoPlayer(uri, (player) => {
        player.loop = true;
        player.muted = true;
        player.play();
    });

    // 2. Usamos el componente VideoView
    return (
        <VideoView
            player={player}
            style={tabsStyles.index_videoPreview}
            contentFit="cover"
            allowsFullscreen={true}
        />
    );
}