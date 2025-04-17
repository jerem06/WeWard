import { StyleSheet, View, Image } from "react-native";
import { PexelsPhoto } from "../api/pexelsApi";

interface ImageGridProps {
  photos: PexelsPhoto[];
}

export const ImageGrid = ({ photos }: ImageGridProps) => {
  return (
    <View style={styles.imageGrid}>
      <View style={styles.imageRow}>
        {photos.slice(0, 2).map((photo) => (
          <View key={photo.id} style={styles.imageContainer}>
            <Image
              source={{ uri: photo.src.medium }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>
      <View style={styles.imageRow}>
        {photos.slice(2, 4).map((photo) => (
          <View key={photo.id} style={styles.imageContainer}>
            <Image
              source={{ uri: photo.src.medium }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageGrid: {
    marginTop: 40,
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  imageContainer: {
    borderWidth: 5,
    borderColor: "gray",
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    marginTop: 40,
    marginBottom: 20,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    marginTop: 40,
    marginBottom: 20,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
