# Letterz — Buchstaben-Partyspiel

## Was diese App ist
Minimalistisches React Native Partyspiel für 2+ Spieler. Spieler wählen reihum Buchstaben aus einem Kreis und müssen Wörter nennen, die mit dem gewählten Buchstaben für eine vorgegebene Kategorie anfangen. Zwei Modi: Punkte (je schneller, desto mehr Punkte) und KO (wer Zeit überschreitet, scheidet aus). Zweisprachig (Deutsch/Englisch), kein Wörterbuch-Check — Ehrensystem.

**Geschäftsmodell**: Einmalzahlung ~4€ im App Store (iOS + Android). Kein Abo, kein Freemium — klare, einfache Transaktion.

## Tech Stack
- **Framework**: Expo (React Native), TypeScript
- **Routing**: Expo Router
- **State**: Zustand (inkl. AsyncStorage-Persistenz)
- **Internationalisierung**: i18n-js
- **Build**: EAS (Expo Application Services)
- **Zielplattformen**: iOS, Android

## Aktueller Stand
Spielbares MVP. Setup-Screen (Konfiguration) und Game-Screen (Spielablauf) implementiert. Beide Modi (Punkte, KO) funktionieren. Timer, Buchstabenkreis und Ergebnisanzeige vorhanden. Grundlegende i18n für EN/DE. AsyncStorage für Settings-Persistenz.

## Architektur
```
letterz/
├── app/
│   ├── _layout.tsx       # Root Layout + Settings-Initialisierung
│   ├── index.tsx         # Setup-Screen (Spieler, Kategorie, Timer, Modus)
│   └── game.tsx          # Game-Screen (Buchstabenkreis, Timer, Spielablauf)
├── src/
│   ├── components/
│   │   ├── LetterRing.tsx     # Kreisförmiger Buchstaben-Selektor
│   │   ├── Timer.tsx          # Turn-Timer mit visuellem Fortschritt
│   │   ├── PlayerList.tsx     # Spieler-Verwaltung im Setup
│   │   └── ResultsModal.tsx   # End-Game Ergebnisse
│   ├── i18n/
│   │   ├── index.ts           # i18n Setup + Utility-Funktionen
│   │   └── translations.ts    # EN/DE Übersetzungen
│   ├── store/
│   │   └── gameStore.ts       # Zustand Store: Settings, GameState, alle Actions
│   ├── types/index.ts         # TypeScript Definitionen
│   └── utils/
│       ├── normalization.ts   # Umlaut-Normalisierung (ä→ae etc.), Buchstaben-Pool
│       └── scoring.ts         # Punkte-Berechnung (zeitbasiert)
├── assets/                    # App-Icons, Splash
└── app.json                   # Expo Konfiguration
```

**Game-Flow**: Setup → Buchstaben-Auswahl → Antwort eingeben → Validierung → Nächster Spieler / Eliminierung (KO)

## Dev-Befehle
```bash
npm install
npx expo start         # Dev-Server (QR Code für Expo Go)
npx expo start --ios   # iOS Simulator
npx expo start --android # Android Emulator

npm run build          # EAS Build (Production)
```

## Nächste Schritte
1. **Kategorien-System**: Vordefinierte Kategorie-Liste (Tiere, Städte, Filme...) statt Freitext
2. **Sound-Effekte**: Audio-Feedback bei Timer-Ende, richtigem Wort etc.
3. **Mehr Sprachen**: Spanisch, Französisch-Support in i18n hinzufügen
4. **App-Store Veröffentlichung**: EAS Submit für iOS und Android App Stores
5. **Haptisches Feedback**: Vibration bei Timer-Ende (Expo Haptics)
6. **Custom Kategorien**: Nutzer können eigene Kategorien speichern

## Bekannte Probleme / Technische Schulden
- Timer läuft auf `setInterval` — kann bei App-Backgrounding unpräzise werden
- Keine Wörterbuch-Validierung (bewusstes Design, aber limitiert Spielspaß bei Streitfällen)
- i18n-Spracherkennung via Device-Locale kann auf manchen Geräten fehlschlagen
- Kein Backend — alles lokal, kein Online-Multiplayer möglich

## Wichtige Entscheidungen & Konventionen
- Ehrensystem ohne Wörterbuch: bewusste Designentscheidung für Party-Feeling und Simplizität
- Umlaut-Normalisierung (ä/ae, ö/oe, ü/ue) damit Buchstaben-Matching funktioniert
- Zustand + AsyncStorage für persistente Settings ohne Backend-Abhängigkeit
- Expo Router für typsichere Navigation zwischen Setup und Game Screen


---

## Entwicklungslog & Nächste Schritte

> **Anweisung für Claude Code**: Halte diesen Abschnitt nach jeder Session aktuell.
> - **Nach Änderungen**: Kurzen Log-Eintrag hinzufügen (Datum + was gemacht + warum)
> - **Nächste Schritte**: Immer nach Rücksprache mit dem Nutzer definieren — nie eigenständig befüllen
> - **"Mach weiter"**: Den obersten offenen Punkt aus "Nächste Schritte" aufgreifen und umsetzen, dann Log aktualisieren und neue Schritte vorschlagen

### Nächste Schritte
<!-- Priorisierte TODO-Liste — wird nach Rücksprache mit dem Nutzer befüllt -->
- [ ] (noch nicht definiert — bitte kurz besprechen)

### Log
<!-- Neueste Einträge zuerst -->
| Datum | Was & Warum |
|-------|-------------|
| 2026-05-07 | CLAUDE.md angelegt — Projektdokumentation initialisiert |


---

## Git-Konvention

Nach jeder größeren Änderung wird committed — niemals ungesicherte Arbeit liegenlassen.

**Wann committen:** Nach jedem abgeschlossenen Feature, Bugfix, Refactoring oder bevor die Session endet.

**Commit-Message Format:**
```
<typ>: <kurze Beschreibung was & warum>
Typen: feat / fix / refactor / docs / chore
```

**Für Claude Code:** Nach jeder größeren Änderung eigenständig committen. Staging selektiv — keine .env, keine Secrets. Nie blind `git add -A`.
