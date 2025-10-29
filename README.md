# 🎨 Pencil Sorter

A beautiful, interactive color-sorting puzzle game built with React. Test your color perception by arranging colored pencils in the order an AI would sort them!

## ✨ Features

### 🎮 Gameplay
- **10 Progressive Levels** - Each level adds more pencils and subtler color differences
- **Smart Scoring System** - Multi-metric evaluation (Position, Order, Color Flow)
- **AI Comparison** - See how your sorting matches the ideal AI algorithm
- **Fixed First Pencil** - The first pencil is locked as a reference point

### 🎨 Visual Design
- **Realistic 3D Pencils** - Detailed rendering with wood tips, colored barrels, metal ferrules, and erasers
- **Smooth Animations** - Buttery-smooth drag-and-drop with spring physics
- **Zoom Feature** - Click any pencil to inspect subtle color differences
- **Beautiful UI** - Clean, modern design with gradient backgrounds

### 📊 Progress Tracking
- **Local Leaderboard** - Track your best scores for each level
- **Percentile Ranking** - See how you compare to other players
- **Star Ratings** - Earn up to 5 stars based on performance

### 🎯 Color Science
- **HSL Color Space** - Uses Hue, Saturation, Lightness for accurate color representation
- **Progressive Difficulty** - Colors get more similar as levels increase
- **Narrow Color Bands** - Each game focuses on a specific color range

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The game will be available at `http://localhost:5173`

## 🎮 How to Play

1. **Observe** - Look at the colored pencils presented in the box
2. **Drag** - Click and drag pencils to rearrange them (except the first one, which is fixed)
3. **Zoom** - Click on any pencil to zoom in and see subtle color differences
4. **Submit** - Click "Done!" when you think you've arranged them correctly
5. **Score** - See your accuracy compared to the AI's ideal sorting
6. **Progress** - Move to the next level to increase difficulty

## 🏆 Scoring System

Your arrangement is evaluated on three metrics:

- **Position Accuracy (40%)** - How close each pencil is to its ideal position
- **Order Accuracy (35%)** - How well you maintained relative ordering
- **Color Flow (25%)** - How smoothly colors transition from one to the next

## 🎨 Sorting Algorithm

The AI sorts pencils using a hierarchical approach:

1. **Primary**: By Hue (color wheel position)
2. **Secondary**: By Saturation (color intensity)
3. **Tertiary**: By Lightness (brightness)

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **@dnd-kit** - Drag-and-drop functionality
- **Framer Motion** - Smooth animations
- **Local Storage** - Leaderboard persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── Pencil.jsx/css          # Individual pencil component
│   ├── PencilBox.jsx/css       # Drag-and-drop container
│   ├── GameControls.jsx/css    # Level controls and buttons
│   ├── ScoreModal.jsx/css      # Results display
│   ├── Leaderboard.jsx/css     # Top scores display
│   └── InstructionsModal.jsx/css # Game instructions
├── utils/
│   ├── colorUtils.js           # Color generation and sorting
│   ├── scoreUtils.js           # Scoring algorithms
│   └── storageUtils.js         # LocalStorage management
├── App.jsx/css                 # Main app component
└── main.jsx                    # Entry point
```

## 🎯 Future Enhancements (React Native)

This game is designed to be easily ported to React Native for mobile:
- Replace `@dnd-kit` with `react-native-draggable-flatlist`
- Use `react-native-svg` for pencil graphics
- Implement `AsyncStorage` for leaderboard
- Add haptic feedback for drag interactions
- Add sound effects and background music

## 📄 License

MIT License - Feel free to use and modify!

## 🙏 Acknowledgments

Made with ❤️ for color enthusiasts and puzzle game lovers!
# renbo
