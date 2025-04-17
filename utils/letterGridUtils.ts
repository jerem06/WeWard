import { View } from 'react-native';

export interface Position {
    x: number;
    y: number;
}

export const findNearestSpot = async (
    x: number,
    y: number,
    answerTileRefs: View[],
    filledSpots: boolean[]
): Promise<number> => {
    let nearestSpot = -1;
    let minDistance = Infinity;

    for (let i = 0; i < answerTileRefs.length; i++) {
        const spot = answerTileRefs[i];
        if (!spot || filledSpots[i]) continue;

        const measurements = await new Promise<{
            x: number;
            y: number;
            width: number;
            height: number;
            pageX: number;
            pageY: number;
        }>((resolve) => {
            spot.measure((x, y, width, height, pageX, pageY) => {
                resolve({ x, y, width, height, pageX, pageY });
            });
        });

        const spotCenterX = measurements.pageX + measurements.width / 2;
        const spotCenterY = measurements.pageY + measurements.height / 2;

        const distance = Math.sqrt(
            Math.pow(x - spotCenterX, 2) + Math.pow(y - spotCenterY, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearestSpot = i;
        }
    }

    return nearestSpot;
};

export const validateAnswer = (
    currentAnswer: string[],
    expectedAnswer: string,
    filledSpots: boolean[]
): boolean | null => {
    const allSpotsFilled = filledSpots.every((spot) => spot === true);
    if (!allSpotsFilled) return null;
    return currentAnswer.join('') === expectedAnswer;
};

export const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}; 