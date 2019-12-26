var game = {
  running: true,
  width: 640,
  height: 360,
  score: 0,
  sprites: { platform: undefined, background: undefined, block: undefined, ball: undefined},
  ball: {},
  platform: {},
  blocks: [],
  rows: 4,
  cols: 8,
  init: function(){
    this.ctx = document.getElementById("mycanvas").getContext("2d");
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    window.addEventListener('keydown', function(e){
      if ( e.keyCode == 32 ) {
        game.platform.releaseBall();
      } else if ( e.keyCode == 37 ) {
        game.platform.dx = -game.platform.velocity;
      } else if ( e.keyCode == 39 ) {
        game.platform.dx = game.platform.velocity;
      }
    });
    window.addEventListener('keyup', function(e){
      game.platform.stop();
    });
  },
  preload: function(){
    for (var key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = 'docs/images/' + key + '.png';
    }
  },
  create: function(){
    for ( var row = 0; row < this.rows; row++ ) {
      for ( var col = 0; col < this.cols; col++ ) {
        this.blocks.push({
          x: 68 * col + 50,
          y: 36 * row + 35,
          width: 64,
          height: 32,
          isAlive: true
        });
      }
    }
  },
  update: function() {
    if ( this.ball.collide(this.platform) ) {
      this.ball.bumpPuddle(this.platform);
    }

    if( this.ball.dx || this.ball.dy ) {
      this.ball.move();
    }

    if( this.platform.dx ) {
      this.platform.move();
    }

    this.blocks.forEach(function(element, index){
      if ( element.isAlive ) {
        if( this.ball.collide(element) ) {
          this.ball.bumpBlock(element);
        }
      }
    }, this);

    this.ball.checkBounds();
  },
  render: function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.sprites.background, 0, 0);
    this.ctx.drawImage(this.sprites.ball, this.ball.width * this.ball.frame, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
    this.blocks.forEach(function(element){
      if ( element.isAlive ) {
        this.ctx.drawImage(this.sprites.block, element.x, element.y);
      }
    }, this);

    this.ctx.fillText('Score: ' + this.score, 15, this.height - 15);

  },
  run: function() {
    this.update();
    this.render();

    if (this.running) {
      window.requestAnimationFrame(function(){
        game.run();
      }); 
    }  
  },
  start: function(){
    this.init();
    this.preload();
    this.create();
    this.run();
  }
};