export default class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Black background
    this.cameras.main.setBackgroundColor('#000000');

    // Opening narrative text from GDD section 3.1
    const narrativeLines = [
      'The owner has been living with a mental disorder',
      'that affects motivation, concentration,',
      'and emotional stability.',
      '',
      'The cat was his emotional anchor.',
      '',
      'The sudden death of the cat',
      'worsened his condition.',
      '',
      'The house fell into disarray —',
      'dirty dishes, messy clothes, unwashed spaces.',
      '',
      'In his grief, he stopped functioning.',
      '',
      'The cat\'s spirit returns',
      'to help him regain stability and hope.'
    ];

    // Create text objects with fade-in effect
    const textObjects = [];
    let yOffset = height / 2 - 200;

    narrativeLines.forEach((line, index) => {
      const text = this.add.text(width / 2, yOffset, line, {
        font: '22px Arial',
        fill: '#ffffff',
        align: 'center'
      });
      text.setOrigin(0.5, 0.5);
      text.setAlpha(0);
      textObjects.push(text);
      yOffset += 32;
    });

    // Fade in all text
    this.tweens.add({
      targets: textObjects,
      alpha: 1,
      duration: 2000,
      ease: 'Power2'
    });

    // Instruction text at bottom
    const continueText = this.add.text(width / 2, height - 80, 'Press SPACE to continue', {
      font: '18px Arial',
      fill: '#888888',
      align: 'center'
    });
    continueText.setOrigin(0.5, 0.5);
    continueText.setAlpha(0);

    // Fade in continue text after main narrative
    this.tweens.add({
      targets: continueText,
      alpha: 1,
      duration: 1000,
      delay: 2500,
      ease: 'Power2'
    });

    // Blinking effect for continue text
    this.tweens.add({
      targets: continueText,
      alpha: 0.3,
      duration: 800,
      delay: 3500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Wait for SPACE key to start game
    this.input.keyboard.once('keydown-SPACE', () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('HouseScene');
      });
    });
  }
}
