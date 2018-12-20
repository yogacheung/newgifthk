// Fog effect for stage
// add fog to scene and in can fade in or fade out
function StageFadeEffect()
{
    this.rootContainer = undefined;
    this.objContainer = undefined;  // container to store this objects

    this.fadeSpeed =  0.1; // fade default params
    this.fade = undefined; //fade scene object, FIXME: probably use tiled texture
    this.params = {"from": undefined, "to": undefined, "cur": undefined};
    this.onCompleteCallback = undefined;    // callback when fade complete
    this.isPaused = undefined; // true if paused

    // reset object state
    // does not create any graphic objects, just reset math state
    this.Reset = function()
    {
        if(this.fadeSpeed >= 0.0)
        {
            this.params.from = 0.0;
            this.params.to = 1.0;
            this.params.cur = this.params.from;
        }
        else
        {
            this.params.from = 1.0;
            this.params.to = 0.0;
            this.params.cur = this.params.from;
        }

    }

    // used to Init object
    // rootContainer - container to store this object graphics
    // speed - fade speed, if positive fade from 0 to 1 used, if negative from 1 to 0
    // onCompleteCallback - callback function when complete prototype onCompleteCallback(this)
    this.Init = function(rootContainer, speed, onCompleteCallback)
    {
        this.rootContainer = rootContainer;
        this.objContainer = new PIXI.DisplayObjectContainer();
        this.rootContainer.addChild(this.objContainer);

        this.isPaused = false;
        this.onCompleteCallback = onCompleteCallback;

        // fade effect params
        this.fadeSpeed = speed;
        this.Reset(); // reset state
        
        // fade effect FIXME: probably replace it to tiled texture 
	this.fade = new PIXI.Graphics();
	this.fade.lineStyle(0);	
	this.fade.beginFill(0x000001, this.params.cur);//NOTE: fix for android brousers	
	this.fade.drawRect(0, 0, Screen.VirtualScrW, Screen.VirtualScrH);
	this.fade.endFill();	
	this.objContainer.addChild(this.fade);	
    }

    // put object to pause 
    this.Pause = function()
    {
        this.isPaused = true;
    }

    // resume from pause
    this.Resume = function()
    {
        this.isPaused = false;
    }

    // free resources allocated by object
    this.Free = function()
    {
        this.fadeSpeed = undefined;
        this.params = {"from": undefined, "to": undefined, "cur": undefined};
        this.onCompleteCallback = undefined;
        
        this.objContainer.removeChild(this.fade);
        this.fade = undefined;

	this.rootContainer.removeChild(this.objContainer);
	this.objContainer = undefined;

    }

    this.isComplete = function()
    {
        return this.params.cur == this.params.to;
    }
    // Update function for object
    this.Update = function()
    {
        if( this.isPaused === true ||
            this.isComplete())
            return;

        this.params.cur += this.fadeSpeed;

        var isComplete = (this.fadeSpeed >= 0.0) ? (this.params.cur > this.params.to) : (this.params.cur < this.params.to);
        if(isComplete)
        {
            this.params.cur = this.params.to;
            if(this.onCompleteCallback !== undefined)
                this.onCompleteCallback(this);
        }

       this.fade.alpha = this.params.cur; 
    }
}
