# 🐵 Monkey Expression Matcher - MVP Plan

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **ML**: face-api.js (client-side)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Assets**: 7 monkey meme images

---

## ✨ Features

1. **Camera Access** - Get user's webcam feed
2. **Real-Time Expression Detection** - Continuously analyze facial expression while camera is active
3. **Live Monkey Preview** - Show matching monkey meme updating in real-time as expression changes
4. **Capture Photo** - Freeze current moment with matched monkey
5. **Display Result** - Show captured photo + matched monkey side-by-side
6. **Download Image** - Save combined result as image
7. **Try Again** - Reset and return to live camera

**Expression Mapping:**
- **Happy** → Tongue out monkey
- **Surprised** → Wide-eyed monkey  
- **Neutral** → Thinking monkey
- **Sad** → Awkward smile monkey
- **Angry** → Shocked monkey
- **Fearful** → Scared hands monkey
- **Disgusted** → Confused monkey

---

## 🎨 Page Design

### Single Page App - 3 States

**State 1: Landing**
```
┌─────────────────────────────┐
│    🐵 Monkey Expression     │
│          Matcher            │
│                             │
│   Make a face and find      │
│   your matching monkey!     │
│                             │
│     [Start Camera] 📷       │
└─────────────────────────────┘
```

**State 2: Live Camera (Real-Time)**
```
┌─────────────────────────────┐
│  [Live Camera Feed]         │
│       640x480               │
│                             │
│  Current: Happy 😄          │
│  ┌────────┐                │
│  │ Monkey │ ← Updates live  │
│  │  Meme  │                │
│  └────────┘                │
│                             │
│  [Capture] [Stop]           │
└─────────────────────────────┘
```

**State 3: Result**
```
┌─────────────────────────────┐
│      Your Match! 🎯         │
│                             │
│  ┌────────┐  ┌────────┐    │
│  │  Your  │  │ Monkey │    │
│  │  Photo │  │  Meme  │    │
│  └────────┘  └────────┘    │
│                             │
│  Expression: Happy 😄       │
│                             │
│  [Download] [Try Again]     │
└─────────────────────────────┘
```

**Layout Notes:**
- Mobile-first responsive design
- Gradient background (orange/yellow theme)
- Card-based UI with shadows
- Real-time detection runs at ~10-15 FPS
- Smooth transitions between monkey memes
- Error messages for camera/face detection issues
