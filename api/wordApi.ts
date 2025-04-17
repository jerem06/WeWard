const RANDOM_WORD_API_URL = 'https://random-word-api.vercel.app/api?words=1';

export interface RandomWordResponse {
    word: string;
}

export const getRandomWord = async (): Promise<string> => {
    try {
        const response = await fetch(RANDOM_WORD_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json() as string[];
        return data[0].toUpperCase(); // The API returns an array with one word
    } catch (error) {
        console.error("Error fetching random word:", error);
        throw error;
    }
};
