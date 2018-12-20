// sound manager
function SoundManager()
{	
    this.canPlaySound = undefined;	// true if SoundManager able play sound and music, false otherwice
    this.continiousSoundItems = new Array();
    this.lostFocusInfo = {state:false, mute: false}; // state - current state - true - on focus, false oterwice, mute - previous state of mute

    //Init soundmanager and load sounds
    this.Init = function()
    {	
        this.canPlaySound = createjs.Sound.initializeDefaultPlugins();
        if(this.canPlaySound === false) 
        {    
            console.log("device can not play sound");
            return;
        }

        //FIXME: probably need move this to somewhere
        window.addEventListener('focus', function() {
            //console.log("window on focus");
            //document.title = 'focused';
            SoundManager.onFocus();
        });

        window.addEventListener('blur', function() {
            //console.log("window on blur");
            //document.title = 'not focused';
            SoundManager.onBlur();
        });
    }

    // called when 
    this.onFocus = function()
    {
        this.lostFocusInfo.state = true;
        // restore state when has focus 
        //console.log("mutestate:"+ this.lostFocusInfo.mute);
        if(this.lostFocusInfo.mute === true)
        {
            this.Mute();
        }
        else
        {
            this.Unmute();
        }
    }

    this.onBlur = function()
    {
        this.lostFocusInfo.state = false;
        this.lostFocusInfo.mute = this.GetMute();
        //console.log("mutestate2:"+ this.lostFocusInfo.mute);
        this.Mute();
    }
                

    // Play "looped" sound
    this.PlayLooped = function(name)
    {
        if(this.canPlaySound === false)
            return;
        createjs.Sound.play(name, {loop:-1});
    }

    // start play looped sound and if call this function again with same name continue play previous
    // suitable for looped backgroud music
    this.PlayContiniousSound = function(name)
    {
        if(this.canPlaySound === false)
            return;

        // check is sound already played
        if(this.isContiniousSound(name) === true)
            return;
        else
        {
            createjs.Sound.play(name, {loop:-1});
            this.continiousSoundItems.push(name);
        }
    }

    // Play sound
    this.Play = function(name)
    {
        if(this.canPlaySound === false)
            return;
        createjs.Sound.play(name);
    }

    // stop current sound
    this.Stop = function(name)
    {
        if(this.canPlaySound === false)
            return;
        createjs.Sound.stop(name);
        this.removeContiniousSound(name);
    }

    // mute all sounds
    this.Mute = function()
    {
        if(this.canPlaySound === false)
            return;
        createjs.Sound.setMute(true);
    }

    // mute all sounds
    this.Unmute = function()
    {
        if(this.canPlaySound === false)
            return;
        createjs.Sound.setMute(false);
    }

    this.GetMute = function()
    {
        if(this.canPlaySound === false)
            return;
        return createjs.Sound.getMute();
    }
    
    // set mute if not mute, and otherwice
    this.RevertMute = function()
    {
        console.log("Current mute state: " +this.GetMute());
        this.GetMute() ? this.Mute() : this.Unmute();
    }

    // return true if name sound is continious, FOR INTERNAL USE ONLY
    this.isContiniousSound = function(name)
    {
        for(var i = 0; i < this.continiousSoundItems.length; ++i)
        {
            if(this.continiousSoundItems[i] == name)
                return true;
        }

        return false;
    }

    // remove continious sound name from list
    this.removeContiniousSound = function(name)
    {
        if(this.isContiniousSound(name) !== true)
        {
            console.log("Can not find continious sound by name");
            return;
        }

        for(var i=0; i < this.continiousSoundItems.length; ++i)
        {
            if(this.continiousSoundItems[i] == name)
                this.continiousSoundItems[i] = undefined;
        }
    }
}

// Global object 
var SoundManager = new SoundManager();
