// button class
function CheckButton()
{	
    this.rootContainer = undefined;// root container that hold all sprites
    // position of checkbutton
    this.position={"x":GlobalScale(0), "y":GlobalScale(0)}; // call SetPosition to change this value, do not change it directly
    this.enabled=true;	//call SetState function to change this value, do not change it directly
    this.scale = 1.0;   //scale of object

    // Sprites of states
    this.states = {"Enable":undefined, "Disable":undefined};

    // User definde callback funtion when state of button changed
    this.OnChangeCallback = undefined;

    var th = this; // FIXME: need to pass this into onChangeCallback
    this.OnClick = function()
    {	
	th.SetState(!th.enabled);
    }

    this.Free = function()
    {
	this.rootContainer.removeChild(this.states.Enable);
	this.states.Enable = undefined;

	this.rootContainer.removeChild(this.states.Disable);
	this.states.Disable = undefined;

	this.OnChangeCallback = undefined;
    }
    // Init CheckButton object
    // context - context to store sprite objects
    // statesTextures textures for enable/disable states
    // onChange user defined callback function fired when state change
    this.Init = function(rootContainer, statesTextures, onChange)
    {	
	this.rootContainer = rootContainer;
	this.OnChangeCallback = onChange;
        var hack = this;

	// Enable state
	this.states.Enable = new PIXI.Sprite.fromImage(statesTextures.Enable);
        this.states.Enable.anchor.x = 0.5;
        this.states.Enable.anchor.y = 0.5;
	this.states.Enable.position.x = this.states.Enable.width/2 + this.position.x;
	this.states.Enable.position.y = this.states.Enable.height/2 + this.position.y;
	this.states.Enable.visible = this.enabled;
	this.states.Enable.interactive = this.enabled;
	DEVICE.ClickOrTap(this.states.Enable, this.OnClick);
        this.states.Enable.mouseout = function()
        {
            hack.scale = 1 - 0.05; // FIXME: remove it to constant
        }
        this.states.Enable.mouseover = function()
        {
            hack.scale = 1 + 0.05;
        }
	this.rootContainer.addChild(this.states.Enable);

	// Disable state
	this.states.Disable = new PIXI.Sprite.fromImage(statesTextures.Disable);
        this.states.Disable.anchor.x = 0.5;
        this.states.Disable.anchor.y = 0.5;
	this.states.Disable.position.x = this.states.Disable.width/2 + this.position.x;
	this.states.Disable.position.y = this.states.Disable.height/2 + this.position.y;
	this.states.Disable.interactive = !this.enabled;
	this.states.Disable.visible = !this.enabled;
	DEVICE.ClickOrTap(this.states.Disable, this.OnClick);
        this.states.Disable.mouseout = function()
        {
            hack.scale = 1 - 0.05; // FIXME: remove it to constant
        }
        this.states.Disable.mouseover = function()
        {
            hack.scale = 1 + 0.05;
        }

	this.rootContainer.addChild(this.states.Disable);

    }

    // Set positon of CheckButton
    // x x position
    // y y position
    this.SetPosition = function(x, y)
    {
	if((this.states.Enable === undefined) || 
		(this.states.Disable === undefined))
	{
	    console.log("button not inited");
	    return;
	}

	// Enable state
	this.states.Enable.position.x = this.states.Enable.width/2 + x;
	this.states.Enable.position.y = this.states.Enable.height/2 + y;

	// Disable state
	this.states.Disable.position.x = this.states.Disable.width/2 + x;
	this.states.Disable.position.y = this.states.Disable.height/2 + y;
    }

    // update object state
    this.Update = function()
    {
        this.SetScale(this.scale, this.scale);
    }

    // set scale for object
    this.SetScale = function(x, y)
    {
        if(this.states.Enable !== undefined)
        {
            this.states.Enable.scale.x = x;
            this.states.Enable.scale.y = y;
        }

        if(this.states.Disable !== undefined)
        {
            this.states.Disable.scale.x = x;
            this.states.Disable.scale.y = y;
        }


    }
    // Change button state
    // state the state, if true button enabled, false - disabled
    this.SetState = function(state)
    {	
	this.enabled = state;

	if((this.states.Enable === undefined) || 
		(this.states.Disable === undefined))
	{
	    console.log("button not inited");
	    return;
	}

	this.states.Enable.visible = this.enabled;
	this.states.Enable.interactive = this.enabled;

	this.states.Disable.visible = !this.enabled;
	this.states.Disable.interactive = !this.enabled;

	// call User callback funtion
	if(this.OnChangeCallback !== undefined)
	    this.OnChangeCallback(this);
    }
}

