//require module
//
const BH1750 = require('./bh1750');

//addr: is the I2C address of the sensor, defaults to 0x23
//bus: I2C bus number using for communications, defaults to 1
//read: can be 'continuous' or 'onetime'
//onetime puts the device to sleep after read, saves a little bit of power. If not concerned with consumption can use continuous
//
//create a new instance
const bh1750_1 = new BH1750({addr: 0x23, bus: 1, read: 'onetime'});

//readLight function returns a Promise so need to unwrap it
//value is in lumens
bh1750_1.readLight().then(r => {
    //after unwrap promise, console.log the result
    console.log(r);
});


//can also set an interval
setInterval( () => {
    bh1750_1.readLight().then(r => { 
        console.log(r);
    });
}, 2000);



//if have a second light sensor, call another instance
//ensure to use the correct addr!!!
const bh1750_2 = new BH1750({addr: 0x5C, bus: 1, read: 'onetime'});

bh1750_2.readLight().then(r => {
    //after unwrap promise, console.log the result
    console.log(r);
});
