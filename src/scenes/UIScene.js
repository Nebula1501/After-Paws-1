export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    this.isTaskboardOpen = false;

    // Get reference to house scene
    this.houseScene = this.scene.get('HouseScene');

    // Create taskboard container (hidden by default)
    this.createTaskboard();

    // ESC key to close taskboard
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  createTaskboard() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Container for all taskboard elements
    this.taskboardContainer = this.add.container(0, 0);
    this.taskboardContainer.setDepth(1000);
    this.taskboardContainer.setVisible(false);

    // Semi-transparent dark overlay
    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    this.taskboardContainer.add(this.overlay);

    // Main taskboard background (sticky note style)
    this.taskboardBg = this.add.rectangle(width / 2, height / 2, 700, 550, 0xffeb9e);
    this.taskboardBg.setStrokeStyle(4, 0x8b7355);
    this.taskboardContainer.add(this.taskboardBg);

    // Title
    this.taskboardTitle = this.add.text(width / 2, height / 2 - 240, 'Things to do...', {
      font: 'bold 32px Arial',
      fill: '#333333',
      align: 'center'
    });
    this.taskboardTitle.setOrigin(0.5, 0.5);
    this.taskboardContainer.add(this.taskboardTitle);

    // Paw print decoration (memory of cat)
    this.pawPrint = this.add.text(width / 2 + 280, height / 2 - 220, '🐾', {
      font: '24px Arial'
    });
    this.pawPrint.setAlpha(0.3);
    this.taskboardContainer.add(this.pawPrint);

    // Task list container
    this.taskListContainer = this.add.container(width / 2 - 300, height / 2 - 180);
    this.taskboardContainer.add(this.taskListContainer);

    // Close instruction
    this.closeText = this.add.text(width / 2, height / 2 + 260, 'Press ESC to close', {
      font: '18px Arial',
      fill: '#666666',
      align: 'center'
    });
    this.closeText.setOrigin(0.5, 0.5);
    this.taskboardContainer.add(this.closeText);

    // Task text objects (will be populated dynamically)
    this.taskTexts = [];
  }

  openTaskboard() {
    if (this.isTaskboardOpen) return;

    this.isTaskboardOpen = true;
    this.taskboardContainer.setVisible(true);

    // Pause player movement
    this.houseScene.setPlayerMovement(false);

    // Update task list
    this.updateTaskList();

    // Fade in effect
    this.taskboardContainer.setAlpha(0);
    this.tweens.add({
      targets: this.taskboardContainer,
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });
  }

  closeTaskboard() {
    if (!this.isTaskboardOpen) return;

    this.tweens.add({
      targets: this.taskboardContainer,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.isTaskboardOpen = false;
        this.taskboardContainer.setVisible(false);

        // Resume player movement
        this.houseScene.setPlayerMovement(true);
      }
    });
  }

  updateTaskList() {
    // Clear existing task texts
    this.taskTexts.forEach(text => text.destroy());
    this.taskTexts = [];

    // Get tasks from TaskManager
    const taskManager = this.houseScene.taskManager;
    const tasks = taskManager.getTasks();

    let yOffset = 0;

    tasks.forEach((task, index) => {
      // Determine color and checkbox based on state
      let noteColor = 0xffffaa; // Yellow = pending
      let checkbox = '☐';
      let strikethrough = false;

      if (task.isComplete) {
        noteColor = 0xaaffaa; // Green = completed
        checkbox = '☑';
        strikethrough = true;
      } else if (task.inProgress) {
        noteColor = 0xaad4ff; // Blue = in progress
        checkbox = '▶';
      }

      // Note background
      const noteBg = this.add.rectangle(10, yOffset + 20, 580, 60, noteColor);
      noteBg.setStrokeStyle(2, 0x8b7355);
      this.taskListContainer.add(noteBg);

      // Task text
      let taskText = `${checkbox}  ${task.name}`;
      if (strikethrough) {
        taskText = `${checkbox}  ̶${task.name}̶`; // Strikethrough effect
      }

      const text = this.add.text(20, yOffset + 10, taskText, {
        font: task.isComplete ? 'italic 18px Arial' : 'bold 18px Arial',
        fill: task.isComplete ? '#666666' : '#333333',
        wordWrap: { width: 560 }
      });
      this.taskListContainer.add(text);

      // Task description (smaller)
      const descText = this.add.text(20, yOffset + 35, task.description, {
        font: '14px Arial',
        fill: '#555555',
        wordWrap: { width: 560 }
      });
      this.taskListContainer.add(descText);

      this.taskTexts.push(noteBg, text, descText);

      yOffset += 70;
    });
  }

  update() {
    // Check for ESC key to close taskboard
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      if (this.isTaskboardOpen) {
        this.closeTaskboard();
      }
    }
  }
}
