// VideoTutorial.tsx
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { AppHeader } from '@presentation/components';
import { BottomBar } from '@/ui/BottomBar';
import { AntDesign } from '@expo/vector-icons';

interface Props {
  onBack?: () => void; // → volta para Home
  onGoHome?: () => void; // → vai para Home
  onOpenHistory?: () => void; // → abre histórico
}

const GOLD = '#b8860b';
const GRAY_BG = '#f3f4f6';
const TEXT = '#1f2937';

const VideoTutorial: React.FC<Props> = ({
  onBack,
  onGoHome,
  onOpenHistory,
}) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>(
    {} as AVPlaybackStatus
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const restartVideo = async () => {
    if (videoRef.current && status.isLoaded) {
      await videoRef.current.setPositionAsync(0);
      await videoRef.current.playAsync();
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current && status.isLoaded) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else if (status.didJustFinish) {
        // Se o vídeo terminou, reiniciar do início
        await restartVideo();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    setStatus(playbackStatus);
    if (playbackStatus.isLoaded) {
      setLoading(false);
      setError(false);
    } else if (playbackStatus.error) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header com 3 botões */}
      <AppHeader
        {...(onBack && { onBack })}
        {...(onGoHome && { onGoHome })}
        {...(onOpenHistory && { onOpenHistory })}
      />

      {/* Container do Player */}
      <View style={styles.playerContainer}>
        {/* Botão X para fechar pop-up */}
        <TouchableOpacity style={styles.closeBtn} onPress={onBack}>
          <AntDesign name="close" size={20} color={GOLD} />
        </TouchableOpacity>

        {error ? (
          <Text style={styles.errorText}>
            Não foi possível carregar o vídeo.
          </Text>
        ) : (
          <>
            <Video
              ref={videoRef}
              style={styles.video}
              source={require('../../../assets/INpunto_Video_V3.mp4')}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
              isLooping={false}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />

            {/* Estado carregando */}
            {loading && (
              <ActivityIndicator
                size="large"
                color={GOLD}
                style={styles.loading}
              />
            )}

            {/* Ícone Play/Pause */}
            <TouchableOpacity
              style={styles.playOverlay}
              onPress={togglePlayPause}
              activeOpacity={0.7}
            >
              <AntDesign
                name={
                  status.isLoaded && status.isPlaying
                    ? 'pausecircle'
                    : status.isLoaded && status.didJustFinish
                      ? 'reload1'
                      : 'play'
                }
                size={48}
                color="rgba(0,0,0,0.6)"
              />
            </TouchableOpacity>

            {/* Barra de progresso */}
            {status.isLoaded && status.durationMillis && (
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        flex:
                          (status.positionMillis || 0) / status.durationMillis,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.progressRest,
                      {
                        flex:
                          1 -
                          (status.positionMillis || 0) / status.durationMillis,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.floor((status.positionMillis || 0) / 1000 / 60)}:
                  {Math.floor(((status.positionMillis || 0) / 1000) % 60)
                    .toString()
                    .padStart(2, '0')}{' '}
                  /{Math.floor(status.durationMillis / 1000 / 60)}:
                  {Math.floor((status.durationMillis / 1000) % 60)
                    .toString()
                    .padStart(2, '0')}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      <BottomBar fixed />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  playerContainer: {
    margin: 40,
    marginBottom: 60,
    flex: 1,
    backgroundColor: GRAY_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    elevation: 3,
  },
  playOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 5,
  },
  loading: {
    position: 'absolute',
    alignSelf: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    right: 15,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: GOLD,
  },
  progressRest: {
    backgroundColor: '#d1d5db',
  },
  progressText: {
    color: TEXT,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
  errorText: {
    color: TEXT,
    fontWeight: '600',
  },
});

export default VideoTutorial;
