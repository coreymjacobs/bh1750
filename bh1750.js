//bh1750 light sensor
class BH1750 {
    constructor(options) {
        const i2c = require('i2c-bus');
        //sent from instance call
        let opts = options || {};
        //decvice vars
        this.device = {};
        this.device.name = (opts.hasOwnProperty('name')) ? opts.name : 'bh1750';
        this.device.type = (opts.hasOwnProperty('type')) ? opts.type : 'Light Sensor';
        this.device.bus = (opts.hasOwnProperty('bus')) ? opts.bus : 1; //default is 1
        this.device.addr = (opts.hasOwnProperty('addr')) ? opts.addr : 0x23; //default is 0x23
        //read can be onetime or continuous
        this.device.read = (opts.hasOwnProperty('read')) ? opts.read : 'continuous'; //default is continuous

        //return value
        this.lux = 0;
 
        //set the bus number, call with this.bus.whatEver
        this.bus = i2c.openSync(this.device.bus);

        //shows all connected devices if you want
        //console.log('Scan:', this.bus.scanSync());

        //load all the constants
        this.loadConstants();

        //set read type, continuous or onetime
        //onetime mode saves some energy, not much but no need to keep it in continuous
        //best to use hi-res as it filters out some of the interference with the long read time
        this.read_type = (this.device.read == 'continuous') ? this.register.CONTINUOUS_HI_RES_MODE_1 : this.register.ONE_TIME_HI_RES_MODE_1;
    }

/////////////////////--------------------------------//////////////////////
/////////////////////--------------------------------//////////////////////
/////////////////////--------------------------------//////////////////////

    async readLight() {
        try {
            //set empty buffer, reading 2 bytes
            let buffer = Buffer.alloc(2);
        
            this.bus.readI2cBlockSync(this.device.addr, this.read_type, 2, buffer);
            
            //convert the value to lumens and set global result var
            this.lux = await this.convertToLux(buffer);
        }
        catch (err) {
            this.logError("readLight", err);
            return false;
        }
        finally {
            //return lux, in a promise
            //using finally prevents undefined results in external calls if have an error in try/catch
            return this.lux;
        }
    }

    convertToLux(data) {
        try {
            return Math.round((data[1] + (256 * data[0])) / 1.2);
        }
        catch (err) {
            this.logError("convertToLux", err);
            return false;
        }
    }
    


    // ------------ general functions -----------------------------------
    // ------------ general functions -----------------------------------
    // ------------ general functions -----------------------------------

    logError(funcname, err) {
        let error_txt = `${this.device.name}, File: bh1750_module.js, Function: ${funcname}, ${err.stack}, ERROR: ${err}`;
        console.error(error_txt);
    }


    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////

    loadConstants() {
        this.register = {
            POWER_DOWN: 0x00,
            POWER_ON: 0x01,
            RESET: 0x07, //reset data register value
            
            CONTINUOUS_LOW_RES_MODE: 0x13, //Start measurement at 4lx resolution. Time typically 16ms
            CONTINUOUS_HI_RES_MODE_1: 0x10, //Start measurement at 1lx resolution. Time typically 120ms
            CONTINUOUS_HI_RES_MODE_2: 0x11, //Start measurement at 0.5lx resolution. Time typically 120ms
            ONE_TIME_HI_RES_MODE_1: 0x20, //Device is automatically set to Power Down after measurement
            ONE_TIME_HI_RES_MODE_2: 0x21, //Device is automatically set to Power Down after measurement
            ONE_TIME_LOW_RES_MODE: 0x23 //Device is automatically set to Power Down after measurement   
        }
    }

}

module.exports = BH1750;
