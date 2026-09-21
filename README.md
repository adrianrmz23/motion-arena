# Motion Arena — Block 02

Motion Arena is an active-gaming webapp inspired by motion sports games. Block 02 turns the camera into the first real controller.

## What's new
- Complete visual redesign: sporty console / stadium aesthetic.
- Browser camera access.
- MediaPipe Pose Landmarker with 33 body landmarks.
- Live skeleton overlay.
- Calibration checks: full body, centering, playing distance.
- First Motion Engine rules: guard, left/right jab, dodge and crouch.
- Motion Lab for testing movement input before the actual fight gameplay.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000. Camera access requires localhost or HTTPS.

## Build
```bash
npm run build
```

## Notes
Pose detection runs in the browser. MediaPipe WASM and the pose model are loaded from their hosted endpoints at runtime. The movement heuristics in this block are intentionally lightweight; later blocks can add per-player calibration and learned boxing-action classifiers.
