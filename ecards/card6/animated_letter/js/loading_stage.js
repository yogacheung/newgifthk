// Stage for load game graphics
function LoadingStageInit()
{	
    // init stage
    this.stage = new PIXI.Stage(0xffffff);		

    this.container = undefined;     // container to store objects
    this.background = undefined;    // background sprite
    this.loadingBarTexture = undefined;
    this.loadingBarSprite = undefined;    // loading sprite
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
                //FIXME: add time delay
                GAME.currentStage.Fadeout();
                GAME.currentStage = GAME.stages.main; // GAME.stages.levels
                GAME.currentStage.Fadein();

                // show html scroling background 
                // defined in index.html
                showHtmlBackground();

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
                alias.background = PIXI.Sprite.fromImage("loading_bg.png");    
                alias.background.position.x = GlobalScale(5);
                alias.background.position.y = GlobalScale(339);
                alias.container.addChild(alias.background);

                alias.loadingBarTexture= new PIXI.Texture.fromImage("loading_red.png");
                alias.loadingBarSprite = new PIXI.Sprite(alias.loadingBarTexture);
                alias.loadingBarSprite.position.x = GlobalScale(54);
                alias.loadingBarSprite.position.y = GlobalScale(465);
                alias.container.addChild(alias.loadingBarSprite);

                var congratsTextStyle = {   font:"50px 'Arial'",
                    fill:"#ffffff",
                    align:"center"
                };
                alias.font = new PIXI.Text("\n0%\n", congratsTextStyle);
                alias.font.position.x = GlobalScale(300);
                alias.font.position.y = GlobalScale(510);
                alias.font.anchor.x = 0.5;
                alias.font.anchor.y = 0.5;
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
        var physVal= Math.round(GlobalScale(511) * this.assetLoader.getStatus()/100);  // 511 is not magic number is this.loadingBarSprite.width
        if(physVal == 0)
            physVal = 1;

        var offset = {"x":GlobalScale(2), "y": GlobalScale(381)}; // In not a magic, see loading.json
        var rec = new PIXI.Rectangle(offset.x, offset.y, physVal, GlobalScale(98)); // 98 is not magic number is this.loadingBarSprite.height 
        this.loadingBarTexture.setFrame(rec);

        //update persent (0 .. 99 %)
        this.font.setText("\n" + this.assetLoader.getStatus().toString()+"%\n");
    }

    // create list of preloaded images (need to load font )
    this.createImagesPreloadList = function()
    {
        var img = new Array();

        // root
        img.push("./img/json/loading.json");                    

        return img;
    }

    // create list of all images in game
    this.FillResourceList = function()
    {	
        this.assetLoader.addResource("","./img/img/background.png", "g");
        this.assetLoader.addResource("","./img/img/background_bottom.jpg", "g");
        this.assetLoader.addResource("","./img/img/background_middle.png", "g");
        this.assetLoader.addResource("","./img/img/hills.png", "g");
        this.assetLoader.addResource("","./img/img/sun.png", "g");
        this.assetLoader.addResource("","./img/img/snowflake1.png", "g");
        this.assetLoader.addResource("","./img/img/smoke1.png", "g");
        this.assetLoader.addResource("","./img/img/smoke2.png", "g");
        this.assetLoader.addResource("","./img/img/smoke3.png", "g");
        this.assetLoader.addResource("","./img/img/flue_pipe.png", "g");
        this.assetLoader.addResource("","./img/img/fence_and_snowman.png", "g");
        this.assetLoader.addResource("","./img/img/letterbox_closed.png", "g");
        this.assetLoader.addResource("","./img/img/letterbox_opened.png", "g");
        this.assetLoader.addResource("","./img/img/letter.png", "g");
        this.assetLoader.addResource("","./img/img/sound_enabled.png", "g");
        this.assetLoader.addResource("","./img/img/sound_muted.png", "g");
        this.assetLoader.addResource("","./img/img/close.png", "g");
        this.assetLoader.addResource("","./img/img/snowman_closed_eyes.png", "g");
        this.assetLoader.addResource("","./img/img/snowman_smile.jpg", "g");
        this.assetLoader.addResource("","./img/img/deer.png", "g");
        this.assetLoader.addResource("","./img/img/deer_head_down.png", "g");

        // lights animation
        this.assetLoader.addResource("","./img/img/red.png", "g");
        this.assetLoader.addResource("","./img/img/yellow.png", "g");
        this.assetLoader.addResource("","./img/img/blue.png", "g");

        // music and sound        
        var musicTheme =  GAME.xmlSettings.letter.musicTheme;
        var pathToTheme = musicTheme + ".ogg";
        this.assetLoader.addResource("maintheme", pathToTheme, "m"); 

    }

}

