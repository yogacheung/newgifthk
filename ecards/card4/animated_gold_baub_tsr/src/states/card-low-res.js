YZI = window.YZI || {};

YZI.CardLowRes = function() {};

YZI.CardLowRes.prototype =
{
    init: function()
    {
        this.msg1FontStyle =
        {
            font: "normal " + YZI.E.msg1FontSize + "px Principal",
            fill: "#a66c1a",
            align: "center"
            /*stroke: "red",
             strokeThickness: 4*/
        };

        this.msg2FontStyle =
        {
            font: "normal " + YZI.E.msg2FontSize + "px Message",
            fill: "#7c450f",
            align: "center"
            /*stroke: "red",
             strokeThickness: 4*/
        };
    },

    create: function()
    {
        YZI.E.initCard(this);

        YZI.E.initPhysics(this);

        this.ribbonsAR = [];


        //main bg
        this.mainBg = YZI.E.addTileSprite(null, YZI.E.hw(), 0, 0, YZI.E.findAtlasFor("_0000_Background"), "_0000_Background",
            YZI.E.curCardPreset().width*1, YZI.E.curCardPreset().height, 0.5, 0);


        //msg2
        var msg2 = YZI.E.addLabel(null, YZI.E.hw(), 280, 0, YZI.E.msg2Text, this.msg2FontStyle, null, null, 0.5, 0);
        msg2.lineSpacing = -6;
        //msg2.setShadow(1, 1, "rgba(0,0,0, 0.7)");
        msg2.alpha = 0;
        this.game.add.tween(msg2).to({alpha: 1}, 1700, Phaser.Easing.Quintic.In, true, 100);


        var logoBtn = this.addLogoBtn(0, YZI.E.cardX(1136 - 120), 640 - 120);


        //top phys base
        this.topBase = this.game.physics.box2d.createBody(YZI.E.hw(), 0);
        this.topBase.setRectangle(YZI.E.curCardPreset().width, 10);
        this.topBase.static = true;


        //
        this.addRibbon(YZI.E.cardX(125), -10, 63, 511, -8, -14, "_0000s_0010_Vector-Smart-Object", false);
        //
        this.addRibbon(YZI.E.cardX(300), 160, 53, 124, -8, -18, "_0000s_0004_Vector-Smart-Object", false);
        //
        this.addRibbon(YZI.E.cardX(840), 160, 53, 200, -8, -18, "_0000s_0011_Vector-Smart-Object", true);
        //
        this.addRibbon(YZI.E.cardX(970), 80, 33, 304, -8, -14, "_0000s_0005_Vector-Smart-Object", false);


        //mute bauble
        var muteBauble = this.addBauble(YZI.E.cardX(70), 0, 53, -8, 40, "_0000s_0006_Vector-Smart-Object", 10, 0, 0, -15);
        var muteBtn = YZI.E.addMuteButton(null, -8, 37, 0, YZI.E.findAtlasFor("sound_on"), "sound_on", "sound_off");
        muteBauble.addChild(muteBtn);

        //
        this.addBauble(YZI.E.cardX(170), 90, 70, -6, 45, "_0000s_0009_Vector-Smart-Object", 30, -6, -50, 15);
        //
        this.addBauble(YZI.E.cardX(270), 110, 84, -8, 148, "_0000s_0008_Vector-Smart-Object", 45, -6, 50, -15);
        //
        this.addBauble(YZI.E.cardX(900), 140, 110, -6, 40, "_0000s_0012_Vector-Smart-Object", 30, -6, -30, 15);
        //
        this.addBauble(YZI.E.cardX(1050), -10, 68, -8, 78, "_0000s_0003_Vector-Smart-Object", 35, -6, 0, -15);


        //msg1 bg
        var msg1Bg = YZI.E.addImage(null, YZI.E.hw(), 145, 0, YZI.E.findAtlasFor("_0000s_0002_Vector-Smart-Object"), "_0000s_0002_Vector-Smart-Object");

        //msg1
        var msg1 = YZI.E.addLabel(null, 0, -115, 0, YZI.E.msg1Text, this.msg1FontStyle, null, null, 0.5, 0);
        msg1.lineSpacing = -15;
        msg1.setShadow(1.2, 1.2, "rgba(0,0,0, 0.7)");
        msg1Bg.addChild(msg1);
        this.fillWithLinearGradient(msg1, "#7d4811", "#c18822", 100);







        //snow particles
        this.addSnowParticles();


        //
        YZI.E.showFPS();
    },

    render: function()
    {
        if (YZI.E.physDebug)
        {
            this.game.debug.box2dWorld();
        }
    },

    update: function()
    {
        this.updateRibbons();
    },

    addBauble: function(x, y, r1, xo1, yo1, frameName, r2, xo2, yo2, angle)
    {
        var baubleSP = YZI.E.addSprite(null, x, y + yo1, null, YZI.E.findAtlasFor(frameName), frameName);

        this.game.physics.box2d.enable(baubleSP);
        baubleSP.body.setCircle(r1, xo1, yo1);
        baubleSP.body.addCircle(r2, xo2, yo2);
        baubleSP.body.angle = angle;
        baubleSP.body.setCollisionMask(1);

        this.game.physics.box2d.revoluteJoint(this.topBase, baubleSP, x - YZI.E.hw(), y, 0, -baubleSP.height/2);

        return baubleSP;
    },

    addRibbon: function(x, y, width, height, xo, yo, frameName, flipX)
    {
        var distJointLength = 1;

        var ribbonSP = YZI.E.addSprite(null, x, y + height/2 + distJointLength, null, YZI.E.findAtlasFor(frameName), frameName);
        this.game.physics.box2d.enable(ribbonSP);
        ribbonSP.body.setRectangle(width, height, xo, yo);
        ribbonSP.body.setCollisionCategory(2);
        ribbonSP.body.sensor = true;

        var bx = width/2 + xo;
        if (flipX)
        { bx = -width/2 + xo; }

        this.game.physics.box2d.distanceJoint(this.topBase, ribbonSP, distJointLength, x - YZI.E.hw(), y, bx, -height/2 + yo, 2, 0.1);

        this.ribbonsAR.push({x: x, y: y, halfHeight: height/2, sprite: ribbonSP});
    },

    updateRibbons: function()
    {
        for (var i = 0; i < this.ribbonsAR.length; i++)
        {
            var dist = Phaser.Point.distance(this.ribbonsAR[i], this.ribbonsAR[i].sprite);
            this.ribbonsAR[i].sprite.scale.y = dist/this.ribbonsAR[i].halfHeight;
        }
    },

    addSnowParticles: function()
    {
        var snowEMT = this.game.add.emitter(this.game.world.centerX, -10, 50);
        snowEMT.makeParticles("star");
        snowEMT.maxParticleScale = 0.5;
        snowEMT.minParticleScale = 0.3;
        //snowEMT.alpha = 0.7;
        snowEMT.setYSpeed(20, 100);
        snowEMT.gravity = 0;
        snowEMT.width = this.game.world.width;
        snowEMT.minRotation = 0;
        snowEMT.maxRotation = 360;

        snowEMT.start(false, 10000, 50);
    }
};

