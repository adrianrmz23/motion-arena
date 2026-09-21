# Motion Arena — Block 03

Block 03 turns Boxing Arena into a playable camera-controlled fight.

## Added in this block

- Full Quick Fight game loop.
- 3 rounds of 2 minutes.
- Pre-round countdown and round transitions.
- Camera + MediaPipe body tracking inside the fight HUD.
- Live commands for left/right jab, guard, dodge and crouch.
- Timing judgments: PERFECT / GOOD / MISS.
- Player and opponent health bars.
- Score, combo, best combo, accuracy and damage tracking.
- Adaptive prompt speed as each round progresses.
- Opponent knockdowns and score bonuses.
- Match results screen with XP estimate.
- Small generated WebAudio cues; no audio files required.
- Visual redesign of Boxing Arena to feel closer to an active sports videogame.

## Run

```bash
npm install
npm run dev
```

Open the site, go to **Boxing Arena → Quick Fight**, complete calibration and enter the ring.

Camera access requires HTTPS in production or localhost during development.
