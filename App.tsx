import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { ImageGrid } from "./components/ImageGrid";
import { LetterGrid } from "./components/LetterGrid";
import { SkeletonLoading } from "./components/SkeletonLoading";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getRandomWord } from "./api/wordApi";
import { PexelsPhoto, searchPhotos } from "./api/pexelsApi";
import { generateRandomLetters, shuffleArray } from "./utils/letterUtils";

export default function App() {
  const [randomWord, setRandomWord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [letters, setLetters] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);

  const fetchGameData = async () => {
    try {
      setIsLoading(true);
      const word = await getRandomWord();

      // Fetch photos first to check if we have enough
      const fetchedPhotos = await searchPhotos(word);

      // Check if word is too long or we don't have enough photos
      if (word.length > 8 || fetchedPhotos.length < 4) {
        // Recursively call fetchGameData to get a new word
        return fetchGameData();
      }

      setRandomWord(word);
      setPhotos(fetchedPhotos);

      // Generate letters array from the word and additional random letters
      const wordLetters = word.toUpperCase().split("");
      const additionalLetters = generateRandomLetters(12 - wordLetters.length);
      const allLetters = shuffleArray([...wordLetters, ...additionalLetters]);
      setLetters(allLetters);

      setIsLoading(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch data";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  const handleValidationComplete = () => {
    // refetch game data on successful word validation
    fetchGameData();
  };

  if (isLoading || !randomWord) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <SkeletonLoading />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <ImageGrid photos={photos} />
        <LetterGrid
          letters={letters}
          expectedAnswer={randomWord}
          onValidationComplete={handleValidationComplete}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E253F",
    padding: 20,
  },
  resultText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  errorText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 20,
  },
  buttonText: {
    color: "#1a237e",
    fontSize: 16,
    fontWeight: "bold",
  },
});
