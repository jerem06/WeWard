import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

export const SkeletonLoading = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Image Grid Skeleton */}
      <View style={styles.imageGrid}>
        <View style={styles.imageRow}>
          <Animated.View style={[styles.imageContainer, animatedStyle]} />
          <Animated.View style={[styles.imageContainer, animatedStyle]} />
        </View>
        <View style={styles.imageRow}>
          <Animated.View style={[styles.imageContainer, animatedStyle]} />
          <Animated.View style={[styles.imageContainer, animatedStyle]} />
        </View>
      </View>

      {/* Answer Tiles Skeleton */}
      <View style={styles.answerContainer}>
        {[...Array(5)].map((_, index) => (
          <Animated.View
            key={`answer-${index}`}
            style={[styles.answerTile, animatedStyle]}
          />
        ))}
      </View>

      {/* Letter Grid Skeleton */}
      <View style={styles.lettersContainer}>
        <View style={styles.wrapper}>
          <View style={styles.lettersRow}>
            {[...Array(6)].map((_, index) => (
              <Animated.View
                key={`letter-${index}`}
                style={[styles.letterTile, animatedStyle]}
              />
            ))}
          </View>
          <View style={styles.lettersRow}>
            {[...Array(6)].map((_, index) => (
              <Animated.View
                key={`letter-${index + 6}`}
                style={[styles.letterTile, animatedStyle]}
              />
            ))}
          </View>
        </View>
        <Animated.View style={[styles.resetButton, animatedStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
  },
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
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  answerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 10,
  },
  answerTile: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  lettersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  lettersRow: {
    flexDirection: "row",
    gap: 10,
  },
  letterTile: {
    width: 45,
    height: 45,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  wrapper: {
    gap: 10,
  },
  resetButton: {
    flex: 1,
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
});
