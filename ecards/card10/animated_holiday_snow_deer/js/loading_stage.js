// Stage for load game graphics
function LoadingStageInit()
{	
    // init stage
    this.stage = new PIXI.Stage(0xffffff);		

    this.container = undefined;     // container to store objects
    this.preloader_wheel = undefined;    // background sprite
    this.font = undefined; // font for load 
    this.preAssetLoaderComplete = false;	// true if preassetloader complete load 
    this.fadeOutEffect = undefined;
    this.assetLoader= undefined;        // loader object 


    //called when all graphics loaded 
    this.onComplete = function()
    {
        // Init sound 
        SoundManager.Init();

        var alias = GAME.stages.loading;// this
        alias.fadeOutEffect = new StageFadeEffect();
        alias.fadeOutEffect.Init(alias.stage, 0.02, function(th){

                GAME.currentStage.Fadeout();
                if(DEVICE.isIpad() || DEVICE.isIphone())
                    {    GAME.currentStage = GAME.stages.start;} 
                else
                    {  GAME.currentStage = GAME.stages.main; } 
                GAME.currentStage.Fadein();
                });

    }

    // called when stage is show
    this.Fadein = function()
    {	
        this.assetLoader = new GameLoader();
        this.assetLoader.Init();
        this.assetLoader.runPreloader(this.createImagesPreloadList(), 
            function(assetloader)
            {
                console.log("preasset loaded finish");
                var alias = GAME.stages.loading; // this class
                // Start load
                alias.FillResourceList();
               
                alias.container = new PIXI.DisplayObjectContainer();
                alias.stage.addChild(alias.container);
                alias.container.position.x = GlobalScale(600);
                alias.container.position.y = GlobalScale(100);
                
                // there is no asset loader yet
                //FIXME: move to json
                alias.preloader_wheel = PIXI.Sprite.fromImage("./img/img/preloader_wheel.png");    
                alias.preloader_wheel.anchor ={x: 0.5, y: 0.5};
                alias.preloader_wheel.position.x = GlobalScale(260) + alias.preloader_wheel.width/2;
                alias.preloader_wheel.position.y = GlobalScale(354) + alias.preloader_wheel.height/2;
                alias.container.addChild(alias.preloader_wheel);

                var fontSize = GlobalScale(20);
                alias.font = new PIXI.Text("0%", { font: fontSize + "px Arial", fill: "black", align: "center" });
                alias.font.position.x = GlobalScale(250);
                alias.font.position.y = GlobalScale(380);
                alias.container.addChild(alias.font);

                // main asset loader
                alias.assetLoader.runLoad(undefined, alias.onComplete);

                alias.SetProgres();
                alias.preAssetLoaderComplete = true;

            });
    }

    // called when stage is hide
    this.Fadeout = function(obj)
    {		
        this.assetLoader.Free(); 
    }

    this.Update = function()
    {  
        if(this.preAssetLoaderComplete !== true)
            return;

        // if this.fadeOutEffect === undefined - there loading process still work, false - need switch stages
        if(this.fadeOutEffect === undefined)
            this.SetProgres();//  
        else
            this.fadeOutEffect.Update();
    }

    // need to set progress value of bar
    this.SetProgres = function()
    {
        this.preloader_wheel.rotation += 0.1;
        //update persent (0 .. 99 %)
        this.font.setText("\n" + this.assetLoader.getStatus().toString()+"%\n");
    }

    // create list of preloaded images (need to load font )
    this.createImagesPreloadList = function()
    {
        var img = new Array();

        // FIXME: move to json
        img.push("./img/img/preloader_wheel.png");                    

        return img;
    }

    // create list of all images in game
    this.FillResourceList = function()
    {
        this.assetLoader.addResource("","./img/img/bg.png", "g");
        this.assetLoader.addResource("","./img/img/snow.png", "g");
        this.assetLoader.addResource("","./img/img/glow.png", "g");
        this.assetLoader.addResource("","./img/img/stars.png", "g");
        this.assetLoader.addResource("","./img/img/stars_1.png", "g");
        this.assetLoader.addResource("","./img/img/big_star.png", "g");
        this.assetLoader.addResource("","./img/img/trees.png", "g");
        this.assetLoader.addResource("","./img/img/deer.png", "g");
        this.assetLoader.addResource("","./img/img/light_up_all_stars.png", "g");
        
        // stars on trees
        this.assetLoader.addResource("","./img/img/tree_spin_bg.png", "g");
        this.assetLoader.addResource("","./img/img/star_on_tree_1.png", "g");
        this.assetLoader.addResource("","./img/img/star_on_tree_2.png", "g");
        this.assetLoader.addResource("","./img/img/star_on_tree_3.png", "g");
        this.assetLoader.addResource("","./img/img/star_on_tree_4.png", "g");
        this.assetLoader.addResource("","./img/img/star_on_tree_5.png", "g");
        this.assetLoader.addResource("","./img/img/star_on_tree_6.png", "g");

        // snowflakes
        this.assetLoader.addResource("","./img/img/snow_flake_0.png", "g");
        this.assetLoader.addResource("","./img/img/snow_flake_1.png", "g");
        this.assetLoader.addResource("","./img/img/snow_flake_2.png", "g");
        this.assetLoader.addResource("","./img/img/snow_flake_3.png", "g");
        this.assetLoader.addResource("","./img/img/snow_flake_4.png", "g");

        // particles
        this.assetLoader.addResource("","./img/json/move_particle_1.json", "g");
        this.assetLoader.addResource("","./img/json/move_particle_2.json", "g");
        this.assetLoader.addResource("","./img/json/move_particle_3.json", "g");
        this.assetLoader.addResource("","./img/json/move_particle_4.json", "g");

        // Sound muted/unmuted
        this.assetLoader.addResource("","./img/img/sound_muted.png", "g");
        this.assetLoader.addResource("","./img/img/sound_enabled.png", "g");
        
        // music and sound
        var musicTheme =  GAME.xmlSettings.letter.musicTheme;
        var pathToTheme = musicTheme + ".ogg";
        this.assetLoader.addResource("maintheme", pathToTheme, "m");
		
    }

}

