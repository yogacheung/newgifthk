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
    this.tickCount = 0;
    this.mousePosition = {x:0, y:0};
    this.paralax = {"maxAmplitude":40, "currentAmplitude": 0}; 
    
    this.snow = undefined; // scene container with snow particles
    this.snow_small= undefined; // scene container with snow particles
    this.stars = {body: undefined, startX: GlobalScale(200)};
    this.stars_1 = {body: undefined, startX: GlobalScale(200)};
    this.big_star = {body: undefined, startX:  GlobalScale(500)};
    this.deer = {body: undefined, startX: GlobalScale(900), particlesBack: undefined, particlesFront: undefined};
    this.logo = {body: undefined, startX: undefined};
    this.circle_text = undefined; 
    this.particles = undefined; 
    this.trees_with_stars = undefined;
    this.stars_on_trees = [
                            {file: "./img/img/star_on_tree_1.png", pos:{x:GlobalScale(1588), y:GlobalScale(0)}, body: undefined, enabled: false, bg: undefined},
                            {file: "./img/img/star_on_tree_2.png", pos:{x:GlobalScale(1411), y:GlobalScale(179)}, body: undefined, enabled: false, bg: undefined},
                            {file: "./img/img/star_on_tree_3.png", pos:{x:GlobalScale(1265), y:GlobalScale(228)}, body: undefined, enabled: false, bg: undefined},
                            {file: "./img/img/star_on_tree_4.png", pos:{x:GlobalScale(611), y:GlobalScale(265)}, body: undefined, enabled: false, bg: undefined},
                            {file: "./img/img/star_on_tree_5.png", pos:{x:GlobalScale(264), y:GlobalScale(120)}, body: undefined, enabled: false, bg: undefined},
                            {file: "./img/img/star_on_tree_6.png", pos:{x:GlobalScale(76), y:GlobalScale(281)}, body: undefined, enabled: false, bg: undefined}
                          ];
    this.starsDiscovered = {all: false, one: false}; // how many stars discovered
    this.light_up_all_stars = undefined;
    
    
    this.Init = function(rootContainer)
    {	
        // show html scroling background 
        // defined in index.html
        EnableHtmlBackground(); 
	
        this.rootContainer = rootContainer;
        this.objContainer = new PIXI.DisplayObjectContainer();
        this.objContainer.interactive = true;
        this.objContainer.parentObj = this;

        var hack = this; 
        DEVICE.MouseOrFingerMove(this.objContainer, function(data){
                var maxWidth = Screen.VirtualScrW / 2;
                var current = (data.global.x - maxWidth) / maxWidth; 
                hack.paralax.currentAmplitude = hack.paralax.maxAmplitude * (current - 1);   // from -1 .. 1 to -2 .. 0 
            });
        this.rootContainer.addChild(this.objContainer);    


        // background snow 
        var bg = new PIXI.Sprite.fromImage("./img/img/bg.png");
        this.objContainer.addChild(bg);

        // background snow 
        var bg_snow = new PIXI.Sprite.fromImage("./img/img/snow.png");
        bg_snow.position.x = 0;
        bg_snow.position.y = GlobalScale(750);
        this.objContainer.addChild(bg_snow);

        // background glow 
        var glow = new PIXI.Sprite.fromImage("./img/img/glow.png");
        glow.position.x = GlobalScale(534);
        glow.position.y = GlobalScale(0);
        this.objContainer.addChild(glow);

        // stars 
        this.stars.body = new PIXI.Sprite.fromImage("./img/img/stars.png");
        this.stars.body.position.x = this.stars.startX;
        this.stars.body.position.y = GlobalScale(0);
        this.objContainer.addChild(this.stars.body);

        // stars_1
        this.stars_1.body = new PIXI.Sprite.fromImage("./img/img/stars_1.png");
        this.stars_1.body.position.x = this.stars_1.startX;
        this.stars_1.body.position.y = GlobalScale(0);
        this.objContainer.addChild(this.stars_1.body);

        // stars_1
        this.big_star.body = new PIXI.Sprite.fromImage("./img/img/big_star.png");
        this.big_star.scale = {x: 1.5, y:1.5};
        this.big_star.body.position.x = this.big_star.startX;
        this.big_star.body.position.y = GlobalScale(75);
        this.objContainer.addChild(this.big_star.body);

        // trees
        this.trees_with_stars = new PIXI.DisplayObjectContainer();
        this.objContainer.addChild(this.trees_with_stars);
        
        // light up all stars logo
        this.light_up_all_stars = new PIXI.Sprite.fromImage("./img/img/light_up_all_stars.png");
        this.light_up_all_stars.position = {x:GlobalScale(1690), y:GlobalScale(110)};
        this.trees_with_stars.addChild(this.light_up_all_stars);

        var trees = new PIXI.Sprite.fromImage("./img/img/trees.png");
        trees.position.x = GlobalScale(76); 
        trees.position.y = GlobalScale(222);
        this.trees_with_stars.addChild(trees);
        
        //stars on trees
        for(var s = 0; s < this.stars_on_trees.length; s++)
        {
            var star = this.stars_on_trees[s]; // alias
            
            // spin background
            star.bg = new PIXI.Sprite.fromImage("./img/img/tree_spin_bg.png");
            star.bg.anchor = {x: 0.5, y:0.5};
            star.bg.alpha = 0.0;
            var scale = UTILS.randomBetween(0.8, 1.3);
            star.bg.scale = {x: scale, y: scale};
            this.trees_with_stars.addChild(star.bg);

            // body
            star.body = new PIXI.Sprite.fromImage(star.file);
            star.body.position.x = star.pos.x + trees.position.x;
            star.body.position.y = star.pos.y + trees.position.y;
            this.trees_with_stars.addChild(star.body);

            // update position
            star.bg.position.x = star.pos.x + trees.position.x + star.body.width/2;
            star.bg.position.y = star.pos.y + trees.position.y + star.body.height/2;
            
            star.body.userSettings = star;
            //// add some iteraction
            star.body.interactive = true;
            star.body.buttonMode = true;
            DEVICE.ClickOrTap(star.body, function(data)
            {
                data.target.userSettings.enabled = true;
            });  

        }
        

        // deer 
        this.deer.body = new PIXI.Sprite.fromImage("./img/img/deer.png");
        this.deer.body.position.x = this.deer.startX;
        this.deer.body.position.y = GlobalScale(564);
        this.deer.body.alpha = 0.0;
        this.objContainer.addChild(this.deer.body);

        // Text particle decoration
        var descr = 
        {
            Count: 15,// particle number
            ParticleArea: {"X": GlobalScale(-30), "Y":GlobalScale(-30), "W":(this.deer.body.width + GlobalScale(30)), "H":(this.deer.body.height + GlobalScale(30))}, // area where particles will exist
            AnimationPlaySpeed: {"Min": 0.2, "Max": 0.3},
            ParallaxScroll : 0.2,        // scroll speed when paralax
            Textures: [
                {name: "move_partile_4_", frames: 10, start: 1}, 
                  ]
        };
        this.deer.particlesBack = new StaticParticles(this.deer.body, descr);
        this.deer.particlesFront= new StaticParticles(this.deer.body, descr);
        //this.particles.objContainer.alpha = 0.0;



        // small snow particlesparticles
        var small_snowParticleDesc ={ 
            Count : 30,	// particle number
            particleArea : {"X": GlobalScale(300), "Y":GlobalScale(-50), "W":Screen.VirtualScrW - GlobalScale(300), "H":Screen.VirtualScrH + GlobalScale(50)},
            SpeedX : {"Min":0.0, "Max":0.0},	// min-max speed
            SpeedY : {"Min":1.5, "Max":2.5},	// min-max speed
            Scale : {"Min":0.5, "Max":1.0},	// min-max scale factor
            Alpha : {"Min":0.5, "Max":0.8},	//min-max alpha
            RotationSpeed : {"Min":0.002, "Max":0.01},	// rotation speed
            PulsationAmplitude : {"Min":-15, "Max":15},	// x pulsation amplitude max (in px)
            PulsationSpeed : {"Min":0.04, "Max":0.08},	// x pulsation speed  
            CloudTexture : new Array("./img/img/snow_flake_0.png")
        };
        this.snow_small = new ShowParticles();
        this.snow_small.Init(this.objContainer, small_snowParticleDesc);

        // snow particles
        var snowParticleDesc ={ 
            Count : 20,	// particle number
            particleArea : {"X": GlobalScale(300), "Y":GlobalScale(-50), "W":(Screen.VirtualScrW - GlobalScale(300)), "H":(Screen.VirtualScrH + GlobalScale(50))},
            SpeedX : {"Min":0.0, "Max":0.0},	// min-max speed
            SpeedY : {"Min":1, "Max":2.0},	// min-max speed
            Scale : {"Min":0.5, "Max":0.8},	// min-max scale factor
            Alpha : {"Min":0.5, "Max":0.8},	//min-max alpha
            RotationSpeed : {"Min":0.001, "Max":0.005},	// rotation speed
            PulsationAmplitude : {"Min":-15, "Max":15},	// x pulsation amplitude max (in px)
            PulsationSpeed : {"Min":0.04, "Max":0.08},	// x pulsation speed  
            CloudTexture : new Array("./img/img/snow_flake_1.png", "./img/img/snow_flake_2.png", "./img/img/snow_flake_3.png", "./img/img/snow_flake_4.png")
        };
        this.snow = new ShowParticles();
        this.snow.Init(this.objContainer, snowParticleDesc);


        // sound music button
        var musicButtonTextures =   {"Enable":"./img/img/sound_enabled.png",
                                     "Disable":"./img/img/sound_muted.png"};                     
        createMuteMusicButton( this.objContainer, 
                               musicButtonTextures, 
                               {x: GlobalScale(56), y: GlobalScale(980)});
        
        // add logo
        this.logo.body = initLogo(this.objContainer);
        this.logo.startX = this.logo.body.position.x;
        
        // texts
        // principals
        this.principals = initPrincipials(this.objContainer, {w:500, h:60});
        this.principals.alpha = 0.0;

        // message
        this.message = initMessage(this.objContainer, {w:520, h:214});
        this.message.alpha = 0.0;

        // greatings text 
        var hb_text = GAME.xmlSettings.letter.greatings.text;
        var textSize = GAME.xmlSettings.letter.greatings.size;
        var hb_text_style = {   font: textSize + "px 'broadwayregular'",
            fill: "#cfd7db",
            align: "center",
            wordWrap: false,
            stroke: "#ffffff",
            strokeThickness: GlobalScale(4),
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowDistance: GlobalScale(4)
        };
        
        this.circle_text = new PIXI.Text(hb_text, hb_text_style);
        this.circle_text.cacheAsBitmap = true;
        this.circle_text.position.x = GlobalScale(parseInt(GAME.xmlSettings.letter.greatings.x));
        this.circle_text.position.y = GlobalScale(parseInt(GAME.xmlSettings.letter.greatings.y));
        this.circle_text.anchor = {x:0.5, y:0.0};
        this.objContainer.addChild(this.circle_text);

        // Text particle decoration
        var particesDescr = 
        {
            Count: 30,// particle number
            ParticleArea: {"X": GlobalScale(650), "Y":GlobalScale(150), "W":GlobalScale(600), "H":GlobalScale(400)}, // area where particles will exist
            AnimationPlaySpeed: {"Min": 0.2, "Max": 0.3}
        };
        this.particles =new StaticParticles(this.objContainer, particesDescr);
        this.particles.objContainer.alpha = 0.0;

        // play sound
        SoundManager.PlayContiniousSound("maintheme");

    }

    this.Update = function()
    {
        this.tickCount +=1;
        
        // stars 
        this.stars.body.position.x = this.stars.startX + 0.3 * this.paralax.currentAmplitude; 
        this.stars.body.alpha =   1.0 - (1.0 + Math.cos(this.tickCount * 0.03))/2;

        // stars_1 
        this.stars_1.body.position.x = this.stars_1.startX + 0.1 * this.paralax.currentAmplitude; 

        // big_star 
        this.big_star.body.position.x = this.big_star.startX + 0.1 * this.paralax.currentAmplitude; 
        this.big_star.body.alpha =   1.0 -  0.6 * (1.0 + Math.cos(this.tickCount * 0.07))/2;

        // trees 
        this.trees_with_stars.position.x =  0.6 * this.paralax.currentAmplitude; 

        // deer 
        this.deer.body.position.x = this.deer.startX + 0.1 * this.paralax.currentAmplitude; 
        this.deer.particlesBack.Scroll(1.5 * this.paralax.currentAmplitude);
        this.deer.particlesFront.Scroll(-1.5 * this.paralax.currentAmplitude);

        // logo 
        this.logo.body.position.x = this.logo.startX + 0.1 * this.paralax.currentAmplitude; 
        
        // stars on trees
        this.starsDiscovered.all = true;
        this.starsDiscovered.one = false;
        for(var s = 0; s < this.stars_on_trees.length; s++)
        {
            // update current star
            var star = this.stars_on_trees[s];
            if(star.enabled)
            {
                star.bg.rotation += 0.01;
                star.bg.alpha += 0.01;
                star.bg.alpha = UTILS.normalizeNumber(star.bg.alpha);
            }
            this.starsDiscovered.all = this.starsDiscovered.all && star.enabled; // all stars is discovered
            this.starsDiscovered.one = this.starsDiscovered.one || star.enabled; // one of all stars is discoreverd
        }

        this.snow.Update();
        this.snow_small.Update();
        this.particles.Update();

        this.Animation();

    }
    
    // auxiliary function to make animation
    this.Animation = function()
    {
        if((this.tickCount > 60) && (this.tickCount < 300))
        {
            this.particles.objContainer.alpha += 0.01;
            this.particles.objContainer.alpha = UTILS.normalizeNumber(this.particles.objContainer.alpha);
        }
        else
        {
            this.particles.objContainer.alpha -= 0.005;
            this.particles.objContainer.alpha = UTILS.normalizeNumber(this.particles.objContainer.alpha);
        }

        if(this.tickCount > 150)
        {
            var fadeInSpeed = 0.005;
            this.principals.alpha += fadeInSpeed; 
            this.principals.alpha = UTILS.normalizeNumber(this.principals.alpha);

            this.message.alpha += fadeInSpeed;
            this.message.alpha = UTILS.normalizeNumber(this.message.alpha);
        }

        // deer animate
        if(this.starsDiscovered.all)
        {
            this.deer.body.alpha +=0.02;
            this.deer.body.alpha = UTILS.normalizeNumber(this.deer.body.alpha);
            this.light_up_all_stars.alpha -= 0.03;
            this.light_up_all_stars.alpha = UTILS.normalizeNumber(this.light_up_all_stars.alpha);

        }

    }

    this.Free = function()
    {
    }


}

