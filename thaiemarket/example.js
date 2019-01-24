var casper = require('casper').create();
var fs = require('fs');
var links = [];   //all link of thaiemarket
var url = 'https://www.thaiemarket.com/th/shop/'
var num = 1;
var data = {
	"company" : '#__layout > div > div > div.col-12.main-content > div > div.col-12.offset-md-1.col-md-10.offset-lg-2.col-lg-8.mt-4 > div > div.col-12.col-md-7.pt-3 > p.h2',
	"address" : '#__layout > div > div > div.col-12.main-content > div > div.col-lg-10.offset-lg-1.col-12 > div:nth-child(3) > p:nth-child(1)',
	"email" : '#__layout > div > div > div.col-12.main-content > div > div.col-lg-10.offset-lg-1.col-12 > div:nth-child(3) > p:nth-child(2) > span',
	"website" : '#__layout > div > div > div.col-12.main-content > div > div.col-lg-10.offset-lg-1.col-12 > div:nth-child(3) > p:nth-child(4)',
	"facebook" : '#__layout > div > div > div.col-12.main-content > div > div.col-lg-10.offset-lg-1.col-12 > div:nth-child(3) > p:nth-child(5)',
	"line" : '#__layout > div > div > div.col-12.main-content > div > div.col-lg-10.offset-lg-1.col-12 > div:nth-child(3) > p:nth-child(6)'}
var store = {"company":[],"address":[],"email":[],"website":[],"facebook":[],"line":[],"province":[]}
var province = [
	"นครราชสีมา","เชียงใหม่","กาญจนบุรี","ตาก","อุบลราชธานี","สุราษฎร์ธานี","ชัยภูมิ","แม่ฮ่องสอน","เพชรบูรณ์",
	"ลำปาง","อุดรธานี","เชียงราย","น่าน","เลย","ขอนแก่น","พิษณุโลก","บุรีรัมย์","นครศรีธรรมราช",
	"สกลนคร","นครสวรรค์","ศรีสะเกษ","กำแพงเพชร","ร้อยเอ็ด","สุรินทร์","อุตรดิตถ์","สงขลา",
	"กาฬสินธุ์","อุทัยธานี","สุโขทัย","แพร่","ประจวบคีรีขันธ์","จันทบุรี","พะเยา","เพชรบุรี",
	"ลพบุรี","ชุมพร","นครพนม","สุพรรณบุรี","ฉะเชิงเทรา","มหาสารคาม","ราชบุรี","ปราจีนบุรี","กระบี่",
	"พิจิตร","ยะลา","ลำพูน","นราธิวาส","ชลบุรี","มุกดาหาร","บึงกาฬ","พังงา","ยโสธร","หนองบัวลำภู","สระบุรี",
	"ระยอง","พัทลุง","ระนอง","อำนาจเจริญ","หนองคาย","ตราด","พระนครศรีอยุธยา","สตูล","ชัยนาท","นครปฐม","นครนายก","ปัตตานี",
	"กรุงเทพมหานคร","ปทุมธานี","สมุทรปราการ","อ่างทอง","สมุทรสาคร","สิงห์บุรี","นนทบุรี","ภูเก็ต","สมุทรสงคราม","สระแก้ว","ตรัง"]

function addAllLink() {
	for (var i= 3001; i<= 6000; i++) {
		links.push(url+i)
	}
}

function addToProvinceStore(num) {
	for(var i=0; i<province.length; i++) {
		if (store.address[num-1].match(province[i]) && (store.address[num-1] != null)){
			store.province[num-1] = province[i]
			break;
		}
	}
}

function progress(num, start, end) {
	return ((num*100/3000).toFixed(2) + "% done : " + (end-start) + "ms")
}

function start() {
	var timeStamp_start = new Date()
	addAllLink()
	casper.start().each(links, function(self, link) {
		this.thenOpen(link, function() {
			var start = new Date().getTime();
			store.company.push(this.fetchText(data.company));
			store.address.push(this.fetchText(data.address));
			store.email.push(this.fetchText(data.email));
			store.website.push(this.fetchText(data.website));
			store.facebook.push(this.fetchText(data.facebook));
			store.line.push(this.fetchText(data.line));
			addToProvinceStore(num)
			num += 1
			fs.write('../thaiemarket 6000.json', JSON.stringify(store));
			var end = new Date().getTime();
			this.echo(progress(num, start, end))
		})
	});

	casper.run(function() {
		var timeStamp_end = new Date()
		console.log(timeStamp_start.getHours()+":"+timeStamp_start.getMinutes()+":"+timeStamp_start.getSeconds())
		console.log(timeStamp_end.getHours()+":"+timeStamp_end.getMinutes()+":"+timeStamp_end.getSeconds())
		this.exit();
	});
}

start()