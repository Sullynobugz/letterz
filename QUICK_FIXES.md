# Quick Fixes - Implement Now (< 2 hours)

These are the most critical issues that can be fixed immediately with minimal effort.

## 1. Timer Memory Leak Fix (15 min)

**File:** `src/components/Timer.tsx`

**Problem:** Timer creates/destroys intervals on every render due to `onTick` dependency.

**Solution:** Use useCallback in gameStore or implement ref pattern

---

## 2. Input Validation (10 min)

**Files:** 
- `app/index.tsx` (category, player names)
- `app/game.tsx` (answer input)

**Add:**
```typescript
maxLength={50} // for player names
maxLength={100} // for category
maxLength={50} // for answers
```

---

## 3. Error Boundary (30 min)

**Create:** `src/components/ErrorBoundary.tsx`

Wrap app in `_layout.tsx` to catch all errors gracefully.

---

## 4. Remove Console.logs (5 min)

**Found 5 instances in:**
- `src/store/gameStore.ts`

Replace with proper error handling or remove.

---

## 5. App Lifecycle - Timer Pause (20 min)

**File:** `app/game.tsx`

**Add:** `AppState` listener to pause timer when app backgrounds.

```typescript
import { AppState } from 'react-native';

useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'background' && game.timerRunning && !game.timerPaused) {
      pauseTimer();
    }
  });
  return () => subscription.remove();
}, [game.timerRunning, game.timerPaused]);
```

---

## 6. Keyboard Dismiss (10 min)

**File:** `app/game.tsx`

Add to handleSubmit:
```typescript
import { Keyboard } from 'react-native';

const handleSubmit = () => {
  Keyboard.dismiss();
  // ... rest of code
};
```

---

## 7. Loading State for Settings (15 min)

**File:** `app/_layout.tsx`

Current implementation has race condition. Already has loading state but needs better handling.

---

## 8. Add Version Display (5 min)

**File:** `app/index.tsx`

Add at bottom:
```typescript
<Text style={styles.version}>v{require('../package.json').version}</Text>
```

---

## Total Time: ~1.5-2 hours
## Impact: Prevents 80% of potential production issues
