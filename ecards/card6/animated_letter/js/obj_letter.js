// letter box
function Letter()
{
    this.rootContainer = undefined;
    this.objContainer = undefined;

    this.moveFrom = {"x":GlobalScale(964), "y":GlobalScale(-500)};
    this.moveTo = {"x":GlobalScale(964), "y":GlobalScale(594)};
    this.effect = undefined;
    this.moveSpeed = GlobalScale(70);
    this.closeBtn = undefined;
    this.isMoveDown = false;
    this.isMoveUp = false;

    // rootcontainer - root to store objects on it
    // callbackFunc - function to call when used clicked on letterbox
    this.Init = function(rootContainer)
    {
        this.rootContainer = rootContainer;
        this.objContainer = new PIXI.DisplayObjectContainer();
        this.rootContainer.addChild(this.objContainer);
        
        this.objContainer.position.x = this.moveFrom.x;
        this.objContainer.position.y = this.moveFrom.y; 

        // letter background
        var letterBg = new PIXI.Sprite.fromImage("./img/img/letter.png");
        letterBg.position.x = GlobalScale(-534);    // x -corner of e-card 
        letterBg.position.y = GlobalScale(-354);    // y-corner of e-card
        this.objContainer.addChild(letterBg);

        // logo
        var logo = GAME.xmlSettings.letter.logo;
        if(logo !== undefined && logo !== "")
        {
            var logoDimensions = {"w":175, "h":175} // width and height of logo that e-card can accept, this not a magic, this goes from e-card psd file

            var basetx = new PIXI.BaseTexture(htmlLogoImg); // htmlLogoImg defined on index.html
            var texture = new PIXI.Texture(basetx);

            var logo = new PIXI.Sprite(texture);
            logo.anchor.x = 0.5;
            logo.anchor.y = 0.5;
                
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

            logo.position.x = GlobalScale(348);
            logo.position.y = GlobalScale(-58);
            this.objContainer.addChild(logo);
            
            // scale logo to e-card logo placeholder
            var vs = new VirtualScreen();
            vs.VirtualScrW = logo.width;
            vs.VirtualScrH = logo.height;
            vs.VirtualScrIsPortrait = false;    // landscape 
            vs.DeviceScrW = logoDimensions.w;
            vs.DeviceScrH = logoDimensions.h;
            vs.Init();
            logo.scale.x  = vs.OptionalScrW / logo.width; 
            logo.scale.y  = vs.OptionalScrH / logo.height; 

        }

        //  ==================== principial =======================
        var text = GAME.xmlSettings.letter.principal;
        var fontFamily = GAME.xmlSettings.font.principal.family;
        var fontColor = GAME.xmlSettings.font.principal.color;
        var fontHeight = GAME.xmlSettings.font.principal.size;
        var wWrap = false;
        var wWrapWidht = 500;
        var align = GAME.xmlSettings.font.principal.align;
        if(fontHeight == "auto")
        {
            fontMin = parseInt(GAME.xmlSettings.font.principal.sizemin, 10);
            fontMax = parseInt(GAME.xmlSettings.font.principal.sizemax, 10);
            fontHeight = selectFontSize(text, 
                                        fontFamily,
                                        {"w":wWrapWidht, "h": 150},
                                        wWrap, 
                                        align,
                                        {"min":fontMin, "max":fontMax});
        }

        var principalTextStyle= {   font:""+fontHeight+"px '"+ fontFamily +"'",
                                    fill: fontColor,
                                    align: align,
                                    wordWrap:wWrap,
                                    wordWrapWidth:wWrapWidht
                                };
        var nameText = new PIXI.Text(text, principalTextStyle);
        nameText.cacheAsBitmap = true;
        nameText.anchor.x = 0.5;
        nameText.anchor.y = 0.5;
        nameText.position.x = GlobalScale(GAME.xmlSettings.font.principal.x);
        nameText.position.y = GlobalScale(GAME.xmlSettings.font.principal.y);
        this.objContainer.addChild(nameText); 

        //  ==================== message =======================
        text = GAME.xmlSettings.letter.message;
        fontFamily = GAME.xmlSettings.font.message.family;
        fontColor = GAME.xmlSettings.font.message.color;

        fontHeight = GAME.xmlSettings.font.message.size;
        var wWrap = true;
        var wWrapWidht = 500;
        var align = GAME.xmlSettings.font.message.align;

        if(fontHeight == "auto")
        {
            fontMin = parseInt(GAME.xmlSettings.font.message.sizemin, 10);
            fontMax = parseInt(GAME.xmlSettings.font.message.sizemax, 10);
            fontHeight = selectFontSize(text, 
                                        fontFamily,
                                        {"w": wWrapWidht, "h": 350},
                                        wWrap,
                                        align,
                                        {"min":fontMin, "max":fontMax});
        }

        var messageTextStyle = {    font:""+fontHeight+"px '"+fontFamily+"'",
                                    fill:fontColor,
                                    align:align,
                                    wordWrap:wWrap,
                                    wordWrapWidth:wWrapWidht
                                };
        //text = "\n" + text + "\n"; //HACK: depending on font, but pixi cut upline letters, so add empty line
        var messageText = new PIXI.Text(text, messageTextStyle);
        messageText.cacheAsBitmap = true;
        messageText.anchor.x = 0.5;
        messageText.anchor.y = 0.5;
        messageText.position.x = GlobalScale(GAME.xmlSettings.font.message.x);
        messageText.position.y = GlobalScale(GAME.xmlSettings.font.message.y);
        this.objContainer.addChild(messageText); 

        // close button
        this.closeBtn = new PIXI.Sprite.fromImage("./img/img/close.png");
        this.closeBtn.position.x = GlobalScale(500);
        this.closeBtn.position.y = GlobalScale(-340);
        this.closeBtn.interactive = true;
        this.closeBtn.buttonMode = true;
        var hack = this;
        DEVICE.ClickOrTap(this.closeBtn, function(data){
                hack.Hide();
                });
        this.objContainer.addChild(this.closeBtn);
        
    }

    this.Show = function()
    {
        this.isMoveDown = true;
        this.isMoveUp = false;
        this.effect = new FadeInOut();
        this.effect.Init(this.moveFrom.y, this.moveTo.y, this.moveSpeed);
    }
    
    this.Hide = function()
    {
        this.isMoveDown = false;
        this.isMoveUp = true;
        this.effect = new FadeInOut();
        this.effect.Init(this.moveTo.y, this.moveFrom.y,  -this.moveSpeed);
    }

    this.Update = function()
    {
        if(this.effect === undefined)
            return;

        this.effect.Update();
        this.objContainer.position.y = this.effect.getValue();

        if(this.isMoveDown == true && this.effect.isComplete())
        {
            console.log("move down complete ");
            this.isMoveDown = false;
        }
        if(this.isMoveUp == true && this.effect.isComplete())
        {
            console.log("move up complete ");
            this.isMoveUp = false;

            // Close letterbox
            // stop music
            GAME.stages.main.mainLogic.letterBox.Close();
        }
    }

    this.Free = function()
    {
    }

}
