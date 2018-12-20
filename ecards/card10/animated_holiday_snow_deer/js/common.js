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

        ================================================================== 
     */
    "MouseOrFingerMove":
        function(obj, func)
        {
            if(DEVICE.isMobile())
                obj.touchmove= func;
            else
                obj.mousemove= func;
        },
    /*  
        ==================================================================
        return true if current device Windows Phone 
        http://stackoverflow.com/questions/9926504/how-do-i-check-windows-phone-useragent-with-javascript
        ================================================================== 
     */
    "isWinPhone": 
        function()
        {
            return  navigator.userAgent.match(/Windows Phone/i) ||
                    navigator.userAgent.match(/iemobile/i) ||
                    navigator.userAgent.match(/WPhone/i);
        },  
    /*  
        ==================================================================
        return true if current device android 
        ================================================================== 
     */
    "isAndroid": 
        function()
        {
            return navigator.userAgent.match(/Android/i);
        },   

    /*  
        ==================================================================
        return true if current device ipad
        ================================================================== 
     */
    "isIpad": 
        function()
        {
            return navigator.userAgent.match(/iPad/i);
        },   

    /*  
        ==================================================================
        return true if current device iphone 
        ================================================================== 
     */
    "isIphone": 
        function()
        {
            return navigator.userAgent.match(/iPhone/i);
        },   

    /*  
        ==================================================================
        return true if device is mobile(ipad/iphone/android) 
        ================================================================== 
     */
    "isMobile": 
        function()
        {
            return  DEVICE.isWinPhone() || 
                    DEVICE.isAndroid() ||
                    DEVICE.isIpad() ||
                    DEVICE.isIphone();
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
    "getValueBetween":
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
    "normalizeNumber":
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
    this.VirtualScrH = GlobalScale(1080);		// heigth of virtual(game) window
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
        if(textObj.height > rectangle.h)
            break;  // found

        curFontHeight++;
    }
    
    return curFontHeight;
}

