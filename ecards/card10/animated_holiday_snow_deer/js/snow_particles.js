// suitable for snow 
function ShowParticles()
{
    this.rootContainer = undefined;
    this.objContainer = undefined;

    // default settings
    this.defaultSettings = {
        Count : 50,	// particle number
        particleArea : {"X": GlobalScale(300), "Y":GlobalScale(-50), "W":(Screen.VirtualScrW - GlobalScale(300)), "H":(Screen.VirtualScrH + GlobalScale(50))},
        SpeedX : {"Min":-0.5, "Max":0.5},	// min-max speed
        SpeedY : {"Min":0.7, "Max":1.3},	// min-max speed
        Scale : {"Min":0.5, "Max":1.3},	// min-max scale factor
        ScaleFade : {"From":1.0, "To":1.0},	// Scale fade during lifetime in persents from this.Scale !!!
        Alpha : {"Min":0.2, "Max":0.8},	// alpha at sturtup
        AlphaFade : {"From":1, "To":1},	// alfa fade during lifetime in percents from this.Alpha !!!!!
        RotationSpeed : {"Min":0.001, "Max":0.005},	// rotation speed
        PulsationAmplitude : {"Min":-5, "Max":5},	// x pulsation amplitude max (in px)
        PulsationSpeed : {"Min":0.04, "Max":0.08},	// x pulsation speed
        parallaxScroll : 0.3,
        CloudTexture : new Array("./img/img/snowflake1.png")
    };
    
    this.currentSettings = undefined;
    this.particles = new Array();
    this.tickCount = 0;

    // init default settings with user specified settings
    // skip if field not set
    this.InitSettings = function(descr)
    {
        //FIXME: need init this.particles and this.tickCount
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

        // alias 
        var s = this.currentSettings;
        for(var c=0; c < s.Count; c++)
        {	
            // get random from [this..Y to this.particleArea.Y + this.particleArea.H]
            var randSpeedX = UTILS.randomBetween(s.SpeedX.Min, s.SpeedX.Max );
            var randSpeedY = UTILS.randomBetween(s.SpeedY.Min, s.SpeedY.Max );
            var textureFile = UTILS.intRandomBetween(0,  s.CloudTexture.length - 1);
            var randScale = UTILS.randomBetween(s.Scale.Min, s.Scale.Max ) * s.ScaleFade.From;
            var randAlpha = UTILS.randomBetween(s.Alpha.Min, s.Alpha.Max ) * s.AlphaFade.From;
            var randRotationSpeed = UTILS.randomBetween(s.RotationSpeed.Min, s.RotationSpeed.Max );
            var pulsationAmp = UTILS.randomBetween(s.PulsationAmplitude.Min, s.PulsationAmplitude.Max );
            var pulsationSpeed = UTILS.randomBetween(s.PulsationSpeed.Min, s.PulsationSpeed.Max );

            var cloud = {	
                            "Speed":{"X":randSpeedX, "Y":randSpeedY},
                            "Sprite": new PIXI.Sprite(PIXI.Texture.fromImage(s.CloudTexture[textureFile])),
                            "RotationSpeed": randRotationSpeed,
                            "Alpha": randAlpha, 
                            "Scale": randScale,
                            "PulsationAmplitude": pulsationAmp,
                            "PulsationSpeed": pulsationSpeed,
                            "X": UTILS.randomBetween(s.particleArea.X, s.particleArea.X + s.particleArea.W),
                            "Y": UTILS.randomBetween(s.particleArea.Y, s.particleArea.Y + s.particleArea.H)
                            //"X": Math.round(Math.random() * s.particleArea.W + s.particleArea.X),
                            //"Y": Math.round(Math.random() * s.particleArea.H + s.particleArea.Y)  
                        };

            // setup cloud
            //FIXME: need rewrite
            cloud.Sprite.position.x = cloud.X + cloud.PulsationAmplitude * Math.cos(this.tickCount * cloud.PulsationSpeed);
            cloud.Sprite.position.y = cloud.Y;//Math.round(Math.random() * s.particleArea.H + s.particleArea.Y);
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
        this.tickCount +=1;
        var s = this.currentSettings;

        for(var c=0; c < s.Count; c++)
        {
            var particle = this.particles[c];
            // update position
            particle.X += particle.Speed.X ;
            particle.Y += particle.Speed.Y ;
            //bind particle.X/particle.Y to sprite x and y
            var a = particle.PulsationAmplitude * Math.cos(this.tickCount * particle.PulsationSpeed);
            particle.Sprite.position.x = particle.X + a;
            particle.Sprite.position.y = particle.Y;
            
            // detect lifetime from 0..1
            var life = (particle.Sprite.position.y - s.particleArea.Y) / s.particleArea.H;
            life = UTILS.normalizeNumber(life);
            // invert if movement from "down" to "up"
            if(particle.Speed.Y < 0)
                life = 1.0 - life;
            
            particle.Sprite.alpha = particle.Alpha * UTILS.getValueBetween(s.AlphaFade.From, s.AlphaFade.To, life);
            var scale = particle.Scale * UTILS.getValueBetween(s.ScaleFade.From, s.ScaleFade.To, life);
            particle.Sprite.scale.x = scale;
            particle.Sprite.scale.y = scale;

            // Update rotation
            particle.Sprite.rotation += particle.RotationSpeed;
            
            var needUpdate = false;// true if need update particle state (alpha)
            // x position
            if((particle.Speed.X > 0) && (particle.X > s.particleArea.X + s.particleArea.W))
            {
                particle.X -= s.particleArea.W;
                needUpdate = true;
            }
            else if((particle.Speed.X < 0) && (particle.X < s.particleArea.X))
            {
                particle.X += s.particleArea.W;
                needUpdate = true;
            }

            // y position
            if((particle.Speed.Y > 0) && (particle.Y > s.particleArea.Y + s.particleArea.H))
            {
                particle.Y -= s.particleArea.H;
                needUpdate = true;
            }
            else if((particle.Speed.Y < 0) && (particle.Y < s.particleArea.Y))
            {
                particle.Y += s.particleArea.H;
                needUpdate = true;
            }
            
            // if need update particle state
            if(needUpdate)
            {
                var randAlpha = UTILS.randomBetween(s.Alpha.Min, s.Alpha.Max ) * s.AlphaFade.From; //var randScale = UTILS.randomBetween(this.Scale.Min, this.Scale.Max ) * this.ScaleFade.From;
                var randSpeedX = UTILS.randomBetween(s.SpeedX.Min, s.SpeedX.Max );
                var randSpeedY = UTILS.randomBetween(s.SpeedY.Min, s.SpeedY.Max );
                var randRotationSpeed = UTILS.randomBetween(s.RotationSpeed.Min, s.RotationSpeed.Max );
                var pulsationAmp = UTILS.randomBetween(s.PulsationAmplitude.Min, s.PulsationAmplitude.Max );
                var pulsationSpeed = UTILS.randomBetween(s.PulsationSpeed.Min, s.PulsationSpeed.Max );

                particle.Alpha = randAlpha;
                //particle.Scale = randScale;

                particle.Sprite.alpha = particle.Alpha; 
                particle.Sprite.scale.x = particle.Scale;
                particle.Sprite.scale.y = particle.Scale;
                particle.Speed.X = randSpeedX;
                particle.Speed.Y = randSpeedY;
                particle.RotationSpeed = randRotationSpeed;
                particle.PulsationAmplitude = pulsationAmp;
                particle.PulsationSpeed = pulsationSpeed;
            }
            //if( 
                //particle.Sprite.position.y > this.particleArea.Y + this.particleArea.H ||
                //particle.Sprite.position.y < this.particleArea.Y)
            //{


                //// 
                //particle.X = Math.round(Math.random() * this.particleArea.W + this.particleArea.X);
                //particle.Sprite.position.x = particle.X; 

                //// up-down direction
                //if(particle.Speed.Y >= 0)
                    //particle.Sprite.position.y = this.particleArea.Y;
                //else
                    //particle.Sprite.position.y = this.particleArea.Y + this.particleArea.H;


                //particle.Sprite.alpha = particle.Alpha; 
                //particle.Sprite.scale.x = particle.Scale;
                //particle.Sprite.scale.y = particle.Scale;
                //particle.Speed.X = randSpeedX;
                //particle.Speed.Y = randSpeedY;
                //particle.RotationSpeed = randRotationSpeed;
                //particle.PulsationAmplitude = pulsationAmp;
                //particle.PulsationSpeed = pulsationSpeed;
            //}	
        }
    }

    this.Free = function()
    {

    }
	
    // parallax scroll 
    this.Scroll = function(currentAmplitude)
    {
        this.objContainer.position.x = this.parallaxScroll * currentAmplitude;  
    }
}

