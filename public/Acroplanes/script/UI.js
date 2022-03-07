(function(window){
    function UserInterface(shapeArray){
        this.initialize(shapeArray);
    }
    UserInterface.prototype = new createjs.Container();

    UserInterface.prototype.container_initialize = UserInterface.prototype.initialize;

    UserInterface.prototype.initialize = function(shapeArray) {
        this.container_initialize();
        this.name = 'userInterface';
        this.setBounds(0, 0, document.body.clientWidth, document.body.clientHeight);
        this.x = 0;
        this.y = 0;
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight;
        
        //for(var i=0; i<shapeArray.length; i++) this.addChild(shapeArray[i]);
        
        var healthBar = new createjs.Shape();
        healthBar.name = 'healthBar';
        healthBar.setBounds(50, 50, 120, 10);
        healthBar.x = 50;
        healthBar.y = 50;
        healthBar.alpha = 0.1;
        healthBar.width = 200;
        healthBar.height = 10;
        healthBar.graphics = new createjs.Graphics();
        healthBar.graphics.beginFill('gray');
        healthBar.graphics.drawRect(0, 0, 120, 10);
        this.healthBar = healthBar;
        
        var health = new createjs.Shape();
        health.name = 'health';
        health.setBounds(50, 50, 200, 10);
        health.x = 50;
        health.y = 50;
        health.width = 120;
        health.height = 10;
        health.alpha = 0.5;
        health.graphics = new createjs.Graphics();
        health.graphics.beginFill('red');
        health.graphics.drawRect(0, 0, 120, 10);
        this.health = health;
        this.setHealth = setHealth;
        
        this.addChild(healthBar);
        this.addChild(health);
        
        var engineLight = new createjs.Shape();
        engineLight.name = 'engineLight';
        engineLight.x = 33;
        engineLight.y = 55;
        engineLight.width = 10;
        engineLight.height = 10;
        engineLight.alpha = 0.1;
        engineLight.graphics = new createjs.Graphics();
        engineLight.graphics.beginFill('green');
        engineLight.graphics.drawCircle(0, 0, 5);
        this.engineLight = engineLight;
        this.setEngineLight = setEngineLight;
        
        this.addChild(engineLight);
        
        var points = new createjs.Text("Score: 0", settings.UI.font, settings.UI.fontColor);
        points.x = 50;
        points.y = 80;
        points.number = 0;
        points.textBaseline = "alphabetic";
        this.points = points;
        this.setPoints = setPoints;
        
        this.addChild(points);
        
        var deaths = new createjs.Text("Deaths: 0", settings.UI.font, settings.UI.fontColor);
        deaths.x = 40;
        deaths.y = 100;
        deaths.number = 0;
        deaths.textBaseline = "alphabetic";
        this.deaths = deaths;
        this.setDeaths = setDeaths;
        
        this.addChild(deaths);
        
        var kills = new createjs.Text("Kills: 0", settings.UI.font, settings.UI.fontColor);
        kills.x = 62;
        kills.y = 120;
        kills.number = 0;
        kills.textBaseline = "alphabetic";
        this.kills = kills;
        this.setKills = setKills;
        
        this.addChild(kills);
        
        
        stage.setChildIndex( this, stage.getNumChildren()-1);
    }
    UserInterface.prototype.tick = function(){
    }
    function setHealth(num){
        this.health.scaleX = num/100;
    }
    function setEngineLight(engineOn){
        if(engineOn) this.engineLight.alpha = 1;
        else this.engineLight.alpha = 0.1;
    }
    function setPoints(number){
        this.points.number = number;
        this.points.text = "Score: " + this.points.number;
    }
    function setDeaths(number){
        this.deaths.number = number;
        this.deaths.text = "Deaths: " + this.deaths.number;
    }
    function setKills(number){
        this.kills.number = number;
        this.kills.text = "Kills: " + this.kills.number;
    }
    window.UserInterface = UserInterface;
} (window));
