// linear fadein/fadeout effect
function FadeInOut()
{
    this.defaultParams = {"from": 1.0, "to": 0.0, "speed": 0.01};        // default params
    this.currentParams = this.defaultParams;    // current value of params
    this.curVal = this.currentParams.from;


    // from - start value 
    // to - end value 
    // speed - grow speed, can be negative in this case swap from and to
    this.Init = function(from, to, speed)
    {
        this.currentParams.from = from; 
        this.currentParams.to = to; 

        this.currentParams.speed = speed ; 
        this.curVal = this.currentParams.from;
    }

    // reset value of object
    this.Reset = function()
    {
        this.Init(this.currentParams.from, this.currentParams.to, this.currentParams.speed);
    }

    // true if effect complete
    this.isComplete = function()
    {
        return this.currentParams.to == this.curVal;
    }

    // get current value for object
    this.getValue = function()
    {
        return this.curVal;
    }

    // update effect
    this.Update = function()
    {
        if(this.isComplete())
            return; // nothing update when effect complete

        this.curVal += this.currentParams.speed;
        var isComplete = (this.currentParams.speed > 0) ? (this.curVal >= this.currentParams.to) : (this.curVal <= this.currentParams.to);
        if(isComplete)
        {
            this.curVal = this.currentParams.to;
        }
    }

}
