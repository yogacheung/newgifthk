// shiver effect implementation
function ShiverEffect()
{
    // amplitude - start effect amplitude
    // attenuationFactor - amplitude attenuation factor
    // oscillation - oscillation frequency
    this.defaultParams = {"amplitude": 1.0, "attenuationFactor": 0.01, "oscillation":0.1};	// start values
    this.currentAmplitude = this.defaultParams.amplitude;	// current value of amplitude
    this.currentPhase = 0.0;
    this.value  = 0.0;

    this.Init = function(amplitude, attenuationFactor, oscillation)
    {

	this.defaultParams.amplitude = amplitude;
	this.defaultParams.attenuationFactor = attenuationFactor;
	this.defaultParams.oscillation = oscillation;
	this.currentAmplitude = this.defaultParams.amplitude;

	this.currentPhase = 0.0;
	this.value = 0.0;
    }

    this.Update = function()
    {
	if(this.currentAmplitude == 0.0)
	{
	    this.value = 0.0;
	    return;
	}

	this.currentAmplitude -= this.defaultParams.attenuationFactor;
	if(this.currentAmplitude < 0.0)
	{	
	    this.currentAmplitude = 0.0;
	    this.value = 0.0;
	    return;
	}

	this.currentPhase += this.defaultParams.oscillation;
	this.value = this.currentAmplitude * Math.cos(this.currentPhase);
    }

    // Start/Restart effect
    this.Start = function()
    {
	this.Init(this.defaultParams.amplitude, this.defaultParams.attenuationFactor, this.defaultParams.oscillation);
    }

    // Get effect value
    this.GetValue = function()
    {
	return this.value;
    }

    this.isComplete = function()
    {
	return this.currentAmplitude == 0.0;
    }
}

