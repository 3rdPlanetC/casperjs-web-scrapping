// Import libraries
var casper = require('casper').create();
var fs = require('fs');

// Create Array for contain link
var links = [];

// Set url hostname + path
var url = 'https://www.hostname.com/path'

// Set index of data
var num = 1;

// All of element encapsulated the data
var data = {
	"company" : '#id',
	"address" : '.classname',
	"email" : '#id > .classname',
	"website" : 'a[href^="#"]',
	"facebook" : 'body',
	"line" : 'li.#id'}

// Create data component that you want
var store = {"company":[],"address":[],"email":[],"website":[],"facebook":[],"line":[],"province":[]}

// All of province in Thailand
var province = [
	"นครราชสีมา","เชียงใหม่","กาญจนบุรี","ตาก","อุบลราชธานี","สุราษฎร์ธานี","ชัยภูมิ","แม่ฮ่องสอน","เพชรบูรณ์",
	"ลำปาง","อุดรธานี","เชียงราย","น่าน","เลย","ขอนแก่น","พิษณุโลก","บุรีรัมย์","นครศรีธรรมราช",
	"สกลนคร","นครสวรรค์","ศรีสะเกษ","กำแพงเพชร","ร้อยเอ็ด","สุรินทร์","อุตรดิตถ์","สงขลา",
	"กาฬสินธุ์","อุทัยธานี","สุโขทัย","แพร่","ประจวบคีรีขันธ์","จันทบุรี","พะเยา","เพชรบุรี",
	"ลพบุรี","ชุมพร","นครพนม","สุพรรณบุรี","ฉะเชิงเทรา","มหาสารคาม","ราชบุรี","ปราจีนบุรี","กระบี่",
	"พิจิตร","ยะลา","ลำพูน","นราธิวาส","ชลบุรี","มุกดาหาร","บึงกาฬ","พังงา","ยโสธร","หนองบัวลำภู","สระบุรี",
	"ระยอง","พัทลุง","ระนอง","อำนาจเจริญ","หนองคาย","ตราด","พระนครศรีอยุธยา","สตูล","ชัยนาท","นครปฐม","นครนายก","ปัตตานี",
	"กรุงเทพมหานคร","ปทุมธานี","สมุทรปราการ","อ่างทอง","สมุทรสาคร","สิงห์บุรี","นนทบุรี","ภูเก็ต","สมุทรสงคราม","สระแก้ว","ตรัง"]

// Set integer pathname in example : "www.hostname.com/pathname/10"
function addAllLink() {
	for (var i= 1; i<= 10; i++) {
		links.push(url+i)
	}
}

// ** Optional **  Create addToProvinceStore function for keep province from data in element if some of elements have not province data.
function addToProvinceStore(num) {
	for(var i=0; i<province.length; i++) {
		if (store.address[num-1].match(province[i]) && (store.address[num-1] != null)){
			store.province[num-1] = province[i]
			break;
		}
	}
}

// ** Optional ** Create progress function for checking the progress when start function is running
function progress(num, start, end) {
	return ((num*100/3000).toFixed(2) + "% done : " + (end-start) + "ms")
}

// Main function
function start() {
	// Create timeStamp for checking total of time spent
	var timeStamp_start = new Date();
	addAllLink();
	casper.start().each(links, function(self, link) {
		this.thenOpen(link, function() {
			var start = new Date().getTime();

			//data has been pulled and take it to store array.
			store.company.push(this.fetchText(data.company));
			store.address.push(this.fetchText(data.address));
			store.email.push(this.fetchText(data.email));
			store.website.push(this.fetchText(data.website));
			store.facebook.push(this.fetchText(data.facebook));
			store.line.push(this.fetchText(data.line));

			// ** Optional ** addToProvinceStore function
			addToProvinceStore(num)

			// Index changing
			num += 1

			// write a json file after the data has been pulled
			fs.write('../filename.json', JSON.stringify(store));
			var end = new Date().getTime();

			// log data for showing of progress
			this.echo(progress(num, start, end))
		})
	});

	// casper.run(function() {}) for running this file
	casper.run(function() {
		var timeStamp_end = new Date()
		console.log(timeStamp_start.getHours()+":"+timeStamp_start.getMinutes()+":"+timeStamp_start.getSeconds())
		console.log(timeStamp_end.getHours()+":"+timeStamp_end.getMinutes()+":"+timeStamp_end.getSeconds())
		this.exit();
	});
}

start()