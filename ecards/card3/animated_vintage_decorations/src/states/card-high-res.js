YZI = window.YZI || {};

YZI.CardHighRes = function() {};

YZI.CardHighRes.prototype =
{
    init: function()
    {
        this.msg1FontStyle =
        {
            font: "normal " + YZI.E.msg1FontSize + "px Principal",
            fill: "#fefefe",
            align: "center",
            stroke: "#ffffff",
            strokeThickness: 2
        };

        this.msg2FontStyle =
        {
            font: "normal " + YZI.E.msg2FontSize + "px Message",
            fill: "#6c6867",
            align: "center"
            /*stroke: "red",
             strokeThickness: 4*/
        };
    },

    create: function()
    {
        YZI.E.initCard(this);

        YZI.E.initPhysics(this);


        //main bg
        this.mainBg = YZI.E.addTileSprite(null, YZI.E.hw(), 0, 0, YZI.E.findAtlasFor("_0011_background"), "_0011_background",
            YZI.E.curCardPreset().width*3, YZI.E.curCardPreset().height, 0.5, 0);
        this.addParallaxObject(this.mainBg, -50);

        //tip use your mouse
        var tip = YZI.E.addImage(null, YZI.E.cardX(300), 1080 - 160, 0, YZI.E.findAtlasFor("_0002_tip"), "_0002_tip");
        this.addParallaxObject(tip, 80);


        //msg2
        var msg2 = YZI.E.addLabel(null, YZI.E.hw(), YZI.E.hh() + 70, 0, YZI.E.msg2Text, this.msg2FontStyle, null, null, 0.5, 0.5);
        msg2.lineSpacing = -6;
        msg2.setShadow(1.8, 1.8, "rgba(250,250,250, 0.8)");
        this.addParallaxObject(msg2, 50);
        this.showMsgWithFx(msg2);




        //top phys base
        this.topBase = this.game.physics.box2d.createBody(YZI.E.hw(), 0);
        this.topBase.setRectangle(YZI.E.curCardPreset().width, 10);
        this.topBase.static = true;

        //
        this.addBauble(YZI.E.cardX(135), 0, 90, -8, 90, "_0010_Layer-8", 25, -8, -15, -20);
        //
        this.addBauble(YZI.E.cardX(1270), 0, 80, -8, 400, "_0009_Layer-8-copy", 20, -8, 310, 20);
        //
        var b1 = this.addBauble(YZI.E.cardX(630), 0, 80, -8, 410, "_0008_Layer-3", 70, -8, 340, -20)
        b1.body.addCircle(50, -8, 275);
        b1.body.addCircle(30, -8, 215);
        b1.body.addCircle(20, -8, 160);
        //
        var b2 = this.addBauble(YZI.E.cardX(1560), 0, 85, -8, 400, "_0007_Layer-4", 80, -8, 320, -20);
        b2.body.addCircle(58, -8, 235);
        b2.body.addCircle(32, -8, 165);
        b2.body.addCircle(22, -8, 100);
        //
        var muteBauble = this.addBauble(YZI.E.cardX(1717), 0, 125, -8, 117, "_0006_Layer-5", 14, -8, -15, 20);
        //
        var logoBauble = this.addBauble(YZI.E.cardX(378), 0, 176, -8, 191, "_0005_Layer-6", 20, -8, 7, 20);
        //
        var b3 = this.addBauble(YZI.E.cardX(1413), 0, 95, -8, 150, "_0004_Layer-7", 28, -8, 284, -20);
        b3.body.addCircle(14, -8, 50);
        b3.body.addCircle(14, -8, -3);
        b3.body.addCircle(14, -8, 372);
        b3.body.addCircle(28, -8, -85);



        var muteBtn = YZI.E.addMuteButton(null, -5, 117, 0, YZI.E.findAtlasFor("_0000s_0000_sound"), "_0000s_0000_sound", "_0000s_0002_mute");
        muteBauble.addChild(muteBtn);

        //logo
        var logoBtn = this.addLogoBtn(logoBauble, -8, 191);
        //this.addParallaxObject(logoBtn.body, 50);


        //msg1 bg
        var msg1Bg = YZI.E.addImage(null, YZI.E.hw(), -370, 0, YZI.E.findAtlasFor("_0003_Layer-9"), "_0003_Layer-9", 0.5, 0);
        var msg1BgTW = this.game.add.tween(msg1Bg).to({y: 0}, 1700, Phaser.Easing.Bounce.Out, true, 100);
        msg1BgTW.frameBased = true;
        /*msg1BgTW.onComplete.add(function()
        {
            this.addParallaxObject(msg1Bg, 50);
        }, this);*/



        //msg1
        var msg1 = YZI.E.addLabel(null, 0, 235, 0, YZI.E.msg1Text, this.msg1FontStyle, null, null, 0.5, 0.5);
        msg1.lineSpacing = -15;
        //msg1.setShadow(1, 1, "rgba(0,0,0, 0.7)");
        this.fillWithLinearGradient(msg1, "#fefefe", "#b9b9b7", 90);
        msg1Bg.addChild(msg1);





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
    },

    addBauble: function(x, y, r1, xo1, yo1, frameName, r2, xo2, yo2, angle)
    {
        var baubleSP = YZI.E.addSprite(null, x, y + yo1, null, YZI.E.findAtlasFor(frameName), frameName);

        this.game.physics.box2d.enable(baubleSP);
        baubleSP.body.setCircle(r1, xo1, yo1);
        baubleSP.body.addCircle(r2, xo2, yo2);
        baubleSP.body.angle = angle;
        //baubleSP.body.setCollisionMask(1);

        this.game.physics.box2d.revoluteJoint(this.topBase, baubleSP, x - YZI.E.hw(), y, 0, -baubleSP.height/2);

        return baubleSP;
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
        var msg2EMT = this.game.add.emitter(YZI.E.hw(), 330, 500);
        msg2EMT.makeParticles('star');
        msg2EMT.maxParticleScale = 0.6;
        msg2EMT.minParticleScale = 0.4;
        //msg2EMT.alpha = 0.7;
        //msg2EMT.setXSpeed(-30, 30);
        msg2EMT.setYSpeed(-70, 100);
        msg2EMT.gravity = 180;
        msg2EMT.width = 700;
        msg2EMT.minRotation = 0;
        msg2EMT.maxRotation = 360;

        if (parent)
        {
            parent.addChild(msg2EMT);
        }

        msg.alpha = 0;

        //emt delay start
        var delayTM = this.game.time.events.add(1800, function()
        {
            msg2EMT.start(true, 6000, null, 170);

            var t1 = this.game.add.tween(msg).to({alpha: 1}, 1700, Phaser.Easing.Quintic.In, true, 900);
            t1.frameBased = true;

            var t2 = this.game.add.tween(msg2EMT).to({alpha: 0}, 1900, Phaser.Easing.Quintic.Out, true, 2200);
            t2.frameBased = true;

        }, this);
        delayTM.frameBased = true;

        var removeTM = this.game.time.events.add(8000, function() { msg2EMT.destroy(); }, this);
        removeTM.frameBased = true;
    }
};
