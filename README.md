# 4 Images 1 Mot (4 Images 1 Word)

A React Native game inspired by the popular "4 Images 1 Word" game, built with Expo.

## Description

This game challenges players to guess a word based on four related images. Players must select letters from a grid of 12 available letters (arranged in 2 rows of 6) to form the correct word. The game provides immediate feedback through color changes.

## Features

- 🎯 Word guessing gameplay
- 🖼️ 4 related images per word
- ⌨️ Interactive letter selection
- 🎨 Visual feedback for correct/incorrect answers
- 🔄 Letter reset functionality
- 🎲 Randomized letter placement
- 🎮 Drag and drop letter placement

## Game Rules

1. Four images are displayed at the top of the screen
2. Players must guess the word that connects these images
3. Letters are available in a 2x6 grid below the images
4. Each letter can only be used once
5. Players can remove letters by tapping them
6. A green reset button allows clearing the current answer

## Results Obtained

### Implemented Features

- Display of 4 images related to a word
- Grid of 12 letters (2 rows of 6)
- Letter selection system with post-use deactivation
- Visual feedback (green/red) for answers
- Reset button functionality
- Intuitive UI with drag & drop

NB: I handle some edge cases: if the word is too big (+8 character), or if we don't manage to retrieve enough images (4), it will refetch a new word and associated images.

## Technical Implementation

### APIs Used

- Random Word API for word generation
- Pexels API for related images

Note: For better API calls, we could use Axios combined with TanStack Query.

### Styling

- StyleSheet

Note: The design is not responsive; I used an iPhone 16 Pro Max as a base. For better responsive design, we could use breakpoints or NativeWind.

### Animation

- Reanimated 3
- Gesture handler

Note: To respect the requirement of using fewer libraries as possible, I only needed these two libraries to implement the animations. I could have used the Animated API, but I preferred Reanimated for its documentation and developer experience.

### 🔐 API KEYS

I use a `.env` file to securely store sensitive information like `PEXELS_API_KEY`.

Instead of using Expo's `process.env.EXPO_PUBLIC_*` (which exposes environment variables on the client side), I opted for **`react-native-dotenv`** to keep API keys private and out of the build output.

- `PEXELS_API_KEY` is stored in a `.env` file.
- It's accessed in the app via `import { PEXELS_API_KEY } from '@env';`.
- This ensures API keys are not exposed in the frontend code or versioned with Git.

## Getting Started

### Prerequisites

- Node.js
- Expo CLI
- Expo Go app on your mobile device

### Installation

1. Clone the repository

```bash
git clone https://github.com/jerem06/WeWard.git
```

2. Install dependencies

```bash
npm install
```

3. Add .env file

```bash
touch .env
PEXEL_API_KEY=you_api_key
```

4. Start the Expo development server

```bash
npx expo start
```

5. Scan the QR code with your mobile device using the Expo Go app

## Project Structure

```
src/
├── components/     # Reusable UI components
├── api/            # API services
├── utils/          # Helper functions
└── assets/         # Images and other static assets
```

## 🚀 Future Enhancements

- **Responsive Design**  
  Implement responsive styling using `Dimensions`, `useWindowDimensions`, or libraries like NativeWind or `react-native-responsive-dimensions` to support multiple screen sizes.

- **Advanced API Management & Caching**  
  Integrate TanStack Query (React Query) with Axios to improve API handling with built-in caching, refetching, error states, and stale-while-revalidate patterns.

- **Code Refactoring & Structure Optimization**  
  Restructure files into a more scalable architecture (e.g., feature-based or domain-driven) to enhance readability and maintainability.

- **Global Error Handling**  
  Introduce global error boundaries and fallback UIs for better user experience during API failures or unexpected errors.

- **Loading & Skeleton States**  
  Add loading indicators or skeleton screens to improve perceived performance during image and word fetches.

- **Dark Mode Support**  
  Add theme handling (light/dark) using `react-native-appearance` or `useColorScheme` for better accessibility and user customization.

- **Offline Fallback**  
  Add offline detection and caching (e.g., using AsyncStorage) for last successful fetches to provide basic functionality without an internet connection.

- **Testing & CI**  
  Add unit testing (Jest) and integration testing (e.g., Detox or React Native Testing Library). Optionally set up CI with GitHub Actions for automated checks.

- **i18n Support**  
  Prepare the app for international users with a localization system using `i18next` or `react-intl`.

- **App Store Readiness**  
  Prepare app icons, splash screens, and metadata for publishing to App Store / Google Play.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

_Note: This project is a recreation of the popular "4 Images 1 Word" game for educational purposes._
