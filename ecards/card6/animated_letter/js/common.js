// return true if run under iphone/ipad/android

DEVICE={
    /*  
        ==================================================================
        If device is mobile use tap metods instead click
        ================================================================== 
     */
    "ClickOrTap":
        function(obj, func)
        {
            if(DEVICE.isMobile())
                obj.tap = func;
            else
                obj.click = func;
        },

    /*  
        ==================================================================
        return true if device is mobile(ipad/iphone/android) 
        ================================================================== 
     */
    "isMobile": 
        function()
        {
            if(navigator.userAgent.match(/Android/i)
                    || navigator.userAgent.match(/iPad/i) 
                    || navigator.userAgent.match(/iPhone/i))
            {
                return true;
            }

            return false;
        }   
};

UTILS = {
    /*  
        ==================================================================
        return random value between fromMin, toMax
        ================================================================== 
     */
    "randomBetween":
        function(fromMin, toMax)
        {
            return Math.random() * (toMax - fromMin) + fromMin;
        },

    /*  
        ==================================================================
        return int random value between min, max
        ================================================================== 
     */
    "intRandomBetween":
        function(min, max) 
        {
            return min + Math.floor(Math.random() * (max - min + 1));
        },

    /*  
        ==================================================================
        return value from "From" to "To" by it measure "0..1" 
        ================================================================== 
     */
    "GetValueBetween":
        function(from, to, mesure) 
        {
            if(mesure > 1.0)
                mesure = 1.0;
            if(mesure < 0.0)
                mesure = 0.0;
            
            return from + (to-from)*mesure;

        },
    /*  
        ==================================================================
        return value from 0..1
        ================================================================== 
     */
    "NormalizeNumber":
        function(number) 
        {
            if(number > 1.0)
                return 1.0 ;
            if(number < 0.0)
                return 0.0; 
            
            return number;
        }
};

// extend Object to add clone function
// taken from here http://my.opera.com/GreyWyvern/blog/show.dml/1725165
Object.prototype.clone = function() 
{
    var newObj = (this instanceof Array) ? [] : {};
    var i;
    for (i in this){
        if (i == 'clone') continue;
        if (this[i] && typeof this[i] == "object")
        {
            newObj[i] = this[i].clone();
        } 
        else 
            newObj[i] = this[i]
    } 

    return newObj;
};

// Helpfull set of functions to work with virtual/device screen
function VirtualScreen() //FIXME: move Screen to DEVICE
{
    // Virtual(game) screen
    this.VirtualScrW = GlobalScale(1920);		// width of virtual(game) window
    this.VirtualScrH = GlobalScale(1200);		// heigth of virtual(game) window
    this.VirtualScrIsPortrait = false;  // if true portrait orienvation will used, false - landspace
    this.VirtualScrAspectRatio = null;

    // Real(device) screen
    this.DeviceScrW = window.innerWidth;	// width of device window
    this.DeviceScrH = window.innerHeight;	// height of device window
    this.DeviceScrAspectRatio = this.DeviceScrW / this.DeviceScrH;

    // Maximum optional width and height of window
    this.MaxOptionalScrW = 2 * this.VirtualScrW;
    this.MaxOptionalScrH = 2 * this.VirtualScrH;

    // Calculated screen width and height for current device
    this.OptionalScrW = null;
    this.OptionalScrH = null;
    this.VirtualToOptionalScaleW = null;	// ratio to get optional screen width by it Virtual coords 
    this.VirtualToOptionalScaleH = null;	// ratio to get optional screen height by it Virtual coords 
    // Calculate scren OptionalScrW/OptionalScrH by given Virtual and Device
    this.Init = function()
    {	
        this.VirtualScrAspectRatio = this.VirtualScrW / this.VirtualScrH;
        this.DeviceScrAspectRatio = this.DeviceScrW / this.DeviceScrH;

        var ow1 = this.DeviceScrW > this.MaxOptionalScrW ? this.MaxOptionalScrW : this.DeviceScrW;
        var oh1 = parseInt(ow1/this.VirtualScrAspectRatio);

        var oh2 = this.DeviceScrH > this.MaxOptionalScrH ? this.MaxOptionalScrH : this.DeviceScrH;
        var ow2 = parseInt(oh2 * this.VirtualScrAspectRatio);

        if(oh1 <= this.DeviceScrH)
        {
            this.OptionalScrW = ow1;
            this.OptionalScrH = oh1;
        }
        else
        {
            this.OptionalScrW = ow2;
            this.OptionalScrH = oh2;
        }

        this.VirtualToOptionalScaleW = this.OptionalScrW / this.VirtualScrW;
        this.VirtualToOptionalScaleH = this.OptionalScrH / this.VirtualScrH;	
    }

    this.DebugPrint = function()
    {
        // print usefull data
        console.log("=========================== Screen.DebugPrint ========================== ");
        console.log("VirtualScr:"+this.VirtualScrW+" X "+this.VirtualScrH);
        console.log("DeviceScr:"+this.DeviceScrW+" X "+this.DeviceScrH);
        console.log("OptionalScr:"+this.OptionalScrW+" X "+this.OptionalScrH);
        console.log("VirtualToOptionalScale: "+this.VirtualToOptionalScaleW+" X "+this.VirtualToOptionalScaleH);
    }

}
Screen = new VirtualScreen(); // global var
Screen.Init();
//Screen.DebugPrint();



// remove all children from scene object. Be carefull with complex objects, does not remove in deep(recursive)
function removeAllChild(obj)
{
    for(var c = 0; c < obj.children.length; c++)
    {
        obj.removeChild(obj.children[c]);
    }
}

// select appropriate font size
function selectFontSize(text,           // text - to to print
                        fontFamily,     // fontFamily - font family 
                        rectangle,      // rectangle={"w","h"} bounding box rectagle
                        wordWrap,       // wordWrap - need word wrap text or not
                        textallign,     // textallign - text allign, can be "center", "left", "right"
                        minMaxSize)     // {"min", "max"} min and max font size
{

    var startFontHeight = minMaxSize.min;
    var endFontHeight = minMaxSize.max;

    var curFontHeight = startFontHeight;
    for(fs = startFontHeight; fs < endFontHeight; fs++)
    {
        // setup font parameters
        var style = {   font:""+fs+"px '"+ fontFamily +"'",
                        fill: "#ffffff",
                        align:textallign};
        if(wordWrap === true)
        {    
            style.wordWrap = true;
            style.wordWrapWidth = rectangle.w;
        }

        var textObj = new PIXI.Text(text, style);
        if((textObj.width > rectangle.w) || (textObj.height > rectangle.h))
            break;  // found

        curFontHeight++;
    }
    
    return curFontHeight;
}
