YZI = window.YZI || {};

YZI.E = function() {};

YZI.E.gg = null;
YZI.E.buttonSound = null;
YZI.E.buttonSoundKey = "btn_click";

//boot
YZI.E.stateAfterBoot = null;
YZI.E.preloaderBgColor = "#000000";
YZI.E.preloaderWheelColor = "0xffffff";
YZI.E.preloaderTextColor = "#ffffff";

//tranisition
YZI.E.transTime = 700;
YZI.E.transTweenType = Phaser.Easing.Cubic.Out;
YZI.E.transPreCallback = null;
YZI.E.transCoverColor = "0x000000";

//localization
YZI.E.CURRENT_LANG = "en";
YZI.E.LOCALIZATION_DATA = null;

//debug
YZI.E.DEBUG = true;


YZI.E.defaultLabelFontStyle = function()
{
    return {
        font: "normal 32px Arial",
        fill: "#ffffff"
    };
};
YZI.E.defaultButtonFontStyle = function()
{
    return {
        font: "bold 22px Arial",
        fill: "#000000"
    };
};


YZI.E.init = function(game, localizationData)
{
    YZI.E.gg = game;
    YZI.E.LOCALIZATION_DATA = localizationData;

    if (YZI.E.buttonSoundKey)
    {
        YZI.E.buttonSound = YZI.E.gg.add.audio(YZI.E.buttonSoundKey);
    }
};


YZI.E.w = function()
{
    return YZI.E.gg.width;
};
YZI.E.h = function()
{
    return YZI.E.gg.height;
};
YZI.E.hw = function()
{
    return YZI.E.gg.width*0.5;
};
YZI.E.hh = function()
{
    return YZI.E.gg.height*0.5;
};


YZI.E.cState = function()
{
    return YZI.E.gg.state.getCurrentState();
};


YZI.E.sortZ = function(group)
{
    group.sort("z", Phaser.Group.SORT_ASCENDING);
};


YZI.E.manageFullScreen = function()
{
    YZI.E.gg.input.onDown.add(goFullScreen, YZI.E.gg.state.getCurrentState());

    function goFullScreen()
    {
        if (!YZI.E.gg.device.desktop && !YZI.E.gg.scale.isFullScreen && YZI.E.gg.scale.compatibility.supportsFullScreen)
        {
            YZI.E.gg.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            YZI.E.gg.scale.startFullScreen();
        }
    }
};


YZI.E.runScene = function(state, args)
{
    if (YZI.E.transPreCallback)
    {
        YZI.E.transPreCallback();
    }

    YZI.E.gg.input.disabled = true;

    var cover = YZI.E.gg.add.graphics(0, 0);
    cover.beginFill(YZI.E.transCoverColor, 1);
    cover.drawRect(0, 0, YZI.E.gg.width, YZI.E.gg.height);
    cover.alpha = 0;

    YZI.E.gg.world.bringToTop(cover);

    YZI.E.gg.add.tween(cover)
        .to({
            alpha: 1
        }, YZI.E.transTime, YZI.E.transTweenType, true)
        .onComplete.add(function()
        {
            YZI.E.gg.state.start(state, true, false, args);
        });
};


YZI.E.fadeInScene = function()
{
    YZI.E.gg.input.disabled = false;

    var cover = YZI.E.gg.add.graphics(0, 0);
    cover.beginFill(YZI.E.transCoverColor, 1);
    cover.drawRect(0, 0, YZI.E.gg.width, YZI.E.gg.height);
    cover.alpha = 1;

    YZI.E.gg.world.bringToTop(cover);

    YZI.E.gg.add.tween(cover)
        .to({
            alpha: 0
        }, YZI.E.transTime, YZI.E.transTweenType, true)
        .onComplete.add(function()
        {
            cover.destroy();
        });
};


YZI.E.makeBitmapTex = function(w, h, r, g, b)
{
    var bmpTex = new Phaser.BitmapData(YZI.E.gg, "bmp", w || 100, h || 100);
    bmpTex.fill(r || 0, g || 0, b || 0);

    return bmpTex;
};


YZI.E.addImage = function(group, x, y, z, key, frame, aX, aY, alpha, angle, scaleX, scaleY, cropRect)
{
    var image = YZI.E.gg.add.image(x, y, key, frame);
    if (z !== undefined || z !== null)
    {
        image.z = z;
    }
    image.anchor.set((aX === undefined || aX === null) ? 0.5 : aX, (aY === undefined || aY === null) ? 0.5 : aY);
    image.alpha = (alpha === undefined || alpha === null) ? 1 : alpha;
    image.angle = angle || 0;
    image.scale.x = (scaleX === undefined || scaleX === null) ? 1 : scaleX;
    image.scale.y = (scaleY === undefined || scaleY === null) ? 1 : scaleY;
    image.crop(cropRect);

    if (group)
    {
        group.add(image);
    }

    return image;
};


