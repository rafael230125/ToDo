import { useState, useEffect } from 'react';
import { Button, Text, SafeAreaView, ScrollView, StyleSheet, Image, View, TouchableOpacity, Alert, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useRoute } from '@react-navigation/native';
import { updateUserPhoto } from '../services/firebaseService';

export default function Galeria({ navigation }) {
  const [albums, setAlbums] = useState([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    // Não precisa mais do uid dos parâmetros, usa o usuário logado
  }, []);

  // Atualiza os álbuns sempre que a permissão é concedida ou o botão é pressionado
  const getAlbums = async () => {
    if (!permissionResponse || permissionResponse.status !== 'granted') {
      const response = await requestPermission();
      if (response.status !== 'granted') {
        Alert.alert('Permissão necessária', 'A permissão para acessar a galeria é obrigatória.');
        return;
      }
    }

    // Busca os álbuns novamente
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={getAlbums} title="Carregar álbuns" />
      <ScrollView>
        {albums.length > 0 ? (
          albums.map((album) => (
            <AlbumEntry key={album.id} album={album} navigation={navigation} />
          ))
        ) : (
          <Text style={styles.noAlbumsText}>Nenhum álbum encontrado.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AlbumEntry({ album, navigation }) {
  const [assets, setAssets] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getAlbumAssets = async () => {
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      setAssets(albumAssets.assets);
    };
    getAlbumAssets();
  }, [album]);

  const handleImageSelect = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const handleSaveAndNavigate = async () => {
    if (!selectedImage) {
      Alert.alert('Atenção', 'Por favor, selecione uma imagem antes de salvar.');
      return;
    }

    try {
      // Converter imagem para Base64
      const base64Image = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await updateUserPhoto(base64Image);

      Alert.alert('Sucesso', 'Imagem salva com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      Alert.alert('Erro', 'Não foi possível salvar a imagem.');
    }
  };

  return (
    <View style={styles.albumContainer}>
      <Text>
        {album.title} - {album.assetCount ?? 'nenhum'} arquivos
      </Text>
      <View style={styles.albumAssetsContainer}>
        {assets.map((asset) => (
          <TouchableOpacity
            key={asset.id}
            onPress={() => handleImageSelect(asset.uri)}
            style={[
              styles.imageContainer,
              selectedImage === asset.uri && styles.selectedImage,
            ]}
          >
            <Image source={{ uri: asset.uri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
      {selectedImage && (
        <View style={styles.saveButtonContainer}>
          <Button title="Salvar imagem e voltar" onPress={handleSaveAndNavigate} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
  },
  albumAssetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageContainer: {
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  selectedImage: {
    borderColor: 'blue',
  },
  saveButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  noAlbumsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
    fontSize: 16,
  },
});
