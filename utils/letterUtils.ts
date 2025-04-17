/**
 * Utility functions for letter operations
 */

/**
 * Generates an array of random letters from the alphabet
 * @param count Number of random letters to generate
 * @returns Array of random uppercase letters
 */
export const generateRandomLetters = (count: number): string[] => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letters: string[] = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        letters.push(alphabet[randomIndex]);
    }
    return letters;
};

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param array Array to shuffle
 * @returns Shuffled array
 */
export const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}; 