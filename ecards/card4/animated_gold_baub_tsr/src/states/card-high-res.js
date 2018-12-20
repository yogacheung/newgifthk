YZI = window.YZI || {};

YZI.CardHighRes = function() {};

YZI.CardHighRes.prototype =
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
            fill: "#f2e9cb",
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
        this.mainBg = YZI.E.addTileSprite(null, YZI.E.hw(), 0, 0, YZI.E.findAtlasFor("_0001s_0000_Rectangle-2-copy"), "_0001s_0000_Rectangle-2-copy",
            YZI.E.curCardPreset().width*3, YZI.E.curCardPreset().height, 0.5, 0);
        this.addParallaxObject(this.mainBg, -50);

        var logoBtn = this.addLogoBtn(0, YZI.E.cardX(1920 - 170), 1080 - 170);
        this.addParallaxObject(logoBtn.body, 50);

        //tip use your mouse
        var tip = YZI.E.addImage(null, YZI.E.cardX(300), 1080 - 100, 0, YZI.E.findAtlasFor("_0000s_0002_Use-your-mouse-to-interact!"), "_0000s_0002_Use-your-mouse-to-interact!");
        var arrow = YZI.E.addImage(null, YZI.E.cardX(250), 1080 - 150, 0, YZI.E.findAtlasFor("_0000s_0001_arrow"), "_0000s_0001_arrow");



        //top phys base
        this.topBase = this.game.physics.box2d.createBody(YZI.E.hw(), 0);
        this.topBase.setRectangle(YZI.E.curCardPreset().width, 10);
        this.topBase.static = true;

        //
        var o1 = YZI.E.addImage(null, YZI.E.cardX(310), 0, 0, YZI.E.findAtlasFor("_0000s_0003s_0017_Vector-Smart-Object"), "_0000s_0003s_0017_Vector-Smart-Object", 0, 0);
        this.addParallaxObject(o1, 60);
        //
        var o2 = YZI.E.addImage(null, YZI.E.cardX(880), 0, 0, YZI.E.findAtlasFor("_0000s_0003s_0011_Vector-Smart-Object"), "_0000s_0003s_0011_Vector-Smart-Object", 0, 0);
        this.addParallaxObject(o2, 60 + 20);
        //
        var o3 = YZI.E.addImage(null, YZI.E.cardX(390), 0, 0, YZI.E.findAtlasFor("_0000s_0003s_0018_Vector-Smart-Object"), "_0000s_0003s_0018_Vector-Smart-Object", 0, 0);
        this.addParallaxObject(o3, 60 - 30);
        //
        var o4 = YZI.E.addImage(null, YZI.E.cardX(950), 0, 0, YZI.E.findAtlasFor("_0000s_0003s_0014_Vector-Smart-Object"), "_0000s_0003s_0014_Vector-Smart-Object", 0, 0);
        this.addParallaxObject(o4, 60 - 20);
        //
        var o5 = YZI.E.addImage(null, YZI.E.cardX(900), 90, 0, YZI.E.findAtlasFor("_0000s_0003s_0015_Vector-Smart-Object"), "_0000s_0003s_0015_Vector-Smart-Object", 0, 0);
        this.addParallaxObject(o5, 60 - 10);


        //
        this.addRibbon(YZI.E.cardX(115), -50, 100, 686, -5, -10, "_0000s_0003s_0009_Vector-Smart-Object", true);
        //
        this.addRibbon(YZI.E.cardX(240), 0, 75, 280, -8, -12, "_0000s_0003s_0005_Vector-Smart-Object", true);
        //
        this.addRibbon(YZI.E.cardX(720), 220, 85, 170, -8, -12, "_0000s_0003s_0001_Vector-Smart-Object", false);
        //
        this.addRibbon(YZI.E.cardX(820), 200, 52, 450, -8, -12, "_0000s_0003s_0002_Vector-Smart-Object", true);
        //
        this.addRibbon(YZI.E.cardX(1140), 240, 75, 210, -8, -12, "_0000s_0003s_0003_Vector-Smart-Object", false);
        //
        this.addRibbon(YZI.E.cardX(1320), 200, 85, 270, -8, -12, "_0000s_0003s_0005_Vector-Smart-Object", true);


        //mute bauble
        var muteBauble = this.addBauble(YZI.E.cardX(112), 0, 80, -10, 40, "_0000s_0003s_0006_Vector-Smart-Object", 10, 0, 0, -15);
        var muteBtn = YZI.E.addMuteButton(null, -10, 35, 0, YZI.E.findAtlasFor("_0000s_0000s_0000_sound"), "_0000s_0000s_0000_sound", "_0000s_0000s_0001_mute");
        muteBauble.addChild(muteBtn);
        //
        this.addBauble(YZI.E.cardX(400), 80, 110, -4, 300, "_0000s_0003s_0004_Vector-Smart-Object", 80, -11, 200, -20);
        //
        this.addBauble(YZI.E.cardX(300), 70, 110, -4, 80, "_0000s_0003s_0008_Vector-Smart-Object", 50, -11, -60, 20);
        //
        this.addBauble(YZI.E.cardX(600), -50, 130, -4, 180, "_0000s_0003s_0007_Vector-Smart-Object", 60, -11, 30, -10);
        //
        this.addBauble(YZI.E.cardX(1220), 200, 140, -4, 40, "_0000s_0003s_0012_Vector-Smart-Object", 60, -11, 30, 20);
        //
        this.addBauble(YZI.E.cardX(1660), -80, 100, -8, 120, "_0000s_0003s_0016_Vector-Smart-Object", 50, -11, 20, 10);
        //
        this.addBauble(YZI.E.cardX(1500), 100, 144, -8, 175, "_0000s_0003s_0000_Vector-Smart-Object", 80, -11, 30, -20);
        //
        this.addBauble(YZI.E.cardX(1800), -50, 140, -10, 200, "_0000s_0003s_0010_Vector-Smart-Object", 20, -10, 50, 20);



        var msg2Bauble = this.addBauble(YZI.E.hw(), 150, 257, -11, 158, "_0000s_0002s_0001_Vector-Smart-Object", 70, -11, -130, -10);
        msg2Bauble.body.sensor = true;



        //msg1 bg
        var msg1Bg = YZI.E.addImage(null, YZI.E.hw(), 180, 0, YZI.E.findAtlasFor("_0000s_0004_Vector-Smart-Object"), "_0000s_0004_Vector-Smart-Object");
        this.addParallaxObject(msg1Bg, 50);
        //
        msg1Bg.addChild(YZI.E.addImage(null, 0, 100, 0, YZI.E.findAtlasFor("_0000s_0003_Vector-Smart-Object"), "_0000s_0003_Vector-Smart-Object"));

        //msg1
        var msg1 = YZI.E.addLabel(null, 0, -160, 0, YZI.E.msg1Text, this.msg1FontStyle, null, null, 0.5, 0);
        msg1.lineSpacing = -15;
        msg1.setShadow(2, 2, "rgba(0,0,0, 0.7)");
        msg1Bg.addChild(msg1);
        this.fillWithLinearGradient(msg1, "#7d4811", "#c18822", 100);


        //msg2
        var msg2 = YZI.E.addLabel(null, -11/*bauble x offset*/, 158, 0, YZI.E.msg2Text, this.msg2FontStyle);
        msg2.lineSpacing = -6;
        msg2.setShadow(2, 2, "rgba(0,0,0, 0.7)");
        msg2Bauble.addChild(msg2);
        this.showMsgWithFx(msg2, msg2Bauble);




        //snow particles
        this.addSnowParticles();


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
        this.updateParallaxObjects();
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
        var snowEMT = this.game.add.emitter(this.game.world.centerX, -10, 30);
        snowEMT.makeParticles("star");
        snowEMT.maxParticleScale = 0.5;
        snowEMT.minParticleScale = 0.3;
        //snowEMT.alpha = 0.7;
        snowEMT.setYSpeed(20, 100);
        snowEMT.gravity = 0;
        snowEMT.width = this.game.world.width;
        snowEMT.minRotation = 0;
        snowEMT.maxRotation = 360;

        snowEMT.start(false, 10000, 80);
    },

    showMsgWithFx: function(msg, parent)
    {
        var msg2EMT = this.game.add.emitter(-11, 0, 500);
        msg2EMT.makeParticles('star');
        msg2EMT.maxParticleScale = 0.6;
        msg2EMT.minParticleScale = 0.4;
        //msg2EMT.alpha = 0.7;
        //msg2EMT.setXSpeed(-30, 30);
        msg2EMT.setYSpeed(-70, 100);
        msg2EMT.gravity = 180;
        msg2EMT.width = 260;
        msg2EMT.minRotation = 0;
        msg2EMT.maxRotation = 360;

        if (parent)
            parent.addChild(msg2EMT);

        msg.alpha = 0;
        var t1 = this.game.add.tween(msg).to({alpha: 1}, 1700, Phaser.Easing.Quintic.In, true, 900);
        //t1.frameBased = true;

        var t2 = this.game.add.tween(msg2EMT).to({alpha: 0}, 1900, Phaser.Easing.Quintic.Out, true, 1600);
        //t2.frameBased = true;

        msg2EMT.start(true, 6000, null, 150);
        this.game.time.events.add(8000, function() { msg2EMT.destroy(); }, this);
    }
};