// convert json object to PIXI.MovieClip
// perfix - perfix for each frame (example: frame_)
// frames - number of frames 
// ext - (default .png) extension of frame (in json)
// start (default 1) from which frame start
function jsonToMovieClip(perfix, frames, ext, start)
{
    start = (start !== undefined) ? start : 1;
    ext = (ext !== undefined) ? ext : ".png";
    var texturesArray = new Array();
    for(var f = start; f <= frames; f++)
    {
        var frameFileName = perfix + f + ext;
        var texture = PIXI.Texture.fromFrame(frameFileName);
        texturesArray.push(texture);

    }

    return new PIXI.MovieClip(texturesArray);
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
// EAMPLE:
//points = [
//{x: 0, y: 0},
//{x: 0, y: 50},
//{x: 50, y: 10},
//{x: -50, y: -10},
//{x: 0, y: -50},
//{x: 0, y: 0}
//];
//alert(isPointInPoly(points, {x: 10, y: 10}) ? "In" : "Out");

function isPointInPoly(poly, pt)
{
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}

// allign text
// return coordinate (x) of text according it allign, position and width
// allignType - one of "center", "left", "right'
// positionX - x coordinate of object's bounding box
// width - width of bounding box (max bounding box to place text, not a current text bounding box)
function allignTextX(allignType, positionX, width)
{
    if(allignType == "left")
        return {pos:positionX, actor: 0};
    else if(allignType == "center")
        return {pos:(positionX + width * 0.5), actor: 0.5};
    else if(allignType == "right")
        return {pos: (positionX + width), actor: 1.0};

    console.log("unknown allignment");
    
    return undefined;


}


// auxiliary function to read and init logo, principials and message elements
// rootObject - container to store object
// dimensions - {"w", "h"}, default {"w":150, "h":150}
function initLogo(rootObject)
{
    // logo image from xml
    var logo = GAME.xmlSettings.letter.logo;
    if(logo === undefined || logo === "")
    {
        console.log("logo image is not set");
        return undefined;
    }

    // read width and height from xml file and check if it provided
    var rect_width = GAME.xmlSettings.letter.logo_rectWidth;
    if(rect_width === undefined)
    {    
        console.log("logo logo_rectWidth is not set, use default");
        rect_width = 250;
    }
    else
        rect_width = parseInt(rect_width, 10);

    var rect_height = GAME.xmlSettings.letter.logo_rectHeight;
    if(rect_height === undefined)
    {    
        console.log("logo logo_rectHeight is not set, use default");
        rect_height = 250;
    }
    else
        rect_height = parseInt(rect_height, 10);
    
    // read positon of rect
    var rect_x = GAME.xmlSettings.letter.logo_rectX;
    if(rect_x === undefined)
    {
        console.log("logo logo_rectX is not set, use default");
        rect_x = 500;
    }
    else
        rect_x = parseInt(rect_x, 10);

    var rect_y = GAME.xmlSettings.letter.logo_rectY;
    if(rect_y === undefined)
    {    
        console.log("logo logo_rectY is not set, use default");
        rect_y = 700;
    }
    else
        rect_y = parseInt(rect_y, 10);

    // allignment of logo
    var allign = GAME.xmlSettings.letter.logo_allign;
    if(allign === undefined)
    {    
        console.log("logo allign is not set, use default");
        allign = "center";
    }
    
    var vAllign = GAME.xmlSettings.letter.logo_vallign;
    if(vAllign=== undefined)
    {    
        console.log("logo vAllign is not set, use default");
        vAllign = "center";
    }

    var texture = new PIXI.Texture(new PIXI.BaseTexture(htmlLogoImg));// htmlLogoImg defined on index.html
    var logo = new PIXI.Sprite(texture);
    logo.anchor.x = 0.5;
    logo.anchor.y = 0.5;
    
    // setup position for logo
    if(allign == "left")
        logo.position.x = rect_x + logo.width / 2;
    else if(allign == "center")
        logo.position.x = rect_x + rect_width / 2;
    else if(allign == "right")
        logo.position.x = rect_x + rect_width - logo.width / 2;
    else
        console.log("allign for logo not valid");

    if(vAllign == "top")
        logo.position.y = rect_y + logo.height / 2;
    else if(vAllign == "center")
        logo.position.y = rect_y +  rect_height / 2;
    else if(vAllign == "bottom")
        logo.position.y = rect_y + rect_height - logo.height / 2;


    // add interactivity to logo
    var url = "http://"+GAME.xmlSettings.letter.url;
    if((url !== undefined) && (url !== ""))
    {
        logo.interactive = true;
        logo.buttonMode = true;
        DEVICE.ClickOrTap(logo, function(data){	
                window.open(url, '_blank');
                }); 
    }

    rootObject.addChild(logo);

    // check if debug mode is enabled
    if(GAME.xmlSettings.letter.logo_debug === "true")
    {
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0x0000FF, 0.5);
        graphics.drawRect(rect_x, rect_y, rect_width, rect_height);

        rootObject.addChild(graphics);
    }
    
    return logo;
    
}

