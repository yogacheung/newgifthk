// Use animated movie clips to make particle effect 
// rootContainer - scene container where place particles
// descr - particle description, see this.defaultSettings for details
function StaticParticles(rootContainer, descr)
{
    this.rootContainer = undefined;
    this.objContainer = undefined;

    this.tickCount = 0;
    
    // default settings
    this.defaultSettings = 
    {
        Count: 20,	// particle number
        ParticleArea: {"X": GlobalScale(300), "Y":GlobalScale(50), "W":Screen.VirtualScrW - GlobalScale(500), "H":Screen.VirtualScrH - GlobalScale(100)}, // area where particles will exist
        Scale: {"Min":1.0, "Max":2.0},	// min-max scale factor
        Alpha: {"Min":0.9, "Max":1.0},	// alpha at sturtup
        Rotation: {"Min":0.0, "Max": 3.14},	// rotation speed
        AnimationPlaySpeed: {"Min": 0.3, "Max": 0.5},
        Textures: [
                    {name: "move_partile_1_", frames: 11, start: 1}, 
                    {name: "move_partile_2_", frames: 26, start: 1},
                    {name: "move_partile_3_", frames: 11, start: 1} 
                  ],

        ParallaxScroll : 0.3        // scroll speed when paralax
    };
    
    this.currentSettings = undefined; 
    this.particles = new Array();

    // fill valude from description structure, 
    // skip if field not set
    this.InitSettings = function(descr)
    {
        this.currentSettings = this.defaultSettings;

        if(descr === undefined)
            return;

        for(var name in descr)
            this.currentSettings[name] = descr[name];
    }

    // Called to init object
    this.Init = function (rootContainer, descr)
    {
        this.tickCount = 0;
        this.InitSettings(descr);

        this.rootContainer = rootContainer;
        this.objContainer = new PIXI.DisplayObjectContainer();
        this.rootContainer.addChild(this.objContainer);

        //
        for(var c=0; c < this.currentSettings.Count; c++)
        {	
            var textureId = UTILS.intRandomBetween(0, this.currentSettings.Textures.length - 1)
            var textureDescr = this.currentSettings.Textures[textureId];
            
            var particle = jsonToMovieClip(textureDescr.name, textureDescr.frames, ".png", textureDescr.start);
            particle.loop = false;
            particle.anchor = {x: 0.5, y: 0.5};
            particle.controllerClass = this;
            // parameters
            this.newParameters_(particle);
             
            particle.onComplete = function(param)
            {
                this.controllerClass.newParameters_(this);
                this.gotoAndPlay(0);
            }

            particle.play(); // run animation
            this.objContainer.addChild(particle);
            this.particles.push(particle);
        }
    }

    // called to update
    this.Update = function()
    {
        this.tickCount +=1;
    }

    this.Free = function()
    {

    }
	
    // parallax scroll 
    this.Scroll = function(currentAmplitude)
    {
        this.objContainer.position.x = this.currentSettings.ParallaxScroll * currentAmplitude;  
    }

    this.newParameters_ = function(particle)
    {
        // change particle parameters
        var x_pos = UTILS.intRandomBetween(this.currentSettings.ParticleArea.X, this.currentSettings.ParticleArea.X + this.currentSettings.ParticleArea.W);
        var y_pos = UTILS.intRandomBetween(this.currentSettings.ParticleArea.Y, this.currentSettings.ParticleArea.Y + this.currentSettings.ParticleArea.H);
        particle.position = {x: x_pos, y:y_pos}; 
        particle.animationSpeed = UTILS.randomBetween(this.currentSettings.AnimationPlaySpeed.Min, this.currentSettings.AnimationPlaySpeed.Max);
        particle.alpha = UTILS.randomBetween(this.currentSettings.Alpha.Min, this.currentSettings.Alpha.Max);
        particle.rotation = UTILS.randomBetween(this.currentSettings.Rotation.Min, this.currentSettings.Rotation.Max);

        var scale = UTILS.randomBetween(this.currentSettings.Scale.Min, this.currentSettings.Scale.Max);
        particle.scale = {x: scale, y: scale};
    }

    this.Init(rootContainer, descr);
}

