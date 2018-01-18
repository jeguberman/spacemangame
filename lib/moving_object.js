import merge from 'lodash/merge';




class MovingObject{

  constructor(options){
    options = merge(
      {
        pos:[0,0],
        vel:[0,0],
        acc:[0,0],
        term: 10,

        color:"#ffffff",
        width:10,
        height:10
      },
      options
    );

    this.pos = options.pos;
    this.vel = options.vel;
    this.acc = options.acc;
    this.term = options.term;

    this.game = options.game;
    this.color = options.color;
    this.width = options.width;
    this.height = options.height;

    this.xCenter = this.pos[0]+(this.width/2);
    this.yCenter = this.pos[1]+(this.height/2);
    this.xOrigin = (this.width/2) * -1;
    this.yOrigin = (this.height/2) * -1;
  }

  move(delta){

    this.vel = [this.vel[0] + this.acc[0], this.vel[1] + this.acc[1]];
    this.terminalVelocity();
    this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
    this.xCenter = this.pos[0]+(this.width/2);
    this.yCenter = this.pos[1]+(this.height/2);

  }

  accelerate(add,val){
    this.acc[add] += val;
  }

  terminalVelocity(){
    if(this.vel[1] > this.term){
      this.vel[1] = this.term;
    }
    if(this.vel[0] > this.term){
      this.vel[0] = this.term;
    }
    if(this.vel[1] < this.term * -1){
      this.vel[1] = this.term * -1;
    }
    if(this.vel[0] < this.term * -1){
      this.vel[0] = this.term * -1;
    }
  }


  draw(ctx){
    ctx.save();
    ctx.translate(this.xCenter, this.yCenter);
    ctx.fillStyle = this.color;
    ctx.fillRect (this.xOrigin, this.yOrigin, this.width, this.height);
    ctx.restore();
  }
}

module.exports = MovingObject;