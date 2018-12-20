YZI = window.YZI || {};

YZI.IosPrestart = function() {};

YZI.IosPrestart.prototype =
{
    create: function()
    {
        var playButton = YZI.E.addButton(null, YZI.E.hw(), YZI.E.hh(), 0, "ios_btn_play", null, null,
            function()
            {
                YZI.E.runScene(YZI.E.curCardPreset().state);
            }, null, this);

        playButton.tint = YZI.E.IosBtnColor;
    }
};