// principials
// rootObject - root scene object
// wrap - {w,h} wrap area for text 
function initPrincipials(rootObject, wrap)
{
    var text = GAME.xmlSettings.letter.principal;
    var fontFamily = GAME.xmlSettings.font.principal.family;
    var fontColor = GAME.xmlSettings.font.principal.color;
    var fontHeight = GAME.xmlSettings.font.principal.size;
    var wWrap = true;
    var wWrapWidth = wrap.w;

    // read x,y position and convert to numeric value 
    var textPos_x = GlobalScale(GAME.xmlSettings.font.principal.x);
    textPos_x = parseInt(textPos_x, 10);
    var textPos_y = GlobalScale(GAME.xmlSettings.font.principal.y);
    textPos_y = parseInt(textPos_y, 10);

    var align = GAME.xmlSettings.font.principal.align;
    // calculate x coordinate and x actor according to it allign
    var posAndActor = allignTextX(align, textPos_x, wWrapWidth);

    if(fontHeight == "auto")
    {
        var fontMin = parseInt(GAME.xmlSettings.font.principal.sizemin, 10);
        var fontMax = parseInt(GAME.xmlSettings.font.principal.sizemax, 10);
        fontHeight = selectFontSize(text, 
                                    fontFamily,
                                    {"w":wWrapWidth, "h": wrap.h},
                                    wWrap, 
                                    align,
                                    {"min":fontMin, "max":fontMax});

    }

    var principalTextStyle= {   font:""+fontHeight+"px '"+ fontFamily +"'",
                                fill: fontColor,
                                align: align,
                                wordWrap:wWrap,
                                wordWrapWidth:wWrapWidth
                            };
    

    var principialText = new PIXI.Text(text, principalTextStyle);
    principialText.cacheAsBitmap = true;
    principialText.anchor.x = posAndActor.actor;
    principialText.anchor.y = 0;
    principialText.position.x = posAndActor.pos;
    principialText.position.y = textPos_y;
    rootObject.addChild(principialText);

    return principialText;
}


// init message (read settings from config, create object)
// rootObject - root scene object
// wrap - {w,h} wrap area for text 
function initMessage(rootObject, wrap)
{
    var text = GAME.xmlSettings.letter.message;
    var fontFamily = GAME.xmlSettings.font.message.family;
    var fontColor = GAME.xmlSettings.font.message.color;
    var fontHeight = GAME.xmlSettings.font.message.size;
    var wWrap = true;
    var wWrapWidth = wrap.w;

    // read x,y position and convert to numeric value 
    var textPos_x = GlobalScale(GAME.xmlSettings.font.message.x);
    textPos_x = parseInt(textPos_x, 10);
    var textPos_y = GlobalScale(GAME.xmlSettings.font.message.y);
    textPos_y = parseInt(textPos_y, 10);

    var align = GAME.xmlSettings.font.message.align;

    // calculate x coordinate and x actor according to it allign
    var posAndActor = allignTextX(align, textPos_x, wWrapWidth);

    if(fontHeight == "auto")
    {
        var fontMin = parseInt(GAME.xmlSettings.font.message.sizemin, 10);
        var fontMax = parseInt(GAME.xmlSettings.font.message.sizemax, 10);
        fontHeight = selectFontSize(text, 
                                    fontFamily,
                                    {"w":wWrapWidth, "h": wrap.h},
                                    wWrap, 
                                    align,
                                    {"min":fontMin, "max":fontMax});
    }

    var messageTextStyle= {   font:""+fontHeight+"px '"+ fontFamily +"'",
                                fill: fontColor,
                                align: align,
                                wordWrap:wWrap,
                                wordWrapWidth:wWrapWidth
                            };
    var messageText = new PIXI.Text(text, messageTextStyle);
    messageText.cacheAsBitmap = true;
    messageText.anchor.x = posAndActor.actor; 
    messageText.anchor.y = 0;
    messageText.position.x = posAndActor.pos; 
    messageText.position.y = GlobalScale(GAME.xmlSettings.font.message.y);
    rootObject.addChild(messageText);
    
    return messageText;
}

