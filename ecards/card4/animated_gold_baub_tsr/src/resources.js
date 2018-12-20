YZI = window.YZI || {};

YZI.Resources = function() {};

YZI.Resources.assetsToLoad = function(loader)
{
    //high res
    if (YZI.E.curCardPreset().resDir == "high_res")
    {
        loader.atlas("hres_ta0", "res/high_res/hres_ta0.png", "res/high_res/hres_ta0.json");
        loader.atlas("hres_ta1", "res/high_res/hres_ta1.png", "res/high_res/hres_ta1.json");
        loader.atlas("hres_ta2", "res/high_res/hres_ta2.png", "res/high_res/hres_ta2.json");
    }

    //low res
    if (YZI.E.curCardPreset().resDir == "low_res")
    {
        loader.atlas("lres_ta0", "res/low_res/lres_ta0.png", "res/low_res/lres_ta0.json");
    }

    loader.image("star", "res/common/star.png");
};

YZI.R = YZI.Resources;
