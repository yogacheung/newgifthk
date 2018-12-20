YZI = window.YZI || {};

YZI.Boot = function(game) {};

YZI.Boot.prototype =
{
    init: function()
    {
        this.game.stage.backgroundColor = YZI.E.preloaderBgColor;

        this.initWrongOrientationPrompt();

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = false;

        if (this.game.device.desktop)
        {
            this.initWithCardPreset("highRes");

            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = false;
        }
        else
        {
            this.initWithCardPreset("lowRes");

            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = false;
            this.scale.forceOrientation((this.game.width > this.game.height), (this.game.width < this.game.height));
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }
    },

    initWithCardPreset: function(preset)
    {
        YZI.E.cardPreset.current = preset;

        this.scale.setGameSize(YZI.E.curCardPreset().width, YZI.E.curCardPreset().height);
    },

    initWrongOrientationPrompt: function()
    {
        var e = document.createElement("div");
        e.id = "orientation";
        e.style.margin = "0 auto";
        e.style.position = "absolute";
        e.style.overflow = "hidden";
        e.style.top = "0";
        e.style.left = "0";
        e.style.width = "100%";
        e.style.height = "100%";
        e.style.backgroundImage = "url(res/boot/wrong_orientation.png)";
        e.style.backgroundRepeat = "no-repeat";
        e.style.backgroundPosition = "center";
        e.style.backgroundColor = "#000000";
        e.style.zIndex = "999";
        e.style.display = "none";

        var e2 = document.getElementById("game");
        e2.insertBefore(e, e2.childNodes[0]);
    },

    preload: function()
    {
        this.load.image("preloader_wheel", "res/boot/preloader_wheel.png");

        this.load.audio("btn_click", "res/boot/btn_click.mp3");

        this.load.image("ios_btn_play", "res/boot/ios_btn_play.png");//ios play button

        //card xml data
        var rid = url("?rid");

        if (rid)
        {
            this.load.text("xmlData", "RECIPIENT_TEMPLATES/" + rid + ".xml");
        }
        else
        {
            this.load.text("xmlData", "XML_TEMPLATE/card.xml");
        }
    },

    create: function()
    {
        YZI.E.init(this.game);

        this.game.state.add("Preloader", YZI.Preloader);
        this.state.start('Preloader');
    },

    enterIncorrectOrientation: function()
    {
        document.getElementById("orientation").style.display = "block";
    },

    leaveIncorrectOrientation: function()
    {
        document.getElementById("orientation").style.display = "none";
    }
};



YZI.Preloader = function(game) {};

YZI.Preloader.prototype =
{
    init: function()
    {
        YZI.E.resizeCard();

        this.game.stage.backgroundColor = YZI.E.preloaderBgColor;

        this.preloaderWheel = this.add.sprite(this.game.width/2, this.game.height/2, "preloader_wheel");
        this.preloaderWheel.anchor.set(0.5, 0.5);
        this.preloaderWheel.tint = YZI.E.preloaderWheelColor;

        var fontStyle = {
            font: "24px Arial",
            fill: YZI.E.preloaderTextColor,
            align: "center"
        };
        this.preloaderLabel = this.add.text(this.game.width/2, this.game.height/2, "", fontStyle);
        this.preloaderLabel.anchor.set(0.5, 0.5);

        this.load.onFileComplete.add(function(progress/*, cacheKey, success, totalLoaded, totalFiles*/)
        {
            this.preloaderWheel.angle += 15;
            this.preloaderLabel.text = progress.toString();
        }, this);
    },

    update: function()
    {
        this.preloaderWheel.angle += 12;
    },

    preload: function()
    {
        this.load.crossOrigin = true;//'anonymous';

        this.parseXmlData();

        YZI.R.assetsToLoad(this.load);
    },

    parseXmlData: function()
    {
        var xml = new DOMParser().parseFromString(this.cache.getText('xmlData'), "application/xml");

        //logo
        var logoUrl = xml.getElementsByTagName("logo")[0].textContent;
        this.load.image("logo", logoUrl);

        //music
        var musicUrl = xml.getElementsByTagName("music")[0].textContent;
        this.load.audio("main_soundtrack", ["music/" + musicUrl + ".mp3", "music/" + musicUrl + ".ogg"]);

        //parse messages
        YZI.E.msg1Text = xml.getElementsByTagName("principal")[0].textContent.replace("{name}", url("?name") || "{name}");
        YZI.E.msg2Text = xml.getElementsByTagName("message")[0].textContent.replace("{name}", url("?name") || "{name}");

        //add extra space to principal
        YZI.E.msg1Text = " " + YZI.E.msg1Text + " ";

        //parse font size
        var elName1 = (this.game.device.desktop) ? "principal_font_size" : "mob_principal_font_size";
        var elName2 = (this.game.device.desktop) ? "message_font_size" : "mob_message_font_size";
        YZI.E.msg1FontSize = xml.getElementsByTagName(elName1)[0].textContent;
        YZI.E.msg2FontSize = xml.getElementsByTagName(elName2)[0].textContent;

        //parse site url
        YZI.E.siteUrl = xml.getElementsByTagName("site")[0].textContent;
    },

    create: function()
    {
        if (this.game.device.iOS)//(navigator.userAgent.indexOf("iPad") >= 0 || navigator.userAgent.indexOf("iPhone") >= 0)
        {
            YZI.E.runScene("ios_prestart");
        }
        else
        {
            YZI.E.runScene(YZI.E.curCardPreset().state);
        }
    }
};
