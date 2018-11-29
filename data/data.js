const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')
const pad = require('pad')

var result = {
	'county': require('./town')
}
var sent = 0
var recv = 0

function getResult(id,county,town,obj) {
	sent++
	var url = `http://referendum.2018.nat.gov.tw/pc/zh_TW/${id}/${county}00${town}00000000.html`
	var number = []
	var req = request(url, (err,res,body)=>{
		recv++
		const $ = cheerio.load(body)
		var st = $('#divContent .trT>td')
		obj.agree      = parseInt($(st[0]).text().split(',').join(''))
		obj.disagree   = parseInt($(st[1]).text().split(',').join(''))
		obj.invalid    = parseInt($(st[3]).text().split(',').join(''))
		obj.totalVoter = parseInt($(st[5]).text().split(',').join(''))

		if(recv===sent) fs.writeFileSync('result.json',JSON.stringify(result))
	})
}

function getAll (county,town,obj) {
	obj.votes = []
	for(var i=1;i<=10;i++) {
		var newobj = obj.votes[obj.votes.push({'casenum':(i+6)+''})-1]
		getResult(pad(2,i,'0'),county,town,newobj)
	}
	console.log(`Sent : ${county} ${town}`)
}

getAll('00000','00',result)
result.county.forEach((ce,ci,ca)=>{
	getAll(ce.code,'00',ce)
	ce.town.forEach((te,ti,ta)=>{
		getAll(ce.code,te.code,te)
	})
})

setInterval(()=>{
	console.log(recv+' / '+sent)
},200)

