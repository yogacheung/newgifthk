// select levels stage 
function MainStageInit()
{	
    // init stage
    this.stage = new PIXI.Stage(0xffffff, true);		
    this.mainLogic = new MainLogic();
    this.isInited = false;

    // called when stage is show
    this.Fadein = function()
    {	
        this.mainLogic.Init(this.stage);
    }

    // called when stage is hide
    this.Fadeout = function(obj)
    {		
        this.mainLogic.Free();
    }

    this.Update = function()
    {
        this.mainLogic.Update();
    }

}

// e-card main logic
function MainLogic()
{
    this.rootContainer = undefined;
    this.objContainer = undefined;
    
    // objects
    this.starBackground = {"texture": undefined, "currentOffset": 0, "maxAmplitude":20};
    this.sun = {"texture":undefined, "effect":undefined, "startX":400, "startY":700};
    this.hills = {"texture": undefined, "startX": -40, "startY": 501};
    this.deer = {"main":undefined, "headDown": undefined, "on": false, "area": undefined};
    this.show = undefined;
    this.smoke = undefined;
    this.lights = undefined;    // lights on house
    this.letterBox = undefined; // letter box obj
    this.letter = undefined;    // letter itself
    this.detectMouse = undefined;   // 
    this.currentTick = 0;       // how many tics passed (need for 6sec delay before card is appeared)

    //this.stageFadeInEffect = undefined;

    this.Init = function(rootContainer)
    {
        this.rootContainer = rootContainer;
        this.objContainer = new PIXI.DisplayObjectContainer();
        this.objContainer.interactive = true;
        var hack = this;
        this.objContainer.mousemove = function(data)
        {
            var maxWidth = Screen.VirtualScrW / 2;
            var current = (data.global.x - maxWidth) / maxWidth; 
            hack.starBackground.currentOffset = hack.starBackground.maxAmplitude * (current - 1);   // from -1 .. 1 to -2 .. 0 
        };
        this.rootContainer.addChild(this.objContainer);

        // star background 
        this.starBackground.texture = new PIXI.Sprite.fromImage("./img/img/background.png");
        this.starBackground.texture.position.x = GlobalScale(-20);
        this.starBackground.texture.position.y = GlobalScale(0);
        this.objContainer.addChild(this.starBackground.texture);

        // sun 
        this.sun.texture = new PIXI.Sprite.fromImage("./img/img/sun.png");
        this.sun.texture.position.x = GlobalScale(this.sun.startX);
        this.sun.texture.position.y = GlobalScale(this.sun.startY);
        this.sun.texture.anchor.x = 0.5;
        this.sun.texture.anchor.y = 0.5;
        this.objContainer.addChild(this.sun.texture);
        this.sun.effect = new FadeInOut();
        this.sun.effect.Init(this.sun.texture.position.y, GlobalScale(240), GlobalScale(-7));
        
        // hills
        this.hills.texture = new PIXI.Sprite.fromImage("./img/img/hills.png");
        this.hills.texture.position.x = GlobalScale(this.hills.startX);
        this.hills.texture.position.y = GlobalScale(this.hills.startY);
        this.objContainer.addChild(this.hills.texture);

        // background 
        var background = new PIXI.Sprite.fromImage("./img/img/background_bottom.jpg");
        background.position.x = GlobalScale(0);
        background.position.y = GlobalScale(852);
        this.objContainer.addChild(background);

        // foreground mask 
        var foreground = new PIXI.Sprite.fromImage("./img/img/background_middle.png");
        foreground.position.x = GlobalScale(0);
        foreground.position.y = GlobalScale(474);
        this.objContainer.addChild(foreground);
       
        // init letter box
        this.letterBox = new LetterBox();
        this.letterBox.Init(this.objContainer, 
            function(data){
                SoundManager.PlayContiniousSound("maintheme");
                data.letter.Show();
            }, this);
        


        // smoke 
        var smokeParticleDesc = new function(){}; 
        smokeParticleDesc.Count = 20;	// particle number
        smokeParticleDesc.particleArea = {"X": GlobalScale(304), "Y":GlobalScale(412), "W":GlobalScale(20), "H":GlobalScale(300)};
        smokeParticleDesc.SpeedX = {"Min":-0.1, "Max":0.1};	// min-max speed
        smokeParticleDesc.SpeedY = {"Min":-0.7, "Max":-1.3};	// min-max speed
        smokeParticleDesc.Scale = {"Min":0.3, "Max":0.5};	// min-max scale factor
        smokeParticleDesc.ScaleFade = {"From":1.0, "To":6.0};	// Scale fade during lifetime in persents from this.Scale !!!
        smokeParticleDesc.Alpha = {"Min":0.6, "Max":0.9};	//min-max alpha
        smokeParticleDesc.AlphaFade = {"From":1.0, "To":0.0};	// alfa fade during lifetime in percents from this.Alpha !!!!!
        smokeParticleDesc.RotationSpeed = {"Min":0.001, "Max":0.005};	// rotation speed
        smokeParticleDesc.CloudTexture = new Array("./img/img/smoke1.png", "./img/img/smoke2.png","./img/img/smoke3.png");
        this.smoke = new ShowParticles();
        this.smoke.Init(this.objContainer, smokeParticleDesc);

        // foreground mask 
        var fluePipeCap = new PIXI.Sprite.fromImage("./img/img/flue_pipe.png");
        fluePipeCap.position.x = GlobalScale(286);
        fluePipeCap.position.y = GlobalScale(689);
        this.objContainer.addChild(fluePipeCap);
        
        // lights animation
        var lightsTextures = [];
        lightsTextures.push("./img/img/red.png");
        lightsTextures.push("./img/img/yellow.png");
        lightsTextures.push("./img/img/blue.png");

        this.lights = PIXI.MovieClip.fromImages(lightsTextures);
        this.lights.position.x = GlobalScale(328);
        this.lights.position.y = GlobalScale(768);
        this.objContainer.addChild(this.lights);
        this.lights.animationSpeed = 0.02;
        this.lights.play();

        // deer
        this.deer.main = new PIXI.Sprite.fromImage("./img/img/deer.png");
        this.deer.main.position.x = GlobalScale(166);
        this.deer.main.position.y = GlobalScale(1034);
        this.deer.main.anchor.x = 0.5;
        this.deer.main.anchor.y = 0.5;
        this.objContainer.addChild(this.deer.main);

        this.deer.headDown = new PIXI.Sprite.fromImage("./img/img/deer_head_down.png");
        this.deer.headDown.position.x = GlobalScale(166);
        this.deer.headDown.position.y = GlobalScale(1034);
        this.deer.headDown.anchor.x = 0.5;
        this.deer.headDown.anchor.y = 0.5;
        this.deer.headDown.visible = false;
        this.objContainer.addChild(this.deer.headDown);

        this.deer.area = new PIXI.DisplayObjectContainer();
        this.deer.area.interactive = true;
        this.deer.area.hitArea = new PIXI.Rectangle(120, 966, 96, 116);
        var hack = this;
        this.deer.area.mouseout = function()
        {
            hack.deer.main.visible = true;
            hack.deer.headDown.visible = false;
        }
        this.deer.area.mouseover = function()
        {
            hack.deer.main.visible = false;
            hack.deer.headDown.visible = true;
        }
        this.objContainer.addChild(this.deer.area);


        // music enabled/disabled
        var musicButtonTextures = 	{"Enable":"./img/img/sound_enabled.png",
            "Disable":"./img/img/sound_muted.png"};
        this.controlMusicButton = new CheckButton(); 
        this.controlMusicButton.Init(this.objContainer, musicButtonTextures, 
        function(button){
            if(button.enabled)
            {    
                SoundManager.Unmute(); 
            }
            else
            {
                SoundManager.Mute();
            }
        });	
        this.controlMusicButton.SetPosition(GlobalScale(1644), GlobalScale(752));
        this.controlMusicButton.SetState(!SoundManager.GetMute());


        // letter
        this.letter = new Letter();
        this.letter.Init(this.objContainer);

        // snow
        var snowParticleDesc = new function(){}; // I love javascript !!!
        snowParticleDesc.Count = 40;	// particle number
        snowParticleDesc.particleArea = {"X": GlobalScale(-32), "Y":GlobalScale(-32), "W":Screen.VirtualScrW + GlobalScale(32), "H":Screen.VirtualScrH + GlobalScale(32)};
        snowParticleDesc.SpeedX = {"Min":-0.5, "Max":0.5};	// min-max speed
        snowParticleDesc.SpeedY = {"Min":0.7, "Max":1.3};	// min-max speed
        snowParticleDesc.Scale = {"Min":0.5, "Max":1.3};	// min-max scale factor
        snowParticleDesc.Alpha = {"Min":0.5, "Max":1.0};	//min-max alpha
        snowParticleDesc.RotationSpeed = {"Min":0.001, "Max":0.005};	// rotation speed
        snowParticleDesc.CloudTexture = new Array("./img/img/snowflake1.png");

        this.snow = new ShowParticles();
        this.snow.Init(this.objContainer, snowParticleDesc);

        //// MUST BE LAST !!!
        //this.stageFadeInEffect = new StageFadeEffect();
        //this.stageFadeInEffect.Init(this.objContainer, -0.05);

    }

    this.Update = function()
    {
        //this.stageFadeInEffect.Update();
        //if(!this.stageFadeInEffect.isComplete())
            //return;
        
        if(this.currentTick == 300 && this.letterBox.notOpenedBefore) // 300 is not a magic number is aprox 6 seconds
        {
            this.letterBox.Open();
            this.currentTick +=10;   
        }
        else
            this.currentTick += 1;

        // background texture 
        this.starBackground.texture.position.x = this.starBackground.currentOffset; 

        // sun
        this.sun.effect.Update();
        this.sun.texture.position.y = this.sun.effect.getValue(); 
        this.sun.texture.position.x = this.sun.startX + this.starBackground.currentOffset * 2.5;

        // hils
        this.hills.texture.position.x = this.hills.startX + this.starBackground.currentOffset * 0.5;
        
        //letterbox
        this.letterBox.setPosX(-this.starBackground.currentOffset * 0.3);

        this.smoke.Update();
        this.snow.Update();
        
        this.letterBox.Update();
        this.letter.Update();
    }

    this.Free = function()
    {
    }


}

