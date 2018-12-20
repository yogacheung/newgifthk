// select levels stage 
function StartStageInit()
{	
    // init stage
    this.stage = new PIXI.Stage(0xffffff, true);		
    this.mainLogic = new StartStageGui();
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
function StartStageGui()
{
    this.rootContainer = undefined;
    this.objContainer = undefined;
    this.tickCount = 0;

    this.playButton = undefined;
    this.playBtnEffect = undefined;

    this.Init = function(rootContainer)
    {
        this.rootContainer = rootContainer;
        this.objContainer = new PIXI.DisplayObjectContainer();
        this.rootContainer.addChild(this.objContainer);

        var bg = new PIXI.Sprite.fromImage("./img/img/start_background.jpg");
        bg.anchor.x = 0.5;
        bg.anchor.y = 0.5;
        bg.position.x = Screen.VirtualScrW/2;
        bg.position.y = Screen.VirtualScrH/2;
        this.objContainer.addChild(bg);

        // button
        this.playButton = new PIXI.Sprite.fromImage("./img/img/start_card.png");
        this.playButton.anchor.x = 0.5;
        this.playButton.anchor.y = 0.5;
        this.playButton.position.x = Screen.VirtualScrW/2;
        this.playButton.position.y = Screen.VirtualScrH/2;
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        DEVICE.ClickOrTap(this.playButton, function(data){

                GAME.currentStage.Fadeout();
                GAME.currentStage = GAME.stages.main; 
                GAME.currentStage.Fadein();

        });
        this.objContainer.addChild(this.playButton);
    }

    this.Update = function()
    {
        this.tickCount += 1;

        var scale = 0.03 * Math.cos(0.1 * this.tickCount);
        this.playButton.scale.x = 1.0 + scale;
        this.playButton.scale.y = 1.0 + scale;
        
    }

    this.Free = function()
    {
        this.objContainer.removeChildren();
    }


}

