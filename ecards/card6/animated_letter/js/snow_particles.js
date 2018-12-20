// suitable for snow 
function ShowParticles()
{
    this.rootContainer = undefined;
    this.objContainer = undefined;


    // default settings
    // FIXME: move it 
    this.Count = 40;	// particle number
    this.particles = new Array();
    this.particleArea = {"X": GlobalScale(-32), "Y":GlobalScale(-32), "W":Screen.VirtualScrW + GlobalScale(32), "H":Screen.VirtualScrH + GlobalScale(32)};
    this.SpeedX = {"Min":-0.5, "Max":0.5};	// min-max speed
    this.SpeedY = {"Min":0.7, "Max":1.3};	// min-max speed
    this.Scale = {"Min":0.5, "Max":1.3};	// min-max scale factor
    this.ScaleFade = {"From":1.0, "To":1.0};	// Scale fade during lifetime in persents from this.Scale !!!
    this.Alpha = {"Min":0.2, "Max":0.8};	// alpha at sturtup
    this.AlphaFade = {"From":1, "To":1};	// alfa fade during lifetime in percents from this.Alpha !!!!!
    this.RotationSpeed = {"Min":0.001, "Max":0.005};	// rotation speed
    this.CloudTexture = new Array("./img/img/snowflake1.png");

    // fill valude from description structure, 
    // skip if field not set
    this.Fill = function(descr)
    {
        if(descr === undefined)
            return;

        if(descr.Count !== undefined)
            this.Count = descr.Count;

        if(descr.particleArea !== undefined)
            this.particleArea = descr.particleArea;

        if(descr.SpeedX !== undefined)
            this.SpeedX = descr.SpeedX;

        if(descr.SpeedY !== undefined)
            this.SpeedY = descr.SpeedY; 

        if(descr.Scale !== undefined)
            this.Scale = descr.Scale; 

        if(descr.ScaleFade !== undefined)
            this.ScaleFade = descr.ScaleFade; 

        if(descr.Alpha !== undefined)
            this.Alpha = descr.Alpha;
        
        if(descr.AlphaFade !== undefined)
            this.AlphaFade = descr.AlphaFade;

        if(descr.RotationSpeed !== undefined)
            this.RotationSpeed = descr.RotationSpeed;

        if(descr.CloudTexture !== undefined)
            this.CloudTexture = descr.CloudTexture;

    }
    // Called to init object
    this.Init = function (rootContainer, descr)
    {
        this.Fill(descr);

        this.rootContainer = rootContainer;
        this.objContainer = new PIXI.DisplayObjectContainer();
        this.rootContainer.addChild(this.objContainer);

        //
        for(var c=0; c < this.Count; c++)
        {	
            // get random from [this..Y to this.particleArea.Y + this.particleArea.H]
            var randSpeedX = UTILS.randomBetween(this.SpeedX.Min, this.SpeedX.Max );
            var randSpeedY = UTILS.randomBetween(this.SpeedY.Min, this.SpeedY.Max );
            var textureFile = UTILS.intRandomBetween(0,  this.CloudTexture.length - 1);
            var randScale = UTILS.randomBetween(this.Scale.Min, this.Scale.Max ) * this.ScaleFade.From;
            var randAlpha = UTILS.randomBetween(this.Alpha.Min, this.Alpha.Max ) * this.AlphaFade.From;
            var randRotationSpeed = UTILS.randomBetween(this.RotationSpeed.Min, this.RotationSpeed.Max );

            var cloud = {	
                            "Speed":{"X":randSpeedX, "Y":randSpeedY},
                            "Sprite": new PIXI.Sprite(PIXI.Texture.fromImage(this.CloudTexture[textureFile])),
                            "RotationSpeed": randRotationSpeed,
                            "Alpha": randAlpha, 
                            "Scale": randScale 
                        };

            // setup cloud
            //FIXME: need rewrite
            cloud.Sprite.position.x = Math.round(Math.random() * this.particleArea.W + this.particleArea.X);
            cloud.Sprite.position.y = Math.round(Math.random() * this.particleArea.H + this.particleArea.Y);
            cloud.Sprite.scale.x = cloud.Scale;
            cloud.Sprite.scale.y = cloud.Scale;
            cloud.Sprite.anchor.x = 0.5;
            cloud.Sprite.anchor.y = 0.5;
            cloud.Sprite.alpha = cloud.Alpha;
            this.objContainer.addChild(cloud.Sprite);	

            this.particles.push(cloud);
        }
    }

    // called to update
    this.Update = function()
    {
        for(var c=0; c < this.Count; c++)
        {
            var particle = this.particles[c];
            // update position
            particle.Sprite.position.x += particle.Speed.X;
            particle.Sprite.position.y += particle.Speed.Y;
            
            // detect lifetime from 0..1
            var life = (particle.Sprite.position.y - this.particleArea.Y) / this.particleArea.H;
            life = UTILS.NormalizeNumber(life);
            // invert if movement from "down" to "up"
            if(particle.Speed.Y < 0)
                life = 1.0 - life;
            
            particle.Sprite.alpha = particle.Alpha * UTILS.GetValueBetween(this.AlphaFade.From, this.AlphaFade.To, life);
            var scale = particle.Scale * UTILS.GetValueBetween(this.ScaleFade.From, this.ScaleFade.To, life);
            particle.Sprite.scale.x = scale;
            particle.Sprite.scale.y = scale;

            // Update rotation
            particle.Sprite.rotation += particle.RotationSpeed;

            if( 
                particle.Sprite.position.y > this.particleArea.Y + this.particleArea.H ||
                particle.Sprite.position.y < this.particleArea.Y)
            {
                var randSpeedX = UTILS.randomBetween(this.SpeedX.Min, this.SpeedX.Max );
                var randSpeedY = UTILS.randomBetween(this.SpeedY.Min, this.SpeedY.Max );
                var randScale = UTILS.randomBetween(this.Scale.Min, this.Scale.Max ) * this.ScaleFade.From;
                var randAlpha = UTILS.randomBetween(this.Alpha.Min, this.Alpha.Max ) * this.AlphaFade.From;
                var randRotationSpeed = UTILS.randomBetween(this.RotationSpeed.Min, this.RotationSpeed.Max );

                particle.Sprite.position.x =  Math.round(Math.random() * this.particleArea.W + this.particleArea.X);

                // up-down direction
                if(particle.Speed.Y >= 0)
                    particle.Sprite.position.y = this.particleArea.Y;
                else
                    particle.Sprite.position.y = this.particleArea.Y + this.particleArea.H;

                particle.Alpha = randAlpha;
                particle.Scale = randScale;

                particle.Sprite.alpha = particle.Alpha; 
                particle.Sprite.scale.x = particle.Scale;
                particle.Sprite.scale.y = particle.Scale;
                particle.Speed.X = randSpeedX;
                particle.Speed.Y = randSpeedY;
                particle.RotationSpeed = randRotationSpeed;
            }	
        }
    }

    this.Free = function()
    {

    }
}

