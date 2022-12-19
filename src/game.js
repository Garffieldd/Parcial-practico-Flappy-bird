

const config = {
    type: Phaser.WEBGL,
    width: 1366,
    height: 683,   
    scene: [Scene,FinalScene],
    scale: { 
        mode:Phaser.Scale.FIT} ,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 500},
        },
    },
};
var game = new Phaser.Game(config);


