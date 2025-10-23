import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { X, Camera as CameraIcon, RotateCw, Image as ImageIcon } from 'lucide-react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Photo {
  uri: string;
  date: string;
  timestamp: number;
}

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showGallery, setShowGallery] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const loadPhotos = async () => {
    try {
      const storedPhotos = await AsyncStorage.getItem('progress_photos');
      if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const savePhoto = async (newPhotos: Photo[]) => {
    try {
      await AsyncStorage.setItem('progress_photos', JSON.stringify(newPhotos));
    } catch (error) {
      console.error('Error saving photos:', error);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

        if (photo) {
          const compressedPhoto = await ImageManipulator.manipulateAsync(
            photo.uri,
            [{ resize: { width: 1080 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );

          const now = new Date();
          const newPhoto: Photo = {
            uri: compressedPhoto.uri,
            date: now.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            timestamp: now.getTime(),
          };

          const updatedPhotos = [newPhoto, ...photos];
          setPhotos(updatedPhotos);
          await savePhoto(updatedPhotos);

          if (Platform.OS !== 'web') {
            const Haptics = require('expo-haptics');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const deletePhoto = async (timestamp: number) => {
    const updatedPhotos = photos.filter(p => p.timestamp !== timestamp);
    setPhotos(updatedPhotos);
    await savePhoto(updatedPhotos);
    setSelectedPhoto(null);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const groupPhotosByDate = () => {
    const grouped: { [key: string]: Photo[] } = {};
    photos.forEach(photo => {
      if (!grouped[photo.date]) {
        grouped[photo.date] = [];
      }
      grouped[photo.date].push(photo);
    });
    return grouped;
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <CameraIcon size={64} color="#a855f7" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to access the camera
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (selectedPhoto) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedPhoto.uri }} style={styles.fullscreenImage} />
        <View style={styles.photoViewHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPhoto(null)}
          >
            <X size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.photoDate}>{selectedPhoto.date}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Delete Photo',
                'Are you sure you want to delete this photo?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deletePhoto(selectedPhoto.timestamp),
                  },
                ]
              );
            }}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showGallery) {
    const groupedPhotos = groupPhotosByDate();
    const dates = Object.keys(groupedPhotos).sort((a, b) => {
      const photoA = groupedPhotos[a][0];
      const photoB = groupedPhotos[b][0];
      return photoB.timestamp - photoA.timestamp;
    });

    return (
      <View style={styles.container}>
        <View style={styles.galleryHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowGallery(false)}
          >
            <X size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.galleryTitle}>Progress Gallery</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.galleryContainer}>
          {dates.length === 0 ? (
            <View style={styles.emptyGallery}>
              <ImageIcon size={64} color="#6b7280" />
              <Text style={styles.emptyGalleryText}>No photos yet</Text>
              <Text style={styles.emptyGallerySubtext}>
                Take your first progress photo!
              </Text>
            </View>
          ) : (
            dates.map(date => (
              <View key={date} style={styles.dateSection}>
                <Text style={styles.dateHeader}>{date}</Text>
                <View style={styles.photoGrid}>
                  {groupedPhotos[date].map(photo => (
                    <TouchableOpacity
                      key={photo.timestamp}
                      style={styles.photoThumbnail}
                      onPress={() => setSelectedPhoto(photo)}
                    >
                      <Image source={{ uri: photo.uri }} style={styles.thumbnailImage} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.cameraHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.cameraTitle}>Progress Photo</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.galleryIconButton}
            onPress={() => {
              loadPhotos();
              setShowGallery(true);
            }}
          >
            <ImageIcon size={32} color="#ffffff" />
            {photos.length > 0 && (
              <View style={styles.photoBadge}>
                <Text style={styles.photoBadgeText}>{photos.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <RotateCw size={32} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#000000',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#a855f7',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  backButtonText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffffff',
  },
  flipButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 28,
  },
  galleryIconButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 28,
  },
  photoBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#a855f7',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  photoBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  emptyGallery: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyGalleryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  emptyGallerySubtext: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
  },
  dateSection: {
    marginBottom: 32,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  photoThumbnail: {
    width: (width - 48) / 3,
    height: (width - 48) / 3,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  fullscreenImage: {
    width: width,
    height: height,
    resizeMode: 'contain',
  },
  photoViewHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  photoDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
