// letter box
function LetterBox()
{
    this.rootContainer = undefined;
    this.objContainer = undefined;

    this.background = undefined;
    this.opened = undefined;
    this.closed = undefined;
    this.effect = undefined;
    this.isOpened = false; // current state box open or close
    this.notOpenedBefore = true;    // true if box not opened yet, false otherwice
    this.callback = {"func":undefined, "data":undefined};
    this.snowman = {"blink": undefined, "smile":undefined, "area": undefined, "on": false};

    this.snowmanBlink = {   "firstBlinkDelay":5, 
                            "secondBlinkDelay":10,
                            "delayBetwenBlinks":5,
                            "endDelay": 120,
                            "currentTick": 0};


    // rootcontainer - root to store objects on it
    // callbackFunc - function to call when used clicked on letterbox
    // userData - user data passed to callback function 
    this.Init = function(rootContainer, callbackFunc, userData)
    {
        this.rootContainer = rootContainer;
        this.objContainer = new PIXI.DisplayObjectContainer();
        this.rootContainer.addChild(this.objContainer);
        
        this.callback.func = callbackFunc;
        this.callback.data = userData;

        
        this.background = new PIXI.Sprite.fromImage("./img/img/fence_and_snowman.png");
        this.background.position.x = GlobalScale(1116);
        this.background.position.y = GlobalScale(858);
        this.objContainer.addChild(this.background);

        // letterbox
        // opened
        this.opened = new PIXI.Sprite.fromImage("./img/img/letterbox_opened.png");
        this.opened.anchor.x = 0.5;
        this.opened.anchor.y = 0.5;
        this.opened.position.x = GlobalScale(1454);
        this.opened.position.y = GlobalScale(896);
        this.opened.visible = false;
        this.objContainer.addChild(this.opened);

        // closed 
        this.closed = new PIXI.Sprite.fromImage("./img/img/letterbox_closed.png");
        this.closed.anchor.x = 0.5;
        this.closed.anchor.y = 0.5;
        this.closed.position.x = this.opened.position.x;
        this.closed.position.y = this.opened.position.y;
        this.closed.interactive = true;
        this.closed.buttonMode = true;
        var hack = this;
        DEVICE.ClickOrTap(this.closed, function(data){
                    hack.Open();
                });
        this.objContainer.addChild(this.closed);
        
        // snowman
        this.snowman.blink = new PIXI.Sprite.fromImage("./img/img/snowman_closed_eyes.png");
        this.snowman.blink.position.x = GlobalScale(1644);
        this.snowman.blink.position.y = GlobalScale(948);
        this.snowman.blink.visible = false;
        this.objContainer.addChild(this.snowman.blink);

        this.snowman.smile = new PIXI.Sprite.fromImage("./img/img/snowman_smile.jpg");
        this.snowman.smile.position.x = GlobalScale(1642);
        this.snowman.smile.position.y = GlobalScale(981);
        this.snowman.smile.visible = false;
        this.objContainer.addChild(this.snowman.smile);

        this.snowman.area = new PIXI.DisplayObjectContainer();
        this.snowman.area.interactive = true;
        this.snowman.area.hitArea = new PIXI.Rectangle(1606, 860, 204, 340);
        var hack = this;
        this.snowman.area.mouseout = function()
        {
            hack.snowman.on = false;
            console.log("on: false");
        }
        this.snowman.area.mouseover = function()
        {
            if(hack.snowman.on == false)
            {    
                hack.snowman.on = true;
                console.log("on: true");
            }
        }
        this.objContainer.addChild(this.snowman.area);
            
        // effect
        this.effect =  new ShiverEffect();
        this.effect.Init(0.1, 0.0015, 0.8);


    }

    this.Update = function()
    {
        if(this.snowman.on)
        {
            this.snowmanBlink.currentTick += 1;
            this.snowman.blink.visible = this.snowmanBlinkFunction(this.snowmanBlink); 

            this.snowman.smile.visible = true;
        }
        else
        {
            this.snowman.smile.visible = false;
            this.snowman.blink.visible = false;
        }

        if(!this.isOpened )
        {
            this.effect.Update();
            if(this.effect.isComplete())
                this.effect.Start();
        }

        this.closed.rotation = this.effect.GetValue();
    }
    
    this.setPosX = function(x)
    {
        this.objContainer.position.x = x;
    }

    this.setPosY = function(y)
    {
        this.objContainer.position.y = y;
    }
    
    // open box 
    this.Open = function()
    {
        this.notOpenedBefore = false;
        
        if(this.isOpened == true)
            return;

        this.isOpened = true;               
        this.closed.visible = false;
        this.opened.visible = true;

        if(this.callback.func !== undefined)
            this.callback.func(this.callback.data);
    }

    // close box 
    this.Close = function()
    {
        if(this.isOpened == false)
            return;

        this.isOpened = false;               
        this.closed.visible = true;
        this.opened.visible = false;

    }

    this.Free = function()
    {
    }

    // blink for Snowman eyes
    // settings.firstBlinkDelay
    // settings.secondBlinkDelay
    // settings.delayBetwenBlinks
    // settings.endDelay
    // settings.currentTick
    this.snowmanBlinkFunction = function(settings)
    {
        var totalFunctionPeriod =   settings.firstBlinkDelay +
                                    settings.secondBlinkDelay +
                                    settings.delayBetwenBlinks +
                                    settings.endDelay;
        var local = settings.currentTick % totalFunctionPeriod;

        var offset = settings.firstBlinkDelay;
        if(offset > local)
            return true;
        
        offset += settings.delayBetwenBlinks;
        if(offset > local)
            return false;
 
        offset += settings.secondBlinkDelay;
        if(offset > local)
            return true;

        return false;

    }

}
