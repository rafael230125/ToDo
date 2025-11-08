import { useState, useEffect, useLayoutEffect } from 'react';
import { 
  Text, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  View, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform 
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';
import { updateUserPhoto } from '../../services/firebaseService';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';
import { createStyles } from './styles';

export default function Galeria({ navigation }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { colors, shadows, spacing, isDarkTheme } = useTheme();
  const { showError, showWarning } = useToast();
  const styles = createStyles(colors, shadows, spacing);

  // Configurar header dinamicamente baseado no tema
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Minha Galeria',
      headerStyle: {
        backgroundColor: colors.surface,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        color: colors.text,
        fontWeight: '600',
        fontSize: 20,
        ...Platform.select({
          android: {
            includeFontPadding: false,
          },
        }),
      },
    });
  }, [navigation, colors, isDarkTheme]);

  // Verificar permissão ao montar o componente
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        loadAlbums();
      } else {
        requestPermission();
      }
    } catch (error) {
      requestPermission();
    }
  };

  const requestPermission = async () => {
    try {
      // Solicitar permissão usando requestPermissionsAsync diretamente
      // Isso permite mais controle sobre quais permissões solicitar
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === 'granted') {
        setHasPermission(true);
        loadAlbums();
      } else {
        showWarning('A permissão para acessar a galeria é obrigatória para selecionar uma foto de perfil.');
        setLoading(false);
      }
    } catch (error) {
      showError('Não foi possível solicitar permissão para acessar a galeria.');
      setLoading(false);
    }
  };

  const loadAlbums = async () => {
    if (!hasPermission) {
      return;
    }

    try {
      setLoading(true);

      // Buscar apenas álbuns de fotos
      const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });
      
      // Filtrar apenas álbuns com imagens
      const albumsWithImages = fetchedAlbums.filter(album => album.assetCount > 0);
      setAlbums(albumsWithImages);
    } catch (error) {
      showError('Não foi possível carregar os álbuns da galeria.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando galeria...
          </Text>
        </View>
      ) : albums.length > 0 ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {albums.map((album) => (
            <AlbumEntry 
              key={album.id} 
              album={album} 
              navigation={navigation}
              colors={colors}
              shadows={shadows}
              spacing={spacing}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="photo-library" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Nenhum álbum encontrado
          </Text>
          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: colors.primary, ...shadows.button }]}
            onPress={loadAlbums}
            activeOpacity={0.8}
          >
            <MaterialIcons name="refresh" size={20} color={colors.textInverse} />
            <Text style={[styles.refreshButtonText, { color: colors.textInverse }]}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

function AlbumEntry({ album, navigation, colors, shadows, spacing }) {
  const [assets, setAssets] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();
  const styles = createStyles(colors, shadows, spacing);

  useEffect(() => {
    const getAlbumAssets = async () => {
      try {
        setLoadingAssets(true);
        const albumAssets = await MediaLibrary.getAssetsAsync({ 
          album,
          first: 50, // Limitar a 50 imagens por álbum para performance
          mediaType: MediaLibrary.MediaType.photo,
        });
        setAssets(albumAssets.assets);
      } catch (error) {
        // Erro silencioso ao carregar imagens do álbum
      } finally {
        setLoadingAssets(false);
      }
    };
    getAlbumAssets();
  }, [album]);

  const handleImageSelect = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const handleSaveAndNavigate = async () => {
    if (!selectedImage) {
      showWarning('Por favor, selecione uma imagem antes de salvar.');
      return;
    }

    try {
      // Converter imagem para Base64
      const base64Image = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await updateUserPhoto(base64Image);

      showSuccess('Foto de perfil atualizada com sucesso!');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      showError('Não foi possível salvar a imagem. Tente novamente.');
    }
  };

  if (assets.length === 0 && !loadingAssets) {
    return null; // Não renderizar álbuns vazios
  }

  return (
    <View style={styles.albumContainer}>
      <View style={styles.albumHeader}>
        <MaterialIcons name="folder" size={20} color={colors.primary} />
        <Text style={[styles.albumTitle, { color: colors.text }]}>
          {album.title}
        </Text>
        <Text style={[styles.albumCount, { color: colors.textSecondary }]}>
          ({album.assetCount || 0})
        </Text>
      </View>
      
      {loadingAssets ? (
        <View style={styles.loadingAssetsContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.albumAssetsContainer}>
          {assets.map((asset) => (
            <TouchableOpacity
              key={asset.id}
              onPress={() => handleImageSelect(asset.uri)}
              style={[
                styles.imageContainer,
                selectedImage === asset.uri && [styles.selectedImage, { borderColor: colors.primary }],
              ]}
              activeOpacity={0.8}
            >
              <Image source={{ uri: asset.uri }} style={styles.image} />
              {selectedImage === asset.uri && (
                <View style={[styles.selectedOverlay, { backgroundColor: `${colors.primary}80` }]}>
                  <MaterialIcons name="check-circle" size={32} color={colors.textInverse} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {selectedImage && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary, ...shadows.button }]}
            onPress={handleSaveAndNavigate}
            activeOpacity={0.8}
          >
            <MaterialIcons name="check" size={20} color={colors.textInverse} />
            <Text style={[styles.saveButtonText, { color: colors.textInverse }]}>
              Salvar foto de perfil
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

