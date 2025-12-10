# After Paws

A short, emotional 2D narrative game built with Phaser 3.

## Story

You play as the spirit of a cat who recently passed away. Your owner struggles with a mental disorder and has fallen into emotional decline and neglect. As the ghost cat, you return to help him complete cleaning tasks, break him out of grief spirals, and guide him toward emotional improvement.

But healing is fragile... and the ending reveals a heartbreaking truth.

---

## How to Play

### Controls

- **Arrow Keys** or **WASD**: Move the cat spirit
- **SPACE**: Open the fridge taskboard (when near the fridge)
- **E**: Interact with objects to trigger cleaning tasks
- **ESC**: Close the fridge taskboard

### Gameplay Loop

1. Approach the **fridge** in the kitchen and press **SPACE** to view the task list
2. Find the required items around the messy house (broom, clothes, dishes, etc.)
3. Walk near an item and press **E** to trigger the owner to perform the task
4. Watch as the owner cleans and the house transforms
5. If the owner gets distracted by memories of you (near cat items), press **E** on the task item again to refocus him
6. Complete all tasks to trigger the ending

---

## Installation & Running

This is a Phaser Launcher project. To run:

1. Open the project folder in VS Code or your preferred IDE
2. Use the Phaser Launcher extension or run from the command line
3. Or simply open `index.html` in your browser (local file serving is fine since `phaser.js` is included)

**No build step required** - just open and play!

---

## Project Structure

```
After Paws/
├── index.html              # Game entry point
├── phaser.js               # Phaser 3 library (local)
├── assets/                 # All game art assets (PNGs)
│   ├── floor_wood.png
│   ├── Bathroom Tile.png
│   ├── walls.png
│   ├── bedroom items.png
│   ├── kitchen items.png
│   ├── living_room items.png
│   ├── bathroom items.png
│   ├── cat_front.png
│   ├── cat_back.png
│   ├── Human_front.png
│   ├── Human_back.png
│   └── ... (and other props/dirt sprites)
│
└── src/
    ├── main.js             # Game initialization
    │
    ├── scenes/
    │   ├── PreloadScene.js # Asset loading
    │   ├── IntroScene.js   # Opening narrative
    │   ├── HouseScene.js   # Main gameplay scene
    │   └── UIScene.js      # Fridge taskboard UI
    │
    └── systems/
        ├── TaskManager.js          # Task tracking & completion
        ├── InteractionManager.js   # Object interaction logic
        ├── DistractionManager.js   # Grief episode mechanics
        └── EndingManager.js        # Final cutscene sequence
```

---

## Game Design

This game is based on a complete **Game Design Document (GDD)** that defines:

- **No combat, no enemies** – pure emotional narrative gameplay
- **8 cleaning tasks** the owner must complete with your guidance
- **Distraction/grief mechanics** where the owner pauses near cat-related objects
- **Environmental storytelling** – the house transforms from messy to clean
- **Emotional twist ending** that subverts expectations

---

## Tasks in the Game

1. **Make the bed** – Straighten the messy bedsheets
2. **Pick up clothes** – Gather scattered clothing from the bedroom
3. **Organize books** – Put books back on the shelf
4. **Sweep the floor** – Clean dirt from the living room
5. **Wipe the table** – Remove stains from the coffee table
6. **Throw away chips** – Clean up trash and chip bags
7. **Wash dishes** – Clean dirty plates and utensils
8. **Take out trash** – Remove boxes and garbage

---

## Customization & Tweaking

### Adjusting Positions

If asset alignment doesn't match the floor plan perfectly, you can adjust positions in [src/scenes/HouseScene.js](src/scenes/HouseScene.js):

- Look for `createFloors()`, `createWalls()`, `createFurniture()`, etc.
- Modify the coordinates to match your layout

### Adjusting Collision Bodies

Collision rectangles are defined in [src/scenes/HouseScene.js](src/scenes/HouseScene.js):

- `wallColliders` – wall boundaries
- `furnitureColliders` – solid furniture (bed, sofa, fridge, etc.)

Update the `.create(x, y, null).setSize(width, height)` calls to match your layout.

### Adjusting Task Items

Tasks are defined in [src/systems/TaskManager.js](src/systems/TaskManager.js):

- Each task has a `requiredItemKey` (which sprite triggers it)
- `targetLocation` (where owner walks to perform the task)
- `onComplete()` callback (visual changes when task finishes)

### Adjusting Distraction Triggers

Distraction points (cat bowl, toys, etc.) are defined in [src/systems/DistractionManager.js](src/systems/DistractionManager.js):

- Update the `distractionTriggers` array with proper coordinates based on your floor plan

---

## Technical Notes

### Asset Loading

All assets are loaded from the `assets/` folder with proper key names:

- Floor tiles: `floorWood`, `bathroomTile`
- Walls: `walls`
- Room furniture: `bedroomItems`, `kitchenItems`, `livingRoomItems`, `bathroomItems`
- Props: `chips`, `clothes`, `books`, `broom`, `plates`, `utensils`, etc.
- Characters: `catFront`, `catBack`, `humanFront`, `humanBack`

### Collision & Physics

- Uses **Phaser Arcade Physics** for top-down movement
- Static collision bodies for walls and large furniture
- Player (cat) and NPC (owner) both have collision detection

### Camera System

- Camera follows the cat spirit with smooth lerp
- Viewport: 1024x768 pixels
- World bounds: 2000x2000 pixels (adjustable based on final house size)

---

## Troubleshooting

### Assets don't align properly

- Check the floor plan screenshot and adjust sprite positions in `HouseScene.js`
- All assets are initially placed at (0, 0) with `setOrigin(0, 0)` – adjust as needed

### Collision feels wrong

- Adjust the collision body sizes in `HouseScene.js` (`furnitureColliders` and `wallColliders`)
- Make sure collision bodies match the visual positions of furniture

---

**Enjoy the emotional journey of After Paws.** 🐾
