import React, { useCallback, useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface LetterGridProps {
  letters: string[];
  expectedAnswer: string;
  onValidationComplete?: () => void;
}

export const LetterGrid = ({
  letters,
  expectedAnswer,
  onValidationComplete,
}: LetterGridProps) => {
  const [filledSpots, setFilledSpots] = useState<boolean[]>(
    new Array(expectedAnswer.length).fill(false)
  );
  const [currentAnswer, setCurrentAnswer] = useState<string[]>(
    new Array(expectedAnswer.length).fill("")
  );
  const [usedLetters, setUsedLetters] = useState<boolean[]>(
    new Array(letters.length).fill(false)
  );
  const [letterToSpotMap, setLetterToSpotMap] = useState<number[]>(
    new Array(letters.length).fill(-1)
  );
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const answerContainerRef = useRef<View>(null);
  const answerTileRefs = useRef<View[]>([]);

  // Create shared values for each letter's position
  const positions = letters.map((_, index) => ({
    x: useSharedValue(0),
    y: useSharedValue(0),
  }));

  // Reset state when we got a new word
  useEffect(() => {
    handleReset();
  }, [expectedAnswer, letters.length]);

  // Function to find the nearest available spot in the answer grid when a letter is dropped
  // Parameters:
  // - x: The x-coordinate where the letter was dropped
  // - y: The y-coordinate where the letter was dropped
  // Returns: A Promise that resolves to the index of the nearest available spot, or -1 if no spot is found
  const findNearestSpot = useCallback(
    (x: number, y: number): Promise<number> => {
      // Early return if the answer container reference doesn't exist
      if (!answerContainerRef.current) return Promise.resolve(-1);

      return new Promise<number>((resolve) => {
        // Initialize variables to track the nearest spot and its distance
        let nearestSpot = -1; // Index of the closest available spot
        let minDistance = Infinity; // Keep track of the smallest distance found
        let currentIndex = 0; // Current spot being measured

        // Recursive function to measure each spot in the answer grid
        const measureNextSpot = () => {
          // Base case: If we've measured all spots, resolve with the nearest spot found
          if (currentIndex >= answerTileRefs.current.length) {
            resolve(nearestSpot);
            return;
          }

          // Get the current spot reference
          const spot = answerTileRefs.current[currentIndex];

          // Skip this spot if it doesn't exist or is already filled
          if (!spot || filledSpots[currentIndex]) {
            currentIndex++;
            measureNextSpot();
            return;
          }

          // Measure the position and dimensions of the current spot
          spot.measure((_x, _y, width, height, pageX, pageY) => {
            // Calculate the center point of the spot
            const spotCenterX = pageX + width / 2;
            const spotCenterY = pageY + height / 2;

            // Calculate the Euclidean distance between the drop point and spot center
            const distance = Math.sqrt(
              Math.pow(x - spotCenterX, 2) + Math.pow(y - spotCenterY, 2)
            );

            // Update nearestSpot if this spot is closer than previous ones
            if (distance < minDistance) {
              minDistance = distance;
              nearestSpot = currentIndex;
            }

            // Move to the next spot
            currentIndex++;
            measureNextSpot();
          });
        };

        // Start measuring spots
        measureNextSpot();
      });
    },
    [filledSpots] // Only re-create the function when filledSpots changes
  );

  // Function to validate the current answer
  const validateAnswer = useCallback(() => {
    // Check if all spots are filled
    const allSpotsFilled = filledSpots.every((spot) => spot === true);

    if (allSpotsFilled) {
      // Compare current answer with expected answer
      const isCorrect = currentAnswer.join("") === expectedAnswer;
      setIsValid(isCorrect);
      if (isCorrect) {
        setTimeout(() => {
          onValidationComplete?.();
        }, 1000);
      }
    }

    return null;
  }, [currentAnswer, expectedAnswer, filledSpots, onValidationComplete]);

  // Validate answer whenever currentAnswer or filledSpots changes
  useEffect(() => {
    validateAnswer();
  }, [currentAnswer, filledSpots, validateAnswer]);

  // Function to handle letter drop
  const handleLetterDrop = useCallback(
    async (index: number, x: number, y: number) => {
      const nearestSpot = await findNearestSpot(x, y);
      const MAX_DISTANCE = 100; // Maximum distance in pixels

      if (nearestSpot !== -1) {
        // Get the spot's position
        const spot = answerTileRefs.current[nearestSpot];
        if (!spot) {
          positions[index].x.value = withSpring(0);
          positions[index].y.value = withSpring(0);
          return;
        }

        spot.measure((_x, _y, width, height, pageX, pageY) => {
          const spotCenterX = pageX + width / 2;
          const spotCenterY = pageY + height / 2;

          const distance = Math.sqrt(
            Math.pow(x - spotCenterX, 2) + Math.pow(y - spotCenterY, 2)
          );

          if (distance <= MAX_DISTANCE) {
            const newFilledSpots = [...filledSpots];
            newFilledSpots[nearestSpot] = true;
            setFilledSpots(newFilledSpots);

            const newAnswer = [...currentAnswer];
            newAnswer[nearestSpot] = letters[index];
            setCurrentAnswer(newAnswer);

            // Mark the letter as used
            const newUsedLetters = [...usedLetters];
            newUsedLetters[index] = true;
            setUsedLetters(newUsedLetters);

            // Store the mapping of letter to spot
            const newLetterToSpotMap = [...letterToSpotMap];
            newLetterToSpotMap[index] = nearestSpot;
            setLetterToSpotMap(newLetterToSpotMap);
          }
        });
      }

      // Reset position
      positions[index].x.value = withTiming(0);
      positions[index].y.value = withTiming(0);
    },
    [
      filledSpots,
      currentAnswer,
      letters,
      positions,
      usedLetters,
      letterToSpotMap,
    ]
  );

  // Function to handle returning a letter to its starting position
  const handleReturnLetter = useCallback(
    (spotIndex: number) => {
      // Find which letter is in this spot
      const letterIndex = letterToSpotMap.findIndex(
        (spot) => spot === spotIndex
      );
      if (letterIndex === -1) return;

      // Clear the spot
      const newFilledSpots = [...filledSpots];
      newFilledSpots[spotIndex] = false;
      setFilledSpots(newFilledSpots);

      // Clear the answer at this spot
      const newAnswer = [...currentAnswer];
      newAnswer[spotIndex] = "";
      setCurrentAnswer(newAnswer);

      // Mark the letter as unused
      const newUsedLetters = [...usedLetters];
      newUsedLetters[letterIndex] = false;
      setUsedLetters(newUsedLetters);

      // Clear the mapping
      const newLetterToSpotMap = [...letterToSpotMap];
      newLetterToSpotMap[letterIndex] = -1;
      setLetterToSpotMap(newLetterToSpotMap);

      // Reset validation state
      setIsValid(null);
    },
    [filledSpots, currentAnswer, usedLetters, letterToSpotMap]
  );

  // Function to reset all letters
  const handleReset = useCallback(() => {
    // Reset all positions to original
    positions.forEach((pos) => {
      pos.x.value = withSpring(0);
      pos.y.value = withSpring(0);
    });

    // Reset all states
    setFilledSpots(new Array(expectedAnswer.length).fill(false));
    setCurrentAnswer(new Array(expectedAnswer.length).fill(""));
    setUsedLetters(new Array(letters.length).fill(false));
    setLetterToSpotMap(new Array(letters.length).fill(-1));
    setIsValid(null);
  }, [expectedAnswer.length, letters.length, positions]);

  // Function to create gesture and animated style for a letter
  const createLetterGestureAndStyle = useCallback(
    (index: number) => {
      const gesture = Gesture.Pan()
        .onUpdate((event) => {
          positions[index].x.value = event.translationX;
          positions[index].y.value = event.translationY;
        })
        .onEnd((event) => {
          runOnJS(handleLetterDrop)(index, event.absoluteX, event.absoluteY);
        });

      const animatedStyle = useAnimatedStyle(() => {
        return {
          transform: [
            { translateX: positions[index].x.value },
            { translateY: positions[index].y.value },
          ],
        };
      });

      return { gesture, animatedStyle };
    },
    [positions, handleLetterDrop]
  );

  return (
    <>
      {/* Answer Container */}
      <View ref={answerContainerRef} style={styles.answerContainer}>
        {currentAnswer.map((letter, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => filledSpots[index] && handleReturnLetter(index)}
            activeOpacity={filledSpots[index] ? 0.7 : 1}
          >
            <View
              ref={(ref) => {
                if (ref) answerTileRefs.current[index] = ref;
              }}
              style={[
                styles.answerTile,
                filledSpots[index] &&
                  isValid !== null &&
                  (isValid
                    ? styles.filledTileSuccess
                    : styles.filledTileFailure),
              ]}
            >
              <Text style={styles.answerText}>{letter}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Letters Container */}
      <View style={styles.lettersContainer}>
        <View style={styles.wrapper}>
          <View style={styles.lettersRow}>
            {letters.slice(0, 6).map((letter, index) => {
              const { gesture, animatedStyle } =
                createLetterGestureAndStyle(index);

              return (
                <View key={index} style={styles.letterTileContainer}>
                  {!usedLetters[index] && (
                    <GestureDetector gesture={gesture}>
                      <Animated.View style={[styles.letterTile, animatedStyle]}>
                        <Text style={styles.letterText}>{letter}</Text>
                      </Animated.View>
                    </GestureDetector>
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.lettersRow}>
            {letters.slice(6, 12).map((letter, index) => {
              const { gesture, animatedStyle } = createLetterGestureAndStyle(
                index + 6
              );

              return (
                <View key={index + 6} style={styles.letterTileContainer}>
                  {!usedLetters[index + 6] && (
                    <GestureDetector gesture={gesture}>
                      <Animated.View style={[styles.letterTile, animatedStyle]}>
                        <Text style={styles.letterText}>{letter}</Text>
                      </Animated.View>
                    </GestureDetector>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleReset}>
          <Text style={styles.submitButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  filledTileSuccess: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  filledTileFailure: {
    borderColor: "#f44336",
    backgroundColor: "#ffcdd2",
  },
  lettersRow: {
    flexDirection: "row",
    gap: 10,
  },
  answerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  lettersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  letterTile: {
    width: 45,
    height: 45,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  letterText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  wrapper: {
    gap: 10,
  },
  letterTileContainer: {
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    borderRadius: 8,
    width: 45,
    height: 45,
  },
});
