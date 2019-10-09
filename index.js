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
       //console.log('tag already checked')
    }else{
        last_uuid=tag_info.uid;
        console.log('new uuid = ',tag_info.uid);
    }
   
    rfid.ScanTagWithEvent();//scan next tag
});
rfid.on('tag_err', async function(tag_info) {
   
    rfid.ScanTagWithEvent();//scan next tag
});


// rfid.on('ready', async function () {

//     console.log('Waiting for a tag...');
    
//     // rfid.getFirmwareVersion().then(fr=>{
//     //     console.log(fr);
//     // })
//     rfid.sendCommand([0x02]).then(fr=>{
//         console.log('version: ',fr);
//     })
//     // rfid.scanTag().then(function(tag) {
//     //     console.log('Tag found:', tag);

//     //     var messages = [
//     //         ndef.uriRecord('http://www.google.com'),
//     //         ndef.textRecord('test')
//     //     ];
//     //     var data = ndef.encodeMessage(messages);

//     //     console.log('Writing tag data...');
//     //     rfid.writeNdefData(data).then(function(response) {
//     //         console.log('Write successful');
//     //     });
//     // });
// });



// // let cmd_imDeselect=()=>{
// //    	//PN532 User Manual-UM0701-02
// // 	//7.3.10 InDeselect
// // 	/**
// // 	 * D4 44 Tg
// // 	 * Tg  a byte containing the logical number of the relevant target (=0x00 : deselect all tag )
// // 	 */
// //     const pn532_deslect_cmd_payload = [0x44, 0x01];
// //     return Buffer.from([...pn532_deslect_cmd_payload])
// // }



// // try {
// //     let a =   rfid.sendCommand([0x02]).then((frame) => {
// //         var body = frame.getDataBody();
      
// //     }).catch(e=>{
// //         console.log(e)
// //     });
// // } catch (error) {
    
// // }



// // rfid.on('ready', async function() {

// //     console.log('Listening for a tag scan...');
// //     console.log(cmd_imDeselect());
   
// //     rfid.on('tag', function(tag) {
// //         console.log('Tag', tag.uid);
// //         let indeselct=cmd_imDeselect();
// //         //rfid.sendCommand(indeselct);
// //        // console.log('Reading tag data...');
// //         // rfid.readNdefData().then(function(data) {
// //         //     console.log('Tag data:', data);

// //         //     var records = ndef.decodeMessage(Array.from(data));
// //         //     console.log(records);
// //         // });
// //     });
// // });