YZI.E.addSprite = function(group, x, y, z, key, frame, aX, aY, alpha, angle, scaleX, scaleY, cropRect)
{
    var sprite = YZI.E.gg.add.sprite(x, y, key, frame);
    if (z !== undefined || z !== null)
    {
        sprite.z = z;
    }
    sprite.anchor.set((aX === undefined || aX === null) ? 0.5 : aX, (aY === undefined || aY === null) ? 0.5 : aY);
    sprite.alpha = (alpha === undefined || alpha === null) ? 1 : alpha;
    sprite.angle = angle || 0;
    sprite.scale.x = (scaleX === undefined || scaleX === null) ? 1 : scaleX;
    sprite.scale.y = (scaleY === undefined || scaleY === null) ? 1 : scaleY;
    sprite.crop(cropRect);

    if (group)
    {
        group.add(sprite);
    }

    return sprite;
};


YZI.E.addTileSprite = function(group, x, y, z, key, frame, width, height, aX, aY, alpha, angle, scaleX, scaleY)
{
    var tileSprite = YZI.E.gg.add.tileSprite(x, y, width, height, key, frame);
    if (z !== undefined || z !== null)
    {
        tileSprite.z = z;
    }
    tileSprite.anchor.set((aX === undefined || aX === null) ? 0.5 : aX, (aY === undefined || aY === null) ? 0.5 : aY);
    tileSprite.alpha = (alpha === undefined || alpha === null) ? 1 : alpha;
    tileSprite.angle = angle || 0;
    tileSprite.scale.x = (scaleX === undefined || scaleX === null) ? 1 : scaleX;
    tileSprite.scale.y = (scaleY === undefined || scaleY === null) ? 1 : scaleY;

    if (group)
    {
        group.add(tileSprite);
    }

    return tileSprite;
};


YZI.E.addLabel = function(group, x, y, z, text, fontStyle, fontSize, fontColor, aX, aY, alpha, angle, fontWeight, fontFace)
{
    fontStyle = fontStyle || YZI.E.defaultLabelFontStyle();

    if (fontSize || fontWeight || fontFace)
    {
        var sa = fontStyle.font.split(" ");
        fontStyle.font = ((fontWeight) ? fontWeight : sa[0]) +
            " " +
            ((fontSize) ? (fontSize + "px") : sa[1]) +
            " " +
            ((fontFace) ? fontFace : sa[2]);

        if (sa.length > 3)
        {
            fontStyle.font += " " + sa[3];
        }
        if (sa.length > 4)
        {
            fontStyle.font += " " + sa[4];
        }
    }

    if (fontColor)
    {
        fontStyle.fill = fontColor;
    }


    var label = YZI.E.gg.add.text(x, y, text || "", fontStyle);
    if (z !== undefined || z !== null)
    {
        label.z = z;
    }
    label.anchor.set((aX === undefined || aX === null) ? 0.5 : aX, (aY === undefined || aY === null) ? 0.5 : aY);
    label.alpha = (alpha === undefined || alpha === null) ? 1 : alpha;
    label.angle = angle || 0;

    if (group)
    {
        group.add(label);
    }

    return label;
};


YZI.E.addBmpLabel = function(group, x, y, z, font, text, fontSize, aX, aY, alpha, angle)
{
    var label = YZI.E.gg.add.bitmapText(x, y, font, text || '', fontSize || 16);
    if (z !== undefined || z !== null)
    {
        label.z = z;
    }
    label.anchor.set((aX === undefined || aX === null) ? 0.5 : aX, (aY === undefined || aY === null) ? 0.5 : aY);
    label.alpha = (alpha === undefined || alpha === null) ? 1 : alpha;
    label.angle = angle || 0;

    if (group)
    {
        group.add(label);
    }

    return label;
};


