# Letterz - Quick Start Guide

## Get Running in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npx expo start
```

### 3. Open on Your Device
- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal  
- **Physical Device**: Scan QR code with Expo Go app

## First Launch

The app will:
1. Detect your device language (EN or DE)
2. Open the Setup screen
3. Prompt you to configure your first game

## Quick Game Setup

1. **Choose Mode**: Points (score-based) or KO (elimination)
2. **Set Category**: e.g., "Cities", "Animals", "Food"
3. **Adjust Timer**: 5-30 seconds (default: 15s)
4. **Add Players**: Minimum 2 required
5. **Tap "Start Game"**

## Gameplay

1. **Select a Letter** from the circle
2. **Enter a Word** that starts with that letter
3. **Submit** before time runs out
4. Points awarded based on speed (Points mode)
5. Next player's turn begins automatically

## Game Ends When

- All letters are used
- Only 1 player remains (KO mode)
- "End" button is pressed

## Tips

- **Honor System**: No dictionary checks—trust your friends!
- **German Umlauts**: "Österreich" matches letter O, "Äpfel" matches A
- **Skip Hard Letters**: Enable to exclude Q, X, Y
- **Last Settings Saved**: Your config persists between sessions

## Troubleshooting

**App won't start?**
- Ensure Node.js v18+ is installed
- Delete `node_modules` and run `npm install` again

**Missing assets warnings?**
- These are optional for development
- See `assets/README.md` for details

**Module not found errors?**
- Run `npx expo install --check` to fix package versions

## Full Documentation

See [README.md](./README.md) for complete documentation including:
- Architecture overview
- Internationalization details
- Scoring formula
- State management explanation
- Tech stack details

Enjoy the game! 🎮
