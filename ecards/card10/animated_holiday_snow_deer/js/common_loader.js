// game loader, can load resource (music/sound/graphics)
// it uses pixijs loader for graphics assets
// and soundjs for music and sound assets
function GameLoader()
{
    this.graphicsAsset = undefined;
    this.musicAsset = undefined; 
    this.currentLoadedCount= undefined;    // how many loaded in persent
    this.preloader = undefined;
    this.graphicsLoader = undefined; // loader for graphics
    this.callbacks = {"onComplete":undefined, "onLoadResource": undefined};
    this.isComplete = undefined;

    // Init object 
    this.Init = function()
    {
        this.graphicsAsset = new Array();
        this.musicAsset = new Array();
        this.currentLoadedCount = 0;
        this.isComplete = false;

    }

    // Free object and resources
    this.Free = function()
    {
        if(this.graphicsAsset !== undefined)
            this.graphicsAsset.length = 0;
        if(this.musicAsset !== undefined)
            this.musicAsset.length = 0;
        
        this.currentLoadedCount = undefined;
        this.callbacks = {"onComplete":undefined, "onLoadResource": undefined};
        
        if(this.preloader !== undefined)
            this.preloader = undefined;

        if(this.graphicsLoader !== undefined)
            this.graphicsLoader = undefined;

        if(this.musicLoader !== undefined)
            this.musicLoader = undefined;
        
    }

    // preloader - is mechanism to load graphics for loading screen
    // this like boot loader - it start to init system and run main system(linux/windows)loader
    // assetsList - array on graphics resources
    // onComplete - callback to run when preloader complete work, signature: onComplete(this)
    this.runPreloader = function(assetsList, onComplete)
    {
        this.preloader = new PIXI.AssetLoader(assetsList);
        this.preloader.onProgress = undefined;
        this.preloader.onComplete = function()
        {
            if(onComplete !== undefined)
                onComplete(this);
        }
        this.preloader.load();
    }

    // add resource
    // key - resource name in game
    // path - path to resource,
    // type - type: 'g' for pixi asset(graphics, tilesets, animations), 's' for music/sound
    this.addResource = function(key, path, type)
    {
        if(type == 'g')
            this.graphicsAsset.push(path);
        else if(type == 'm')
        {
            var item = {id:key, src:path, data:1};
            this.musicAsset.push(item);
        }
        else
            console.log("Error, unknown type of resource");
    }
    
    // start  loading 
    // onLoadResource - callback called each time when resource loaded
    // onComplete - callback called when loading complete
    this.runLoad=function(onLoadResource, onComplete)
    {
        this.callbacks.onLoadResource = onLoadResource;
        this.callbacks.onComplete = onComplete;

        // check data
        if( this.graphicsAsset === undefined ||
            this.musicAsset === undefined)
        {
            console.log("ERROR: need call Init method first");
            return;
        }

        this.isComplete = false;
        if(this.graphicsAsset.length !== 0)
        {
            // start loading graphics 
            this.loadGraphics();
        }
        else if(this.musicAsset.length !== 0)
        {
            // there no need to load graphics, only sounds
            this.loadMusic();
        }
        else
        {
            console.log("ERROR: nothing to load, call addResource function");
            return;
        }
    }

    // return how many in persent loaded yet
    this.getStatus= function()
    {
        // check data
        if( this.graphicsAsset === undefined ||
            this.musicAsset === undefined)
        {
            console.log("ERROR: need call Init method first");
            return;
        }
        
        var total = this.graphicsAsset.length + this.musicAsset.length;
        if(total == 0)
            return 0;

        return Math.round((this.currentLoadedCount / total) * 100); 
    }

    // auxiliarry function, DO NOT CALL IT DIRECTLY
    this.loadGraphics = function()
    {
        var hack = this; //FIXME: need to assess to this in callback
        this.graphicsLoader = new PIXI.AssetLoader(this.graphicsAsset);
        this.graphicsLoader.onProgress = function(){
            hack.currentLoadedCount +=1;

            // call user defined callback
            if(hack.callbacks.onLoadResource !== undefined)
                hack.callbacks.onLoadResource(hack);
        };

        // callback 
        this.graphicsLoader.onComplete = function()
        {
            console.log("Graphic resources loading complete");
            
            // call music loader
            if(hack.musicAsset.length !== 0)
            {
                hack.loadMusic();
            }
            else
            {
                console.log("Music resource is not provided, so call finish ");
                if (hack.callbacks.onComplete !== undefined) 
                {
                    hack.callbacks.onComplete(hack);
                }
                hack.isComplete = true;
            }
        }
        this.graphicsLoader.load();
    }

    // auxiliary function, DO NOT CALL IT DIRECTLY
    this.loadMusic= function(event)
    {
        console.log("Start load music and sound");
        var hack=this;
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.addEventListener("fileload",  function(event){
            hack.currentLoadedCount++;
            var total = hack.graphicsAsset.length + hack.musicAsset.length;
            if(hack.currentLoadedCount >= total)
            {
                console.log("all resources loaded");
                if(hack.callbacks.onComplete !== undefined) 
                {
                    hack.callbacks.onComplete(hack);
                }
                hack.isComplete = true;

            }

        });
        createjs.Sound.registerManifest(this.musicAsset, "");
    }


}