YZI.E.addButton = function(group, x, y, z, key, upFrame, downFrame, onDown, onUp, target, args, tweenUp, text, fontStyle, fontSize, fontColor, fontWeight, fontFace, playSfx, toggle)
{
    var button = YZI.E.gg.add.button(x, y, key, null, this, upFrame, upFrame, downFrame || upFrame, upFrame);
    if (z !== undefined || z !== null)
    {
        button.z = z;
    }
    button.anchor.set(0.5, 0.5);
    button.onInputDown.add(onDownHandler, target);
    button.onInputUp.add(onUpHandler, target);

    button.toggle = toggle;

    button.toggleButton = function()
    {
        if (button.toggle !== undefined || button.toggle !== null)
        {
            button.toggle = !button.toggle;

            if (button.toggle)
            {
                button.setFrames(upFrame, upFrame, upFrame, upFrame);
            }
            else
            {
                button.setFrames(downFrame, downFrame, downFrame, downFrame);
            }
        }
    };

    button.toggleButton();

    var tween = null;
    tweenUp = (tweenUp === undefined || tweenUp === null || tweenUp === true);

    if ((playSfx === undefined || playSfx === null) && YZI.E.buttonSound)
    {
        button.setDownSound(YZI.E.buttonSound);
    }

    function onDownHandler()
    {
        if (onDown)
        {
            onDown(target, args);
        }

        button.toggleButton();

        if (tweenUp && (!tween || !tween.isRunning))
        {
            tween = YZI.E.gg.add.tween(button.scale)
                .to({
                    x: "+0.12",
                    y: "+0.12"
                }, 150, Phaser.Easing.Cubic.In, true, 0, 0, true);
        }
    }

    function onUpHandler()
    {
        if (onUp)
        {
            onUp(target, args);
        }
    }


    if (text)
    {
        fontStyle = fontStyle || YZI.E.defaultButtonFontStyle();

        if (fontSize || fontWeight || fontFace)
        {
            var sa = fontStyle.font.split(" ");
            fontStyle.font = ((fontWeight) ? fontWeight : sa[0]) +
                " " +
                ((fontSize) ? (fontSize + "px") : sa[1]) +
                " " +
                ((fontFace) ? fontFace : sa[2]);

            if (sa.length > 3)
            {
                fontStyle.font += " " + sa[3];
            }
            if (sa.length > 4)
            {
                fontStyle.font += " " + sa[4];
            }
        }

        if (fontColor)
        {
            fontStyle.fill = fontColor;
        }


        var label = YZI.E.gg.add.text(0, 0, text, fontStyle);
        label.anchor.set(0.5, 0.5);
        button.addChild(label);
    }

    if (group)
    {
        group.add(button);
    }

    return button;
};


YZI.E.addMuteButton = function(group, x, y, z, key, upFrame, downFrame, tweenUp)
{
    function onMute()
    {
        YZI.E.gg.sound.mute = !YZI.E.gg.sound.mute;
    }

    return YZI.E.addButton(group, x, y, z, key, upFrame, downFrame, onMute, null, null, null, tweenUp, null, null, null, null, null, null, false, YZI.E.gg.sound.mute);
};


YZI.E.genFrameNames = function(name, frames, suffix, zeroPad)
{
    var frameNames = [];
    if (zeroPad === undefined || zeroPad === null)
    {
        zeroPad = 1;
    }

    if (frames.length === undefined)
    {
        for (var i = 1; i < frames + 1; i++)
        {
            frameNames.push(name + Phaser.Utils.pad(i.toString(), zeroPad, "0", 1) + suffix);
        }
    }
    else
    {
        for (var i2 = 0; i2 < frames.length; i2++)
        {
            frameNames.push(name + Phaser.Utils.pad(frames[i2].toString(), zeroPad, "0", 1) + suffix);
        }
    }

    return frameNames;
};


YZI.E.animNumberLabel = function(animDelay, label, startVal, endVal, totalTime, amountStep)
{
    totalTime = totalTime || 300;
    amountStep = amountStep || 1;
    var stepDelay = totalTime/Math.abs(endVal - startVal);

    label.text = startVal.toString();

    var delayTimer = YZI.E.gg.time.events.add(animDelay, function()
    {
        var loopTimer = YZI.E.gg.time.events.loop(stepDelay, function()
        {
            startVal = YZI.E.Util.increase(startVal, amountStep, endVal);
            //label.text = Math.round(startVal).toString();
            label.text = YZI.E.formatNumberString(Math.round(startVal));

            if (startVal == endVal)
            {
                YZI.E.gg.time.events.remove(delayTimer);
                YZI.E.gg.time.events.remove(loopTimer);
            }

        }, this);

    }, this);
};


YZI.E.formatNumberString = function(num, sepThousand, sepDecimal, decNums)
{
    if (num === 0)
    {
        return 0;
    }

    sepThousand = sepThousand || ".";
    sepDecimal = sepDecimal || ",";
    decNums = decNums || 2;

    if (num < 0)
    {
        num = -num;
        sign = -1;
    }
    else
    {
        sign = 1;
    }

    var frmString = "";
    var part = "";

    if (num != Math.floor(num)) //if decimal values
    {
        part = Math.round((num - Math.floor(num))*Math.pow(10, decNums)).toString(); //transforms decimal part into integer (rounded)
        while (part.length < decNums)
        {
            part = '0' + part;
        }
        if (decNums > 0)
        {
            frmString = sepDecimal + part;
            num = Math.floor(num);
        }
        else
        {
            num = Math.round(num);
        }
    }


    while (num > 0) //integer part
    {
        part = (num - Math.floor(num/1000)*1000).toString(); //part = three less significant digits
        num = Math.floor(num/1000);
        if (num > 0)
        {
            while (part.length < 3) //123.023.123  if sepThousand = '.'
            {
                part = '0' + part;
            }
        } //023
        frmString = part + frmString;
        if (num > 0)
        {
            frmString = sepThousand + frmString;
        }
    }

    if (sign < 0)
    {
        frmString = '-' + frmString;
    }

    return frmString;
};


