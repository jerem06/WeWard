

export interface PexelsPhoto {
    id: number;
    src: {
        medium: string;
    };
}

export interface PexelsResponse {
    photos: PexelsPhoto[];
}

export const searchPhotos = async (query: string): Promise<PexelsPhoto[]> => {
    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=4&page=1`,
            {
                headers: {
                    Authorization: process.env.PEXEL_API_KEY,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PexelsResponse = await response.json();
        return data.photos;
    } catch (error) {
        console.error('Error fetching photos from Pexels:', error);
        throw error;
    }
}; 