# Letterz

A minimalistic React Native party game app where players take turns choosing letters and entering words that start with those letters for a given category. Built with Expo, TypeScript, and Zustand.

## Features

- **Two Game Modes**:
  - **Points Mode**: Players earn points based on how quickly they answer (faster = more points)
  - **KO Mode**: Players who run out of time are eliminated until one remains

- **Bilingual Support**: English and German with runtime language switching
- **Configurable Timer**: 5-30 seconds per turn (default: 15s)
- **Letter Circle UI**: Visual letter selection with real-time availability
- **Honor System**: No dictionary validation—trust your friends!
- **Smart Validation**: Only checks if the word starts with the selected letter (with German umlaut normalization)
- **Skip Hard Letters**: Optional preset to exclude Q, X, Y from the game
- **Persistent Settings**: Last used settings and player list are saved
- **Responsive Design**: Works on phones and tablets

## How to Run

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- Expo CLI (optional, but helpful)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

Then:
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
letterz/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root layout with settings initialization
│   ├── index.tsx            # Setup screen (game configuration)
│   └── game.tsx             # Game screen (main gameplay)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── LetterRing.tsx  # Circular letter selector
│   │   ├── Timer.tsx       # Turn timer with visual progress
│   │   ├── PlayerList.tsx  # Player management for setup
│   │   └── ResultsModal.tsx # End-game results overlay
│   ├── i18n/               # Internationalization
│   │   ├── index.ts        # i18n setup and utility functions
│   │   └── translations.ts # EN/DE translations
│   ├── store/              # State management
│   │   └── gameStore.ts    # Zustand store for app state
│   ├── types/              # TypeScript definitions
│   │   └── index.ts        # Shared types and interfaces
│   └── utils/              # Utility functions
│       ├── normalization.ts # Umlaut normalization and validation
│       └── scoring.ts      # Points calculation
├── app.json                # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
```

## How Internationalization Works

The app uses `i18n-js` for translations:

1. **Default Language**: Detected from device locale (falls back to English)
2. **Translations**: Stored in `src/i18n/translations.ts` with EN/DE keys
3. **Runtime Switching**: Change language via segmented control on Setup screen
4. **Persistence**: Selected language is saved to AsyncStorage

### Adding Translations

Edit `src/i18n/translations.ts` and add your keys to both `en` and `de` objects:

```typescript
export const translations = {
  en: {
    myKey: 'My English Text',
  },
  de: {
    myKey: 'Mein deutscher Text',
  },
};
```

Use in components with `t()`:
```typescript
import { t } from '../src/i18n';

// Simple
t('myKey')

// With interpolation
t('game.invalidWord', { letter: 'A' })
```

## Key Design Decisions

### Timer
- Starts automatically at the beginning of each turn
- If time runs out:
  - **Points Mode**: Player gets 0 points, turn advances
  - **KO Mode**: Player is eliminated, turn advances
- Letter is NOT consumed on timeout (fairness consideration)

### Scoring (Points Mode)
Formula: `points = round(100 * secondsLeft / turnSeconds)`

Examples (15s timer):
- 15s left → 100 points
- 10s left → 67 points
- 5s left → 33 points
- 0s (timeout) → 0 points

### Umlaut Normalization
German umlauts are normalized for first-letter matching:
- Ä, ä → A
- Ö, ö → O
- Ü, ü → U
- ß → S

Examples:
- "Österreich" matches letter O
- "Äpfel" matches letter A
- Player can select "A" and type "Äpfel"—it's valid!

### Honor System Validation
Only formal checks are performed:
1. Answer is not empty
2. First letter (after normalization) matches selected letter

**No dictionary checks**. The game trusts players to provide real words.

### Skip Hard Letters
When enabled, Q, X, and Y are excluded from the letter pool. This makes the game easier, especially for German categories where these letters are rare.

## State Management

The app uses Zustand for global state with these key actions:

- `startGame(setup)`: Initialize game with category and players
- `selectLetter(letter)`: Mark a letter as selected for current turn
- `submitAnswer(answer)`: Validate and record player's answer
- `timeoutTurn()`: Handle timer expiration (0 points or elimination)
- `nextTurn()`: Advance to next player or end game
- `endGame()`: Finish game and show results
- `playAgain()`: Reset game state with same players/settings

Settings are persisted to AsyncStorage automatically.

## Game Flow

1. **Setup Screen**: Configure mode, category, timer, players
2. **Game Screen**: 
   - Current player sees their name and timer
   - Select a letter from the ring
   - Enter a word starting with that letter
   - Submit (validated) → earn points → next player
3. **End Conditions**:
   - All letters used
   - (KO Mode) One player remaining
   - Manual "End" button
4. **Results Modal**: Winner announced, scoreboard shown, play again or return to setup

## Tech Stack

- **Expo SDK 52**: Managed workflow
- **React Native 0.76**: Cross-platform mobile framework
- **TypeScript**: Type safety
- **expo-router 4**: File-based navigation
- **Zustand 5**: Lightweight state management
- **i18n-js 4**: Internationalization
- **AsyncStorage**: Persistent storage

## Future Enhancements (Not in MVP)

- Haptic feedback on letter selection
- Sound effects for timer/submit
- Category packs or random category generator
- Multiplayer sync across devices
- Statistics and leaderboards
- Customizable hard letters list
- Accessibility improvements (voice-over, larger text)

## License

MIT (or your chosen license)

## Credits

Built as a digital version of the viral party game format.
