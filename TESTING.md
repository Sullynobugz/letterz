# Testing Guide - Quick Fixes Verification

## How to Test All Fixes

### 1. Timer Memory Leak Fix ✅

**Test Steps:**
1. Start a game
2. Open React DevTools (if available) or use Xcode Instruments
3. Watch timer for 2-3 minutes
4. Check memory usage - should remain stable

**Expected Result:**
- Memory usage stays constant
- No increasing trend in memory allocation
- Timer updates smoothly every second

---

### 2. Error Boundary ✅

**Test Steps:**
1. Temporarily add this to any component:
   ```typescript
   throw new Error('Test error');
   ```
2. Navigate to that screen
3. Error boundary should catch it

**Expected Result:**
- See error screen with 😔 emoji
- "Oops! Something went wrong" message
- "Try Again" button that recovers

**Cleanup:** Remove the test error

---

### 3. App Lifecycle (Timer Pause) ✅

**Test Steps:**
1. Start a game
2. Select a letter
3. Note the timer value (e.g., 12 seconds)
4. Press home button or swipe up (background the app)
5. Wait 5 seconds
6. Return to app

**Expected Result:**
- Timer is paused at ~12 seconds (same as when you left)
- "PAUSIERT" or "PAUSED" label visible
- "Resume" button available
- Press Resume → Timer continues from 12 seconds

---

### 4. Input Validation ✅

**Test A - Category:**
1. Go to Setup screen
2. Tap category input
3. Paste a very long text (200+ characters)

**Expected:** Only first 100 characters accepted

**Test B - Player Name:**
1. Tap "Add player" input
2. Paste a very long name (100+ characters)

**Expected:** Only first 50 characters accepted

**Test C - Game Answer:**
1. Start a game
2. Select a letter
3. Paste a very long word (100+ characters)

**Expected:** Only first 50 characters accepted

---

### 5. Keyboard Dismiss ✅

**Test Steps:**
1. Start a game
2. Select a letter
3. Type an answer
4. Press submit button OR keyboard "Done"

**Expected Result:**
- Keyboard dismisses immediately
- Answer is processed
- Next turn begins

---

### 6. Console Logs (Development Only) ✅

**Test Steps:**
1. Build in release mode: `npx expo build:ios --release-channel production`
2. Check if any console.logs appear in production

**Expected Result:**
- No console logs in production build
- Logs still visible in development mode (`__DEV__`)

**Quick Check:**
- Search codebase: all console.* wrapped in `if (__DEV__)`

---

### 7. Version Display ✅

**Test Steps:**
1. Open app
2. Look at bottom of Setup screen

**Expected Result:**
- See "v1.0.0" in small gray text
- Centered at bottom

---

## Automated Testing Checklist

### Unit Tests (Future)
- [ ] Timer component renders correctly
- [ ] Timer calls onTick every second
- [ ] Timer stops when running=false
- [ ] Input validation limits work
- [ ] Game logic (submitAnswer) works
- [ ] Scoring calculation is correct

### Integration Tests (Future)
- [ ] Full game flow (setup → game → results)
- [ ] Language switching works
- [ ] Timer pause/resume cycle
- [ ] Error boundary catches errors

### E2E Tests (Future)
- [ ] Complete game with 2 players
- [ ] App backgrounding during game
- [ ] Error recovery flow

---

## Quick Smoke Test (5 min)

Run this test after any changes:

1. ✅ App starts without errors
2. ✅ Change language EN ↔ DE (both work)
3. ✅ Add 2 players, start game
4. ✅ Timer counts down
5. ✅ Select letter, enter word, submit
6. ✅ Background app → return → timer paused
7. ✅ Resume timer → continues
8. ✅ Complete game → see results
9. ✅ Play again → works
10. ✅ Back to setup → works

**All pass?** ✅ Good to go!

---

## Known Limitations

### Not Fixed Yet:
- No app icon (will use default)
- No crash reporting (errors only visible in dev)
- No analytics (can't track issues)
- No accessibility labels (screen reader won't work well)
- No dark mode (light only)
- No tests (manual testing required)

### Working Around Limitations:
1. **Icon:** Use placeholder in development
2. **Crashes:** Test thoroughly, use ErrorBoundary
3. **Analytics:** Add before launch
4. **A11y:** Add before App Store submission
5. **Dark mode:** Add if time permits
6. **Tests:** Prioritize critical paths

---

## Regression Testing

After any new feature, re-test:
- [ ] Timer still works correctly
- [ ] App lifecycle still pauses timer
- [ ] Error boundary still catches errors
- [ ] Inputs still have max length
- [ ] Keyboard still dismisses
- [ ] Version still displays

---

## Performance Testing

### Battery Test:
1. Fully charge device
2. Play game for 30 minutes continuously
3. Check battery percentage

**Expected:** < 10% battery drain

### Memory Test:
1. Start game
2. Play for 10+ rounds
3. Check memory in dev tools

**Expected:** < 100MB total memory usage, no leaks

### Frame Rate Test:
1. Start game
2. Rapidly tap letters and submit
3. Check for UI lag

**Expected:** Smooth 60fps, no stuttering
