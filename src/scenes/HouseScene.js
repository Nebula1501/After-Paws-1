import TaskManager from '../systems/TaskManager.js';
import InteractionManager from '../systems/InteractionManager.js';
import DistractionManager from '../systems/DistractionManager.js';
import EndingManager from '../systems/EndingManager.js';

export default class HouseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HouseScene' });
  }

  create() {
    // Initialize systems
    this.taskManager = new TaskManager(this);
    this.interactionManager = new InteractionManager(this);
    this.distractionManager = new DistractionManager(this);
    this.endingManager = new EndingManager(this);

    // World bounds - set large enough for the house
    this.physics.world.setBounds(0, 0, 2000, 2000);

    // Build the house layers (bottom to top)
    this.createFloors();
    this.createWalls();
    this.createFurniture();
    this.createProps();
    this.createDirt();
    this.createCharacters();

    // Setup camera to follow cat
    this.cameras.main.startFollow(this.cat, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, 2000, 2000);
    this.cameras.main.setZoom(1);

    // Setup input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Start UI scene as overlay
    this.scene.launch('UIScene');

    // Player movement enabled flag
    this.playerCanMove = true;

    // Cat glow effect (spiritual)
    this.catGlowTween = this.tweens.add({
      targets: this.cat,
      alpha: 0.7,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createFloors() {
    // Load all floor tiles at (0,0) as specified
    this.floorWood = this.add.image(0, 0, 'floorWood').setOrigin(0, 0).setDepth(0);
    this.bathroomTile = this.add.image(0, 0, 'bathroomTile').setOrigin(0, 0).setDepth(0);
  }

  createWalls() {
    this.walls = this.add.image(0, 0, 'walls').setOrigin(0, 0).setDepth(10);

    // Create collision bodies for walls (red = bathroom, green = kitchen/living boundaries)
    // These are approximate based on the floor plan - adjust as needed
    this.wallColliders = this.physics.add.staticGroup();

    // Bathroom walls (red boundaries in image)
    this.wallColliders.create(50, 400, null).setSize(10, 400).setVisible(false); // Left wall
    this.wallColliders.create(400, 270, null).setSize(800, 10).setVisible(false); // Top bathroom wall
    this.wallColliders.create(400, 810, null).setSize(800, 10).setVisible(false); // Bottom wall

    // Kitchen walls (green boundaries)
    this.wallColliders.create(405, 540, null).setSize(10, 540).setVisible(false); // Kitchen left wall
    this.wallColliders.create(800, 270, null).setSize(800, 10).setVisible(false); // Top wall

    // Living room walls
    this.wallColliders.create(800, 0, null).setSize(10, 270).setVisible(false); // Living room divider

    // Outer boundaries
    this.wallColliders.create(1200, 400, null).setSize(10, 800).setVisible(false); // Right wall
    this.wallColliders.create(600, 0, null).setSize(1200, 10).setVisible(false); // Top outer wall
  }

  createFurniture() {
    // Load room furniture items
    this.bedroomItems = this.add.image(0, 0, 'bedroomItems').setOrigin(0, 0).setDepth(20);
    this.kitchenItems = this.add.image(0, 0, 'kitchenItems').setOrigin(0, 0).setDepth(20);
    this.livingRoomItems = this.add.image(0, 0, 'livingRoomItems').setOrigin(0, 0).setDepth(20);
    this.bathroomItems = this.add.image(0, 0, 'bathroomItems').setOrigin(0, 0).setDepth(20);

    // Bed variants (start with messy)
    this.bedMessy = this.add.image(0, 0, 'bedMessy').setOrigin(0, 0).setDepth(21);
    this.bedMessy.setVisible(true);
    this.bedNeat = this.add.image(0, 0, 'bedNeat').setOrigin(0, 0).setDepth(21);
    this.bedNeat.setVisible(false);

    // Create furniture collision bodies (approximate positions based on floor plan)
    this.furnitureColliders = this.physics.add.staticGroup();

    // Bedroom furniture
    this.furnitureColliders.create(150, 100, null).setSize(120, 80).setVisible(false); // Bed
    this.furnitureColliders.create(320, 80, null).setSize(60, 100).setVisible(false); // Bookshelf

    // Living room furniture
    this.furnitureColliders.create(670, 180, null).setSize(140, 60).setVisible(false); // Sofa
    this.furnitureColliders.create(670, 280, null).setSize(80, 50).setVisible(false); // Coffee table
    this.furnitureColliders.create(1050, 200, null).setSize(60, 60).setVisible(false); // Side table

    // Kitchen furniture
    this.furnitureColliders.create(550, 450, null).setSize(100, 60).setVisible(false); // Counter
    this.furnitureColliders.create(480, 420, null).setSize(50, 80).setVisible(false); // Fridge (important!)

    // Bathroom furniture
    this.furnitureColliders.create(220, 520, null).setSize(100, 60).setVisible(false); // Bathtub
    this.furnitureColliders.create(100, 380, null).setSize(40, 40).setVisible(false); // Toilet
  }

  createProps() {
    // Create all prop/clutter sprites
    this.chips = this.add.image(0, 0, 'chips').setOrigin(0, 0).setDepth(30);
    this.clothes = this.add.image(0, 0, 'clothes').setOrigin(0, 0).setDepth(30);
    this.boxes = this.add.image(0, 0, 'boxes').setOrigin(0, 0).setDepth(30);
    this.books = this.add.image(0, 0, 'books').setOrigin(0, 0).setDepth(30);
    this.plates = this.add.image(0, 0, 'plates').setOrigin(0, 0).setDepth(30);
    this.utensils = this.add.image(0, 0, 'utensils').setOrigin(0, 0).setDepth(30);
    this.broom = this.add.image(0, 0, 'broom').setOrigin(0, 0).setDepth(30);
    this.catItems = this.add.image(0, 0, 'catItems').setOrigin(0, 0).setDepth(30);
    this.stand = this.add.image(0, 0, 'stand').setOrigin(0, 0).setDepth(30);

    // Store references for interaction manager
    this.interactableProps = {
      chips: this.chips,
      clothes: this.clothes,
      boxes: this.boxes,
      books: this.books,
      plates: this.plates,
      utensils: this.utensils,
      broom: this.broom,
      bedMessy: this.bedMessy,
      bedNeat: this.bedNeat
    };
  }

  createDirt() {
    // Create dirt overlays (visible at start, will be hidden when cleaned)
    this.dirtSplashes = this.add.image(0, 0, 'dirtSplashes').setOrigin(0, 0).setDepth(25);
    this.livingroomDirt = this.add.image(0, 0, 'livingroomDirt').setOrigin(0, 0).setDepth(25);
    this.dirtyTableSplotches = this.add.image(0, 0, 'dirtyTableSplotches').setOrigin(0, 0).setDepth(25);

    // Store references for task completion
    this.dirtSprites = {
      dirtSplashes: this.dirtSplashes,
      livingroomDirt: this.livingroomDirt,
      dirtyTableSplotches: this.dirtyTableSplotches
    };
  }

  createCharacters() {
    // Create cat (player) - starts in kitchen
    this.cat = this.physics.add.sprite(550, 500, 'catFront');
    this.cat.setDepth(50);
    this.cat.setScale(1);
    this.cat.body.setSize(32, 32); // Adjust collision box size
    this.cat.setCollideWorldBounds(true);

    // Cat movement variables
    this.catSpeed = 150;
    this.catCurrentSprite = 'catFront';

    // Create owner (NPC) - starts in bedroom near bed
    this.owner = this.physics.add.sprite(180, 120, 'humanFront');
    this.owner.setDepth(50);
    this.owner.setScale(1);
    this.owner.body.setSize(32, 32);
    this.owner.setCollideWorldBounds(true);

    // Owner state
    this.ownerState = 'idle'; // idle, walking, cleaning, distracted
    this.ownerCurrentTask = null;

    // Setup collisions
    this.physics.add.collider(this.cat, this.wallColliders);
    this.physics.add.collider(this.cat, this.furnitureColliders);
    this.physics.add.collider(this.owner, this.wallColliders);
    this.physics.add.collider(this.owner, this.furnitureColliders);

    // Fridge position for taskboard interaction (approximate from floor plan)
    this.fridgePosition = { x: 480, y: 420, radius: 60 };
  }

  update() {
    if (!this.playerCanMove) {
      this.cat.setVelocity(0, 0);
      return;
    }

    // Cat movement
    this.handleCatMovement();

    // Check fridge interaction (SPACE key)
    this.checkFridgeInteraction();

    // Check item interactions (E key)
    if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this.interactionManager.checkInteraction(this.cat, this.owner);
    }

    // Update distraction manager
    this.distractionManager.update(this.owner);
  }

  handleCatMovement() {
    let velocityX = 0;
    let velocityY = 0;

    // Check arrow keys or WASD
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -this.catSpeed;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = this.catSpeed;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocityY = -this.catSpeed;
      this.cat.setTexture('catBack');
      this.catCurrentSprite = 'catBack';
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocityY = this.catSpeed;
      this.cat.setTexture('catFront');
      this.catCurrentSprite = 'catFront';
    }

    // Apply velocity
    this.cat.setVelocity(velocityX, velocityY);

    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      this.cat.body.velocity.normalize().scale(this.catSpeed);
    }

    // For left/right, keep current front/back sprite or flip if needed
    if (velocityX !== 0 && velocityY === 0) {
      this.cat.setFlipX(velocityX < 0);
    }
  }

  checkFridgeInteraction() {
    const distance = Phaser.Math.Distance.Between(
      this.cat.x, this.cat.y,
      this.fridgePosition.x, this.fridgePosition.y
    );

    if (distance < this.fridgePosition.radius && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      // Open taskboard
      this.scene.get('UIScene').openTaskboard();
    }
  }

  // Helper method to move owner to a location
  moveOwnerToLocation(x, y, onComplete) {
    this.ownerState = 'walking';

    const distance = Phaser.Math.Distance.Between(this.owner.x, this.owner.y, x, y);
    const duration = (distance / 100) * 1000; // Adjust speed as needed

    // Determine sprite based on direction
    if (y < this.owner.y) {
      this.owner.setTexture('humanBack');
    } else {
      this.owner.setTexture('humanFront');
    }

    this.tweens.add({
      targets: this.owner,
      x: x,
      y: y,
      duration: duration,
      ease: 'Linear',
      onComplete: () => {
        this.ownerState = 'cleaning';
        if (onComplete) {
          onComplete();
        }
      }
    });
  }

  // Method to lock/unlock player movement
  setPlayerMovement(canMove) {
    this.playerCanMove = canMove;
  }
}