YZI.E.showFPS = function()
{
    if (YZI.E.DEBUG === false)
        return;

    YZI.E.gg.time.advancedTiming = true;
    var fps = YZI.E.gg.add.text(5, 5, "", {
        font: '22px Arial',
        fill: "#00FF00"
    });
    fps.fixedToCamera = true;
    fps.z = 999999999;

    YZI.E.gg.time.events.loop(1, function()
    {
        fps.text = YZI.E.gg.time.fps;
    }, YZI.E.gg);
};


YZI.E.showPhaserDebug = function()
{
    //<script src="/libs/phaser-debug.js"></script>
    YZI.E.gg.add.plugin(Phaser.Plugin.Debug);
};


YZI.E.addDebugRestart = function(state, x, y, args)
{
    YZI.E.addButton(null, x || 55, y || 18, null, YZI.E.makeBitmapTex(40, 36, 255, 0, 0), null, null, function()
    {
        console.log("###RESTART###");
        YZI.E.gg.state.start(state, true, false, args);
    }, null, this, 0, false, "R");
};


YZI.E.randInt = function(min, max)
{
    return YZI.E.gg.rnd.integerInRange(min, max);
};


YZI.E.rect = function(x, y, width, height)
{
    return new Phaser.Rectangle(x, y, width, height);
};


YZI.E.getTrans = function(prop)
{
    var str = Phaser.Utils.getProperty(YZI.E.LOCALIZATION_DATA[YZI.E.CURRENT_LANG], prop);

    return str || console.warn("NO TRANSLATION!" + " " + YZI.E.CURRENT_LANG + " - " + prop);
};


YZI.E.findAtlasFor = function(frameName)
{
    var keys = YZI.E.gg.cache.getKeys();

    for (var i = 0; i <= keys.length; i++)
    {
        if (YZI.E.gg.cache.getFrameData(keys[i])._frameNames[frameName] !== undefined)
        {
            return keys[i];
        }
    }
};


YZI.E.Util = {
    percentRemaining: function(n, total)
    {
        return (n%total)/total;
    },
    lerp: function(a, b, t)
    {
        return a + (b - a)*t;
    },
    increase: function(sValue, amount, maxValue)
    {
        if (sValue < maxValue - amount)
        {
            return sValue + amount;
        }
        else if (sValue > maxValue + amount)
        {
            return sValue - amount;
        }
        else
        {
            return maxValue;
        }
    },
    increaseL: function(sValue, amount, maxValue)
    {
        var result = sValue + amount;

        while (result >= maxValue)
        {
            result -= maxValue;
        }
        while (result < 0)
        {
            result += maxValue;
        }

        return result;
    }
};


//eCard
YZI.E.addCssBg = function(imageUrl)
{
    var bgDiv = document.createElement("div");
    bgDiv.id = imageUrl;
    bgDiv.style.overflow = "hidden";
    bgDiv.style.position = "absolute";
    bgDiv.style.margin = "0 auto";
    bgDiv.style.top = "0";
    bgDiv.style.left = "0";
    bgDiv.style.width = "100%";
    bgDiv.style.height = YZI.E.gg.scale.height + "px";
    bgDiv.style.zIndex = "-999";

    bgDiv.style.backgroundImage = "url(" + imageUrl + ")";
    bgDiv.style.backgroundPosition = "center";
    //bgDiv.style.backgroundRepeat = "no-repeat";//"repeat-x"
    //bgDiv.style.backgroundColor = "#000000";

    bgDiv.style.backgroundSize = "contain";
    bgDiv.style.webkitBackgroundSize = "contain";
    bgDiv.style.mozBackgroundSize = "contain";
    bgDiv.style.oBackgroundSize = "contain";


    var gameDiv = document.getElementById("game");
    gameDiv.insertBefore(bgDiv, gameDiv.childNodes[0]);

    return bgDiv;
};


YZI.E.resizeCard = function()
{
    var minWidth = YZI.E.curCardPreset().width;
    var maxWidth = YZI.E.curCardPreset().width*1.6;

    var aspectRatio = window.innerWidth/window.innerHeight;
    var width = YZI.E.curCardPreset().height*aspectRatio;

    width = (width < minWidth) ? minWidth : width;
    width = (width > maxWidth) ? maxWidth : width;

    YZI.E.gg.scale.setGameSize(width, YZI.E.curCardPreset().height);
};


YZI.E.cardX = function(x)
{
    return x + (YZI.E.gg.scale.width - YZI.E.curCardPreset().width)/2;
};