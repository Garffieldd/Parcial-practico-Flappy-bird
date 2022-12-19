


class Scene extends Phaser.Scene {

    constructor(){
        super('theGame')

        // Variables del juego
        this.score = 0;
        this.message = "Score: ";
        this.scoreMessage = this.score.toString();
        this.columnPosx = 1366
        this.columnPosy = 80
        this.columnSpeed = -500
        this.columnHitboxWidth = 100
        this.columnHitboxHeight = 50
        this.columnTopHitboxWidth = 100
        this.columnTopHitboxHeight = 191
        this.columnSpawnTime = 1500
        this.playerJumpPower = -300
        this.playerHitboxWidth = 112
        this.playerHitboxHeight = 60
        
    }
    
    // Carga de los assets
preload ()
    {

        this.load.setBaseURL('http://localhost/Flappy bird modificado');
        //Imagenes
        this.load.image('city', 'assets/images/_11zon.jpeg');
        this.load.spritesheet('player', 'assets/images/pajaro.png', {frameWidth: 112, frameHeight: 120});
        
        this.load.image('down1', 'assets/images/nidoo.png');
        this.load.image('up1', 'assets/images/nidoo1.png');
        this.load.image('down0', 'assets/images/nido.png');
        this.load.image('up0', 'assets/images/nido2.png');
        
        this.load.image('tube0', 'assets/images/tronco.png');
        this.load.image('tube1', 'assets/images/tronco2.png');

        //Musica
        this.load.audio('music', 'assets/sound/music.mp3')

        // Fuente
        this.load.bitmapFont('fire', 'assets/fonts/azo-fire.png', 'assets/fonts/azo-fire.xml');
  
    };
// Creacion de los elementos del videojuego
 create ()
    {
        
        this.music = this.sound.add('music');
        this.music.loop = true;
        this.music.play();

        this.background = this.add.tileSprite(config.width/2,config.height/2,config.width,config.height, 'city').
        setScrollFactor(0);
        
        this.player = this.physics.add.sprite(300, 200, 'player');
        this.player.setSize(this.playerHitboxWidth,this.playerHitboxHeight);
        
        this.music.play();
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 1}),
            frameRate: 7,
            repeat: -1,
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', {start: 1, end: 2}),
            frameRate: 7,
            repeat: 1,
        });

        this.player.play('fly');


        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 32) {
                this.jump();
            }
        });

        this.input.on('pointerdown', () => this.jump());

        this.player.on('animationComplete', this.animationComplete, this) ;

        this.player.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;

        /*
        const text = this.add.bitmapText(1100, 640, 'fire' , this.message.concat(this.scoreMessage), 35);
        text.setTint(0xff00ff, 0xffff00, 0x00ff00, 0xff0000);
        text.setDepth(2);
        */      
        
        this.newColumn();
        this.resetGame();

    }


    
    // metodo que hace saltar al personaje
    jump() 
    {
       this.player.setVelocityY(this.playerJumpPower);
       this.player.play('jump');
   }

   // metodo que decide cuando el personaje cambia de una animacion a otra
   animationComplete(animation, frame, sprite){
       if(animation.key === 'jump') {
           this.player.play('fly');
       }
   }


 // metodo que va actualizando el fondo a medida que pasa el tiempo
 update(time)
    {
       this.background.tilePositionX= time*0.1
       
    }


    

    // metodo que crea las columnas
    
    newColumn(){
        const column = this.physics.add.group();
        const hole = Math.floor(Math.random() * 5) + 1;
        const random = Math.floor(Math.random() * 2);
        
        for (let i = 0; i < 9; i++) {
            if (i !== hole && (i !== hole + 1) && i !== (hole - 1)){
                let cube;
                if (i == hole - 2){
                    cube = column.create(this.columnPosx, i * this.columnPosy, `up${random}`);
                    cube.setSize(this.columnHitboxWidth,this.columnHitboxWidth,true);
                    cube.setDepth(1);
                }else if (i == hole + 2) {
                    cube = column.create(this.columnPosx, i * this.columnPosy, `down${random}`);
                    cube.setSize(this.columnHitboxWidth,this.columnHitboxHeight,true);
                    cube.setDepth(1);
                }else{
                cube = column.create(this.columnPosx, i * this.columnPosy, `tube${random}`);
                cube.setSize(this.columnTopHitboxWidth,this.columnTopHitboxHeight,true);
                }
                cube.body.allowGravity = false; 

                //this.position = this.column.x
            }
        }
        column.setVelocityX(this.columnSpeed);
        
        column.checkWorldBounds = true;
        column.outOfBoundsKill = true;
        
        
        this.time.delayedCall(this.columnSpawnTime, this.newColumn, [], this);
        this.physics.add.overlap(this.player, column, this.columnHit, null, this);

    };
    

    // metodo que iba a incrementar el score pero no se implemento por falta de tiempo
    /*
    incrementScore(){ 
        if (this.player.x == this.position){
        this.score++
        }
        
    }
    */

    // Metodo que se activa si el jugador toca una columna 
    columnHit(){
        this.music.stop();
        this.scene.start('GameOver');
    }
    // Metodo que define que si te sales del mapa el juego se acaba
    resetGame(){
        this.physics.world.on('worldbounds', (body) => {
            this.music.stop();
            this.scene.start('GameOver');
        }); 
    }

}    

class FinalScene extends Phaser.Scene {
    constructor(){
        super('GameOver');
    }
    
    // Carga de los assets del Game over
    preload()
    {
        this.load.setBaseURL('http://localhost/Flappy bird modificado');
        this.load.image('gameover','assets/images/gameover.png');
    }

    //Creacion de la pantalla del Game Over
    create()
    {
        this.add.sprite(config.width/2,config.height/2, 'gameover')
        this.input.on('pointerdown',() => this.playAgain())
    }

    

    //metodo que se activa si el jugador da click a la pantalla (se reinicia el juego)
    playAgain(){
        this.scene.start('theGame');
    }
}



