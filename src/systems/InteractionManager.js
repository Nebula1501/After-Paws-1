export default class InteractionManager {
  constructor(scene) {
    this.scene = scene;
    this.interactionRadius = 60; // Distance within which cat can interact with objects
  }

  checkInteraction(cat, owner) {
    // Don't allow interaction if owner is busy or if in distraction state
    if (this.scene.ownerState === 'walking' || this.scene.ownerState === 'cleaning') {
      return;
    }

    // Check if player is in distraction mode
    if (this.scene.distractionManager.isDistracted) {
      // Re-interact with task item to refocus owner
      this.scene.distractionManager.refocusOwner();
      return;
    }

    // Check distance to each interactable prop
    const taskManager = this.scene.taskManager;
    const props = this.scene.interactableProps;

    for (let key in props) {
      const prop = props[key];
      if (!prop || !prop.visible) continue;

      const distance = Phaser.Math.Distance.Between(cat.x, cat.y, prop.x, prop.y);

      if (distance < this.interactionRadius) {
        // Check if this prop is associated with a task
        const task = taskManager.getTaskByItemKey(key);

        if (task) {
          // Trigger the task
          this.triggerTask(task, owner);
          return;
        }
      }
    }

    // Also check dirt sprites (they might not be in interactableProps)
    const dirtSprites = this.scene.dirtSprites;
    for (let key in dirtSprites) {
      const dirt = dirtSprites[key];
      if (!dirt || !dirt.visible) continue;

      const distance = Phaser.Math.Distance.Between(cat.x, cat.y, dirt.x, dirt.y);

      if (distance < this.interactionRadius) {
        const task = taskManager.getTaskByItemKey(key);
        if (task) {
          this.triggerTask(task, owner);
          return;
        }
      }
    }
  }

  triggerTask(task, owner) {
    console.log(`Triggering task: ${task.name}`);

    // Mark task as in progress
    this.scene.taskManager.setTaskInProgress(task.id);

    // Show brief message
    this.showInteractionMessage(`${task.name}...`);

    // Move owner to task location
    this.scene.moveOwnerToLocation(task.targetLocation.x, task.targetLocation.y, () => {
      // Owner performs cleaning animation (for now, just a delay)
      this.performCleaningAnimation(owner, task);
    });
  }

  performCleaningAnimation(owner, task) {
    // Placeholder: simple animation - could add sprite changes, particles, etc.
    const originalY = owner.y;

    // Bobbing motion to simulate cleaning action
    this.scene.tweens.add({
      targets: owner,
      y: originalY - 10,
      duration: 300,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Task complete
        this.scene.taskManager.completeTask(task.id);
        this.scene.ownerState = 'idle';

        // Show owner dialogue
        this.showOwnerDialogue(this.getTaskCompletionDialogue(task));
      }
    });
  }

  getTaskCompletionDialogue(task) {
    const dialogues = [
      "That feels... a little better.",
      "One step at a time...",
      "I can do this.",
      "It's coming together.",
      "Maybe I can manage this.",
      "A bit of progress..."
    ];

    return dialogues[Math.floor(Math.random() * dialogues.length)];
  }

  showOwnerDialogue(text) {
    const owner = this.scene.owner;

    // Create dialogue bubble above owner
    const bubble = this.scene.add.container(owner.x, owner.y - 60);
    bubble.setDepth(100);

    const bubbleBg = this.scene.add.rectangle(0, 0, text.length * 8 + 20, 40, 0xffffff, 0.9);
    bubbleBg.setStrokeStyle(2, 0x333333);

    const bubbleText = this.scene.add.text(0, 0, text, {
      font: '14px Arial',
      fill: '#333333',
      align: 'center'
    });
    bubbleText.setOrigin(0.5, 0.5);

    bubble.add([bubbleBg, bubbleText]);

    // Fade out after delay
    this.scene.time.delayedCall(2500, () => {
      this.scene.tweens.add({
        targets: bubble,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          bubble.destroy();
        }
      });
    });
  }

  showInteractionMessage(text) {
    const cat = this.scene.cat;

    const message = this.scene.add.text(cat.x, cat.y - 50, text, {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 10, y: 5 }
    });
    message.setOrigin(0.5, 0.5);
    message.setDepth(90);
    message.setAlpha(0);

    this.scene.tweens.add({
      targets: message,
      alpha: 1,
      y: cat.y - 70,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.scene.time.delayedCall(1500, () => {
          this.scene.tweens.add({
            targets: message,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              message.destroy();
            }
          });
        });
      }
    });
  }
}
