// class game, main class contain all info about game
function GAME()
{   
    this.isPaused = false;	// true if game in paused mode
    this.xmlSettings = undefined; // config file with xml data
    this.rid = undefined;       // e-carda recipient id

    // list of stages
    this.stages = undefined;	// array with stages, filled in Init funciton	
    this.currentStage = undefined;	//current stage

    // Init game level and gui
    this.InitLevel = function()
    {	
        this.isPaused = false;
    }

    this.FreeLevel = function()
    {
        // Unload level

    }

    // reset level
    this.ResetLevel = function()
    {
	this.FreeLevel();
        // Load level
        this.InitLevel();
    }

    // Called every tick
    this.Update = function()
    {
        this.currentStage.Update();
    }

    // Used to init game state
    this.Init = function()
    {  
        this.stages ={  "loading": new LoadingStageInit(), 
                        "main": new MainStageInit()
                        
                        };	
        this.currentStage = this.stages.loading;
        this.currentStage.Fadein();
    }

    // switch game to pause mode
    this.Pause = function()
    {
        if(this.isPaused === true)
            return;	// game already in pause mode

        this.isPaused = true;
    }

    // resume game from pause
    this.Resume = function()
    {
        if(this.isPaused !== true)
            return;	// game already resumed

        this.isPaused = false;
    }

    // return true if game in pause, false otherwice
    this.isGamePaused = function()
    {
        return this.isPaused;
    }

}
GAME = new GAME(); // global game object

