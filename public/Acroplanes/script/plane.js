(function(window){
    function Plane(planeBitmap){
        this.initialize(planeBitmap);
    }
    Plane.prototype = new createjs.Container();

    Plane.prototype.container_initialize = Plane.prototype.initialize;

    Plane.prototype.initialize = function(planeBitmap) {
        this.container_initialize();
        this.name = 'player';
        this.setBounds(0, 0, settings.plane.width, settings.plane.height);
        this.width = settings.plane.width;
        this.height = settings.plane.height/2;
        this.regX = settings.plane.width/2;
        this.regY = settings.plane.height/2;
        this.x = Math.floor(Math.random()*(settings.width-1000));
        this.y = 3993;
        this.vel = 0;
        this.velX = 0;
        this.velY = -0;
        this.rotation = 0;
        this.velRotation = 0;
        this.cursorRotation = 0;
        this.health = 100;
        this.engineOn = false;
        this.landed = true;
        this.landedLeft = false;
        this.readyToFire = false;
        this.score = new Object();
        this.score.points = 0;  //Your points for taking down planes and whatnot
        this.score.deaths = 0;  //The number of your deaths (!)this round
        this.score.kills = 0;   //The number of planes taken down
        this.score.accuracy = 0.5;  //How good you are. Each time you shoot, this number changes (theoretically)
        this.score.bulletsShot = 0; //How many bullets you have fired
        this.score.bulletsLanded = 0; //How many have hit the (a) target
		//this.addEventListener("click", function(event) { alert("clicked"); })
        var test = new TestUI();
        test.name = 'test';
        test.x = settings.plane.width/2;
        test.y = settings.plane.height/2;
        this.test = test;
        this.test.shotFrom = 0;
			//this.addChild(test);
        this.addChild(planeBitmap);
        assets.tickArray.push(this);
        assets.targets.push(this);
        stage.setChildIndex(this, stage.getNumChildren()-1);
        this.damage = damage;
        this.die = die;
        this.gravity = new Force();
        this.gravity.apply = function(plane){
            plane.velY += 0.1;//*Math.abs(((settings.plane.maxVel - Math.abs(plane.velX))/settings.plane.maxVel)-1);
            //console.log("GravMult: " + Math.abs((settings.plane.maxVel - Math.abs(plane.velX))/settings.plane.maxVel-1));
        }
    }
    Plane.prototype.tick = function(){
//------//----Testing UI----//
        this.test.rotation = -this.velRotation;
        this.test.xLine.set(this.velX, true);
        this.test.yLine.set(this.velY, false);
        if (!this.test.xLine.isRed && (Math.abs(this.velX) > 10)) this.test.xLine.changeColor('red');
        if (this.test.xLine.isRed && (Math.abs(this.velX) < 10)) this.test.xLine.changeColor('green');
        if (!this.test.yLine.isRed && (Math.abs(this.velY) > 5)) this.test.yLine.changeColor('red');
        if (this.test.yLine.isRed && (Math.abs(this.velY) < 5)) this.test.yLine.changeColor('green');

        
//------//----Rotating the plane----//
        //Pointing the nose down to the ground causes the plane to explode on runway.
        //Pointing the nose to the 60^ makes the plane run on the ground without dying.
        if(this.landed){
            if(this.velRotation > 90){
                this.cursorRotation = 240;
            }
            else this.cursorRotation = -60;
        }
        else this.cursorRotation = -Math.atan2(assets.mouse.x - this.x-assets.world.x, assets.mouse.y - this.y-assets.world.y)*180/Math.PI+90;
        this.velRotation = -Math.atan2(this.velX, this.velY)*180/Math.PI+90;
        this.vel = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));
        this.vel -= Math.abs(0.01*this.vel*Math.sin((this.cursorRotation-this.velRotation) * (Math.PI/180))); //Redo this one. This is very crude.
        
        if(Math.abs(this.cursorRotation-this.velRotation)>=180){
            //console.log('this.cursorRotation: ' + this.cursorRotation);
            //console.log('this.velRotation:before: ' + this.velRotation);
            if(this.cursorRotation>this.velRotation) this.velRotation+=360;
            else this.velRotation-=360;
            //console.log('this.velRotation:after: ' + this.velRotation);
        }
        if(this.vel>1){
            this.velRotation = (this.velRotation + ((this.cursorRotation-this.velRotation)*(Math.pow(this.vel, 2.2)/(settings.plane.maxVel+3000))));
            //this.velRotation = (this.velRotation + (this.cursorRotation-this.velRotation)*0.7*(this.vel/(settings.plane.maxVel+200)));
             //console.log('+vel: ' + this.vel + '\nrotation: ' + this.cursorRotation + '\nvelRotation: ' + this.velRotation);
        } /*else if(this.vel = 0 && this.landed) {
            if(this.landedLeft){
                this.velRotation = 180;
                //console.log('Landed left!');
            }
            else{
                this.velRotation = 0;
                //console.log('Landed right!');
            }
            //this.velRotation = (this.velRotation + (this.cursorRotation-this.velRotation)*(this.vel/1000));
        }*/ //----Stopped here----//
        this.rotation = this.velRotation;
//------//----Moving the plane----//
        //Calculating this.vel
        if(this.vel<settings.plane.maxVel && this.engineOn){
            this.vel+=0.1;
        }
        else if(this.vel>0) this.vel-=0.005*this.vel; //Suspends the plane in the air.
        
//------//Velocity Y
        this.velY = ((Math.sin(this.velRotation * (Math.PI/180))) * this.vel);
        if(this.y+settings.plane.height/2 < settings.height-settings.ground.height){
            //if(this.vel<2){
                //this.velY += (pitch>1) ? 1/pitch : 1/pitch;
                this.gravity.apply(this);
            //}
        }
        else if(this.velY>0){
            this.velY = 0;
            this.y = settings.height-settings.ground.height-this.height;
            //this.vel = ((Math.cos(this.velRotation * (Math.PI/180))) * this.vel);
        }
        else if(this.velY<0 && Math.abs(this.velX) < 8){
            this.velY = 0;
            this.y = settings.height-settings.ground.height-this.height;
        }
        this.y+=this.velY;
        
//------//Velocity X
        if((this.velX == 0) && (this.vel != 0) && (this.landed) && (this.landedLeft)){
            this.vel = -this.vel;
        } //----Stopped here----//
        this.velX = ((Math.cos(this.velRotation * (Math.PI/180))) * this.vel);
        
        if(settings.height-settings.ground.height-this.height-this.y < 0.5 && !this.engineOn){
            /*if(this.velX > 0.5) this.velX -= 0.05;
            else if(this.velX < -0.5) this.velX += 0.05;
            else{
                this.velX = 0;
            }*/
        }
        if((this.x < settings.width-settings.plane.width || this.velX<0) && (this.x-settings.plane.width > 0 || this.velX>0)){
            this.x+=this.velX;        
        }
        //Calculating collision with ground
        if (this.y >= (settings.height - settings.ground.height - settings.plane.height+3)) {
            if((this.velX > 10) || (this.velY > 5)){
                this.die();
            }
            if(!this.landed){
                this.landed = true;
                this.landedLeft = (this.rotation > 90) && (this.rotation < 360);
                console.log('this.rotation: ' + this.rotation);
                console.log('Left?: ' + this.landedLeft);
            }
            //constantly set fire to false while on ground in case of of the timeouts set it to 'true'.
            this.readyToFire = false;
            if(this.velX < 1){
                //If plane stopped, keep plane horizontal
                if(this.landedLeft){
                    this.rotation = 180;
                    //console.log('Landed left!');
                }
                else{
                    this.rotation = 0;
                    //console.log('Landed right!');
                }
            }
            if(!this.engineOn){
                if(this.velX > 0.5) this.velX -= 0.05;
                else if(this.velX < -0.5) this.velX += 0.05;
                else{
                    this.velX = 0;
                }
            }
        }
        else{
            if(this.landed) this.readyToFire = true;
            this.landed = false;
        }
        
        //----Stopped here----//
        
        
        if(assets.mouse.leftButtonDown) mouseDown();
//------//Moving the world with the plane
        assets.world.x = canvas.width/2 - this.x;
        assets.world.y = canvas.height/2 - this.y;
        if(assets.world.x>0) assets.world.x = 0;
        if(assets.world.y>0) assets.world.y = 0;
        if(assets.world.x<canvas.width-settings.width) assets.world.x = canvas.width-settings.width;
        if(assets.world.y<canvas.height-settings.height) assets.world.y = canvas.height-settings.height;
    }
    function mouseDown(){
        if(assets.plane.readyToFire){
            var bullet = new Bullet(assets.plane.x+((Math.cos(assets.plane.velRotation * (Math.PI/180))) * (assets.plane.width/8)), assets.plane.y+((Math.sin(assets.plane.velRotation * (Math.PI/180))) * (assets.plane.width/8)), assets.plane.velRotation, assets.plane.name);
            assets.plane.test.shotFrom++;
            if(assets.plane.test.shotFrom>360) assets.plane.test.shotFrom = 0;
            assets.world.addChild(bullet);
            assets.plane.readyToFire = false;
            assets.plane.score.bulletsShot++;
            
            window.setTimeout(function(){assets.plane.readyToFire = true;}, settings.plane.fireRate);
        }
    }
    function die(){
        console.log('Died dead ' + (this.score.deaths+1) + ' times!');
        console.log('accuracy: ' + this.score.accuracy);
        this.score.deaths++;
        this.score.points += settings.score.multipliers.death;
        assets.UI.setDeaths(this.score.deaths);
        assets.UI.setPoints(this.score.points);
        this.x = Math.floor(Math.random()*(settings.width-1000));
        this.y = 3993;
        this.vel = 0;
        this.velX = 0;
        this.velY = -0;
        this.rotation = 0;
        this.velRotation = 0;
        this.engineOn = false;
        this.health = 100;
        assets.UI.setHealth(100);
        assets.UI.setEngineLight(false);
    }
    function damage(n){
        /* this.health -= n;
        assets.UI.setHealth(this.health);
        if(this.health <= 0){
            this.die();
            return true;
        }
        else return false; */
    }
    window.Plane = Plane;
} (window));