// init signature (read settings from config, create object)
// rootObject - root scene object
// wrap - {w,h} wrap area for text 
function initSignature(rootObject, wrap)
{
    var text = GAME.xmlSettings.letter.signature;
    var fontFamily = GAME.xmlSettings.font.signature.family;
    var fontColor = GAME.xmlSettings.font.signature.color;
    var fontHeight = GAME.xmlSettings.font.signature.size;
    var wWrap = true;
    var wWrapWidth = wrap.w;

    // read x,y position and convert to numeric value 
    var textPos_x = GlobalScale(GAME.xmlSettings.font.signature.x);
    textPos_x = parseInt(textPos_x, 10);
    var textPos_y = GlobalScale(GAME.xmlSettings.font.signature.y);
    textPos_y = parseInt(textPos_y, 10);

    var align = GAME.xmlSettings.font.signature.align;

    // calculate x coordinate and x actor according to it allign
    var posAndActor = allignTextX(align, textPos_x, wWrapWidth);

    if(fontHeight == "auto")
    {
        var fontMin = parseInt(GAME.xmlSettings.font.signature.sizemin, 10);
        var fontMax = parseInt(GAME.xmlSettings.font.signature.sizemax, 10);
        fontHeight = selectFontSize(text, 
                                    fontFamily,
                                    {"w":wWrapWidth, "h": wrap.h},
                                    wWrap, 
                                    align,
                                    {"min":fontMin, "max":fontMax});
    }

    var signatureTextStyle= {   font:""+fontHeight+"px '"+ fontFamily +"'",
                                fill: fontColor,
                                align: align,
                                wordWrap:wWrap,
                                wordWrapWidth:wWrapWidth
                            };
    var signatureText = new PIXI.Text(text, signatureTextStyle);
    signatureText.cacheAsBitmap = true;
    signatureText.anchor.x = posAndActor.actor; 
    signatureText.anchor.y = 0;
    signatureText.position.x = posAndActor.pos; 
    signatureText.position.y = GlobalScale(GAME.xmlSettings.font.signature.y);
    rootObject.addChild(signatureText);
}

// Create settigns button
// root - scene object where insert music button
// settings.Enable - texture when button enabled
// settings.Disable - texture when button disabled
// pos.x - default X position of sound button
// pos.y - default Y position of sound button
function createMuteMusicButton(root, settings, pos)
{
	// music enabled/disabled
	soundMuteButton = new CheckButton(); 
	soundMuteButton.Init(root, settings, 
	function(button){
		if(button.enabled)
		{    
			SoundManager.Unmute(); 
		}
		else
		{
			SoundManager.Mute();
		}
	});	
	soundMuteButton.SetPosition(pos.x, pos.y);
	soundMuteButton.SetState(!SoundManager.GetMute());
    
    return soundMuteButton;
}

// convert radians to degrees and vise vesa
function degToRad(deg)
{
    var pi = 3.14;
    return deg * (pi/180);
}
function radToDeg(rad)
{ 
    var pi = 3.14;
    return rad * (180/pi);
}

// return objContainer with given text placed in circle with given radius
// objContainer - PIXI.DisplayObjectContainer - to store results
// text - line of text
// textStyle - pixi text style
// radius - radius(in px) of circle
// charSpace - space between chars(in px) 
// lineSpace - space between two lines
// position - {x,y} start position of text
function TextOnCircle(objContainer, text, textStyle, radius, charSpace, lineSpace, position)
{
    // FIXME: add check that textLine not contain any '\n', '\r' characters
    
    // additional parameters check 
    if(text.length == 0)
        return;

    var R = radius; // alias
    var alphaStep = Math.acos((2 * R * R - charSpace * charSpace) / (2 * R * R));    // convert Space to rotation angle 

    var lines =  text.split("\n");
    for(var line = 0; line  < lines.length; line++)
    {
        var curLine = lines[line];
        var startAlpha =  3 * Math.PI / 2 - alphaStep * (curLine.length - 1) / 2;
        var currentLineSpace = line * lineSpace; 

        // create each char separately
        for(var symbol = 0; symbol < curLine.length; symbol++)
        {
            var chAngle = startAlpha + alphaStep * symbol;

            var ch = new PIXI.Text(curLine[symbol], textStyle);
            ch.cacheAsBitmap = true;
            ch.anchor.x = 0.5;
            ch.anchor.y = 0.5;
            ch.position.x = R * Math.cos(chAngle) + position.x; 
            ch.position.y = R * Math.sin(chAngle) + R + position.y + currentLineSpace; 
            ch.rotation =  chAngle - 3 * Math.PI / 2 ;
            objContainer.addChild(ch);
        }
    }
}

