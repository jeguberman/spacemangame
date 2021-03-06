import MovingObject from './moving_object';
import Images from './images';
import merge from 'lodash/merge';

class Player extends MovingObject{

  constructor(options){
    options = merge(
      {
        pos:[120,300],
        vel:[0,0],
        acc:[0,0],
        term: 100,

        color:"#ff3333",

        name: "player"
      },
      options
    );
    super(options);

    this.jumpAcc = -15;
    this.walkAcc = 0.4;
    this.inJump = false;
    this.inWalk = false;
    this.Lbrake = true;
    this.Rbrake = true;
    this.breakConst = 0.75;
    this.leftFace = false;

    this.image = new Image();
    this.image.src = 'assets/mario_sprites.png';
    this.sprite = Images.marioFaceUp;

    this.deathFall = this.deathFall.bind(this);

    // this.static = true;

  }

  gameOver(){
    this.sprite = Images.marioDead;
    this.static = true;
    setTimeout(this.deathFall, 300);
    setTimeout(this.game.endGame, 1750);
  }

  deathFall(){
    this.static = false;
    this.vel[1] = -8;
    this.acc[1] = this.game.gravity;
  }

  verticalStop(obj){
    if(obj.name==="ground"){
      this.vel[1] = 0;
      this.acc[1] = 0;
      this.staticBlock(()=>{
        this.footCorrect(obj);
      });
    }
  }

  speedLessThanMaxGround(){
    if(this.vel[0] < this.maxGround && this.vel[0] > this.maxGround*-1){
      return true;
    }else{
      return false;
    }
  }

  footCheck(){
    const foot = this.pos[1]+this.sprite.height;
    return (foot < 321 && foot >319);
  }

  jump(){
    if(!this.inJump && this.footCheck()){
      this.vel[1] = this.vel[1]+this.jumpAcc;
      this.inJumpOn();
    }
  }

  inJumpOn(){
    this.inJump = true;
      if(this.leftFace){
        this.changeSprite(Images.marioJumpLeft);
      }else{
        this.changeSprite(Images.marioJumpRight);
      }

  }

  outJump(){
    if ( this.vel[1] < 0 ) {
      this.vel[1] = 0;
    }
    this.inJump = false;
    if(this.leftFace){
      this.changeSprite(Images.marioStandLeft);
    }else{
      this.changeSprite(Images.marioStandRight);
    }
  }


  Lwalk(){
    if(!this.game.gameOver){
      if(this.inJump){
        this.changeSprite(Images.marioJumpLeft);
      }else{
        this.changeSprite(Images.marioStandLeft);
      }
    if(this.speedLessThanMaxGround){
      if(this.vel[0] > 0){this.vel[0]=0.7;}
      this.acc[0] = (this.walkAcc * -1);
    }
    this.LbrakeOff();
    this.leftFace = true;
  }
  }

  LbrakeOff(){
    this.Lbrake=false;
  }

  LbrakeOn(){
    this.Lbrake = true;
  }

  Rwalk(){
    if(!this.game.gameOver){
      if(this.inJump){
        this.changeSprite(Images.marioJumpRight);
      }else{
        this.changeSprite(Images.marioStandRight);
      }
    if(this.speedLessThanMaxGround){
      if(this.vel[0] < 0){this.vel[0]=-0.7;}
      this.acc[0] = (this.walkAcc);
    }
    this.RbrakeOff();
    this.leftFace = false;
  }
}

  RbrakeOff(){
    this.Rbrake=false;
  }

  RbrakeOn(){
    this.Rbrake = true;
  }

  brakeCheck(){
    if(this.Lbrake && this.vel[0]<0){
      this.acc[0] = this.acc[0]*this.breakConst;
      this.vel[0] = this.vel[0]*this.breakConst;
    }
    if(this.Rbrake && this.vel[0]>0){
      this.acc[0] = this.acc[0]*this.breakConst;
      this.vel[0] = this.vel[0]*this.breakConst;
    }

  }

  terminalVelocity(){
    if(this.vel[1] > this.term){
      this.vel[1] = this.term;
    }
    if(this.vel[0] > this.maxGround){
      this.vel[0] = this.maxGround;
    }
    if(this.vel[1] < this.term * -1){
      this.vel[1] = this.term * -1;
    }
    if(this.vel[0] < this.maxGround * -1){
      this.vel[0] = this.maxGround * -1;
    }
  }

  move(delta){
    this.brakeCheck();
    this.vel = [(this.vel[0] + (delta * this.acc[0])), (this.vel[1] + (delta * this.acc[1]))];
    this.terminalVelocity();
    this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
    if(this.pos[1] > 436){
      this.game.triggerGameOver();
    }
  }




  changeSprite(newImage){
    this.sprite = newImage;
  }

  draw(ctx){
    ctx.save();
    ctx.fillStyle = this.color;
    // ctx.fillRect (this.pos[0], this.pos[1], this.sprite.width, this.sprite.height);
    ctx.drawImage(this.image, this.sprite.imageX, this.sprite.imageY, this.sprite.width, this.sprite.height, this.pos[0], this.pos[1], this.sprite.width, this.sprite.height);
    ctx.restore();
  }

}
module.exports = Player;
