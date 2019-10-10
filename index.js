//https://github.com/techniq/node-pn532/tree/master/examples

const pn532 = require('pn532');
const SerialPort = require('serialport');
const serialPort = new SerialPort('/dev/cu.usbserial-AL00FN6Z', { baudRate: 115200});

const option={
    pollInterval:0 /**Disable software auto scanning tag */
}
const rfid = new pn532.PN532(serialPort,option);
const ndef = require('ndef');


let uuid = new Set();
let last_uuid='';
let hdl_timeout=0;
function log_cmd_ret_hex(buff,label='log_data : '){
     let dat=buff.toString('hex').match(/.{1,2}/g).join(':');
     console.log(label,dat);
}



console.log('Waiting for rfid ready event...');
rfid.on('ready', async function() {
    rfid.ScanTagWithEvent();//first scan
});
rfid.eventScanTag.on('tag', async function(tag_info) {
    if(last_uuid===tag_info.uid){
        clearTimeout(hdl_timeout);
        hdl_timeout= setTimeout(()=>{
            console.log('card.out event');
            last_uuid='';
          },300);  
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
        //let fr= await rfid.InRelease();//release current card
        //log_cmd_ret_hex(fr,'Tag release');
    }
    
    rfid.ScanTagWithEvent();//scan next tag
});
rfid.eventScanTag.on('tag_err', async function(err) {
    console.error('tag err',err);
    last_uuid='';
    rfid.ScanTagWithEvent();//scan next tag
});


