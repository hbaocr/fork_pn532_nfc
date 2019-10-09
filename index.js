//https://github.com/techniq/node-pn532/tree/master/examples

const pn532 = require('pn532');
const SerialPort = require('serialport');
const serialPort = new SerialPort('/dev/cu.usbserial-AL00FN6Z', { baudRate: 115200 });
const option={
    pollInterval:0 /**Disable software auto scantag */
}
const rfid = new pn532.PN532(serialPort,option);
const ndef = require('ndef');

const cmd_code = require("./pn532_cmd");

function log_cmd_ret_hex(fr,label='log_data : '){
     let dat=fr.getData().toString('hex').match(/.{1,2}/g).join(':');
     console.log(label,dat);
}


let uuid = new Set();
let last_uuid='';
console.log('Waiting for rfid ready event...');
rfid.on('ready', async function() {
    rfid.ScanTagWithEvent();//first scan
});
rfid.on('tag', async function(tag_info) {
    if(last_uuid===tag_info.uid){
      
    }else{
        last_uuid=tag_info.uid;
        console.log(Date.now(),'  new uuid = ',tag_info.uid);

        let messages = [
            ndef.uriRecord('http://www.google.com/qwertyuiopasdsfghjhgfdsfghgdfstdrghkjlkjhkjl'),
            ndef.textRecord('12345678901234567890123456789012345678901234567890abcdefighklmn')
        ];
        let data = ndef.encodeMessage(messages);
        console.log('write_data_byte: ',data.length);

        let res= await rfid.writeNdefData(data);
        console.log(res);

        let fr= await rfid.InRelease();
        log_cmd_ret_hex(fr,'Tag release');
    }
    
  
    rfid.ScanTagWithEvent();//scan next tag
});
rfid.on('tag_err', async function(tag_info) {
   
    rfid.ScanTagWithEvent();//scan next tag
});


