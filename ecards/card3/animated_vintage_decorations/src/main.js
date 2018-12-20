window.onload = function()
{
    var game = new Phaser.Game(1, 1, Phaser.CANVAS, "game", "boot");

    game.state.add("boot", YZI.Boot);
    game.state.add("ios_prestart", YZI.IosPrestart);
    game.state.add("card_high_res", YZI.CardHighRes);
    game.state.add("card_low_res", YZI.CardLowRes);



    //config
    YZI.E.cardPreset =
    {
        current: "",

        lowRes: {
            width: 1920,
            height: 1079,
            state: "card_high_res",
            resDir: "high_res"
        },
        highRes: {
            width: 1920,
            height: 1079,
            state: "card_high_res",
            resDir: "high_res"
        }
    };

    YZI.E.curCardPreset = function() { return YZI.E.cardPreset[YZI.E.cardPreset.current]; };


    YZI.E.preloaderBgColor = "#aaa4a6";
    YZI.E.preloaderWheelColor = "0x222222";
    YZI.E.preloaderTextColor = "#222222";
    YZI.E.transCoverColor = "0xaaa4a6";
    YZI.E.IosBtnColor = "0xff0000";

    YZI.E.DEBUG = false;
    YZI.E.physDebug = false;
};


YZI.E.initCard = function(_this)
{
    YZI.E.resizeCard();
    if (_this.game.device.desktop)
    {
        _this.scale.onSizeChange.addOnce(function() { _this.game.state.start("boot"/*YZI.E.curCardPreset().state*/, true, true); }, _this);
    }

    _this.add.audio("main_soundtrack", 1, true).play();


    //parallax
    _this.addParallaxObject = function(object, speedX, speedY)
    {
        if (!_this.parallaxObjects)
        {
            _this.parallaxObjects = [];
        }

        _this.parallaxObjects.push({object: object, sx: object.x, sy: object.y, speedX: speedX, speedY: speedY || 999999});
    };

    _this.updateParallaxObjects = function()
    {
        for (var i = 0; i < _this.parallaxObjects.length; i++)
        {
            var offsetX = (_this.game.input.mousePointer.x - YZI.E.curCardPreset().width/2)/_this.parallaxObjects[i].speedX;
            var offsetY = (_this.game.input.mousePointer.y - YZI.E.curCardPreset().height/2)/_this.parallaxObjects[i].speedY;

            _this.parallaxObjects[i].object.x = Math.round(_this.parallaxObjects[i].sx + offsetX);
            //_this.parallaxObjects[i].object.y = Math.round(_this.parallaxObjects[i].sy + offsetY);
        }
    };


    //logo
    _this.addLogoBtn = function(parent, x, y, withBody)
    {
        var logoBtn = YZI.E.addSprite(null, x, y, 0, "logo", null);

        if (withBody)
        {
            this.game.physics.box2d.enable(logoBtn);
            logoBtn.body.kinematic = true;
            logoBtn.body.sensor = true;
        }

        logoBtn.inputEnabled = true;
        logoBtn.events.onInputDown.add(function() { window.open("http://" + YZI.E.siteUrl, "_blank"); }, this);

        /*var logoBody = this.game.physics.box2d.createBody(logoBtn.x, logoBtn.y);
         logoBody.setRectangle(logoBtn.width, logoBtn.height);
         logoBody.static = true;
         logoBody.sensor = true;*/

        if (parent)
        {
            parent.addChild(logoBtn);
        }

        return logoBtn;
    };


    //linear gradient
    _this.fillWithLinearGradient = function(label, color1, color2, height)
    {
        var grd = label.context.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(0, color1);
        grd.addColorStop(1, color2);
        label.fill = grd;
    }
};


YZI.E.initPhysics = function(_this)
{
    _this.game.physics.startSystem(Phaser.Physics.BOX2D);
    _this.game.physics.box2d.gravity.y = 500;
    //default prop for fixtures
    _this.game.physics.box2d.density = 1;
    _this.game.physics.box2d.friction = 0.3;
    _this.game.physics.box2d.restitution = 0.2;

    //debug draw
    _this.game.physics.box2d.debugDraw.shapes = true;
    _this.game.physics.box2d.debugDraw.joints = true;
    _this.game.physics.box2d.debugDraw.centerOfMass = true;
    //_this.game.physics.box2d.debugDraw.aabbs = true;
    //_this.game.physics.box2d.debugDraw.pairs = true;

    //pointer interaction
    _this.game.input.onDown.add(function() { _this.game.physics.box2d.mouseDragStart(_this.game.input.activePointer); }, _this);
    _this.game.input.addMoveCallback(function()
    {
        _this.game.physics.box2d.mouseDragMove(_this.game.input.activePointer);

        //hand cursor
        if (_this.game.physics.box2d.getBodiesAtPoint(_this.game.input.mousePointer.x, _this.game.input.mousePointer.y).length)
        {
            _this.game.canvas.style.cursor = "pointer";
        }
        else
        {
            _this.game.canvas.style.cursor = "default";
        }
    }, _this);
    _this.game.input.onUp.add(function() { _this.game.physics.box2d.mouseDragEnd(); }, _this);
};