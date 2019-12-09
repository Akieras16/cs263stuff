var noble = require('@abandonware/noble');
const bleno = require('@abandonware/bleno');
//var bluetooth = require('node-bluetooth');

// once we have performed sniffing via ubertooth, these are targets
const devices = [
  "28:11:a5:d4:ca:70", "28-11-a5-d4-ca-70", "f4-0f-24-2c-21-82"
];

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  peripheral.connect(function(error) {
    try {
      
    console.log('connected to peripheral: ' + peripheral.address);
      if(devices.indexOf(peripheral.address) < 0) {
        return;
      }
      
    console.log(JSON.stringify(peripheral.advertisement.localName));
    console.log(peripheral.advertisement.manufacturerData);
    peripheral.discoverServices(['180a'], function(error, services) {
      var deviceInformationService = services[0];
      console.log('discovered device information service');

      console.log(peripheral.advertisement);

      if(deviceInformationService != null) {

        deviceInformationService.discoverCharacteristics(null, function(error, characteristics) {
          console.log('discovered the following characteristics:');
          for (var i in characteristics) {
            console.log('  ' + i + ' uuid: ' + characteristics[i]);
          }
        });
      }

    });
  }
  catch {
      console.log('A connection error occured! Continuing');
  }
  });
});