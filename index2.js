var voteType = ['agree','invalid','novote','disagree']
var colors = [d3.hsl(150,.7,.5)+'','#888888','#333333',d3.hsl(30,.7,.5)+'']
var lonmin = 119.34
var lonmax = 122.01
var latmin = 21.86
var latmax = 25.4
var width = lonmax-lonmin
var height = latmax-latmin
var scale = 300
var novotes = false
var invalid = true
var mode = 1
var casei = 0
var x = d3.scaleLinear().range([0,width*scale] ).domain([lonmin,lonmax])
var y = d3.scaleLinear().range([height*scale,0]).domain([latmin,latmax])
var svg = d3.select('#map').append('svg')
            .attr('width', width*scale)
            .attr('height', height*scale)
var arc = d3.arc()
	.innerRadius(30)
	.outerRadius(50)
	.cornerRadius(1)
	.padAngle(.01)
var all = [
	{'case':  '7', 'result': {
		'agree': 7955753, 'invalid': 715140, 'disagree': 2109157}},
	{'case':  '8', 'result': {
		'agree': 7599267, 'invalid': 823945, 'disagree': 2346316}},
	{'case':  '9', 'result': {
		'agree': 7791856, 'invalid': 756041, 'disagree': 2231425}},
	{'case': '10', 'result': {
		'agree': 7658008, 'invalid': 459508, 'disagree': 2907429}},
	{'case': '11', 'result': {
		'agree': 7083379, 'invalid': 507101, 'disagree': 3419624}},
	{'case': '12', 'result': {
		'agree': 6401748, 'invalid': 540757, 'disagree': 4072471}},
	{'case': '13', 'result': {
		'agree': 4763086, 'invalid': 505153, 'disagree': 5774556}},
	{'case': '14', 'result': {
		'agree': 3382286, 'invalid': 608484, 'disagree': 6949697}},
	{'case': '15', 'result': {
		'agree': 3507665, 'invalid': 619001, 'disagree': 6805171}},
	{'case': '16', 'result': {
		'agree': 5895560, 'invalid': 922960, 'disagree': 4014215}}
]

function drawMap(g,geo){
	if(geo.type === 'MultiPolygon'){
		geo.coordinates.forEach((ge,gi,ga)=>{
			g.append('path').data(ge)
			 .attr('d',d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
		})	
	}
	else {
		g.append('path').data(geo.coordinates)
		 .attr('d',d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
	} 
}

function diffColor(v){ 
	var sc = 1.5
	if(v>0)return d3.hsl(150,.7,v*.4*sc+.1)+''
	else return d3.hsl(30,.7,-v*.4*sc+.1)+''
}

function drawCounty(){
	county.features.forEach((e,i,a)=>{
		var g = svg.append('g')
		           .attr('id','county' + e.properties.COUNTYCODE)
		           .attr('class','county')
		drawMap(g,e.geometry)
	})
	d3.select('#county09007').attr('transform','translate(100,320)')
	d3.select('#county09020').attr('transform','translate(400,0)')
	d3.select('#county09020').select('path:nth-last-child(1)')
	                         .attr('transform','translate(-250,100)')
	d3.select('#county09020').select('path:nth-last-child(2)')
	                         .attr('transform','translate(-250,100)')
}

function drawTown(){
	town.features.forEach((e,i,a)=>{
		var g = svg.append('g')
		           .attr('id','town' + e.properties.TOWNCODE.slice(0,7))
		           .attr('class','town county' + e.properties.TOWNCODE.slice(0,5))
		drawMap(g,e.geometry)
	})
	d3.selectAll('.county09007').attr('transform','translate(100,320)')
	d3.selectAll('.county09020').attr('transform','translate(400,0)')
	d3.select('#town0902006').attr('transform','translate(150,100)')
}

function drawPie(){
	var svg = d3.select('body').select('#all').append('svg')
		.attr('width', '100%')
		.attr('height', '100%')
		.attr('viewBox', '-50 -50 100 100')
	var arcs = d3.pie().sortValues(null)([0,0,1,0]);
	var pie = svg.append('g').attr('class','pie')
	var path = pie.append('g').attr('class','path')
	var text = pie.append('g').attr('class','text')
	for (i in [0,0,1,0]){
		path.append('path').attr('class',voteType[i])
			.style('fill', colors[i])
		text.append('text').attr('class',voteType[i])
			.style('fill', 'white')
			.style('font-size','8px')
			.attr('text-anchor','middle')
	}
	pie.selectAll('path').data(arcs)
	pie.selectAll('text').data(arcs)
}

function drawVillage(){
	village.features.forEach((e,i,a)=>{
		var g = svg.append('g')
		           .attr('id',e.properties.VILLAGEID + e.properties.VILLAGENAME)
		           .attr('class','village')
		drawMap(g,e.geometry)
	})
}

function changeVoteData(ci){
	if(mode===0){
		result.county.forEach((e,i,a)=>{
			var vote = e.votes[ci]
			var county = d3.select('#county'+e.code).data([vote])
			var total = novotes?vote.totalVoter:(vote.agree+vote.disagree+(invalid?vote.invalid:0))
			var diff = (vote.agree-vote.disagree)/total
			county.selectAll('path').style('fill',diffColor(diff))
		})
	}
	else if(mode===1){
		result.county.forEach((e,i,a)=>{
			e.town.forEach((te,ti,ta)=>{
				var vote = te.votes[ci]
				var town = d3.select('#town'+e.code+te.code).data([vote])
				var total = novotes?vote.totalVoter:(vote.agree+vote.disagree+(invalid?vote.invalid:0))
				var diff = (vote.agree-vote.disagree)/total
				town.selectAll('path').style('fill',diffColor(diff))
			})
		})
	}

	var r = all[ci].result
	var novotenum = 19757067 - r.agree - r.disagree - r.invalid
	var arcs = d3.pie().sortValues(null)(
		[r.agree,r.invalid*(invalid?1:0),novotenum*(novotes?1:0),r.disagree]);
	var arctotal = r.agree+r.invalid*(invalid?1:0)+novotenum*(novotes?1:0)+r.disagree
	var path = d3.select('#all').select('g.pie').selectAll('path')
	var text = d3.select('#all').select('g.pie').selectAll('text')
	path.data(arcs).attr('d',arc)
	text.data(arcs).text(d=>Math.round(d.value*100/arctotal)+'%')
	text.attr('x',d=>arc.centroid(d)[0]).attr('y',d=>arc.centroid(d)[1]+2)
	if(novotes) $a('text.novote' ).forEach((e,i,a)=>{e.classList.toggle('hide',false)})
	else        $a('text.novote' ).forEach((e,i,a)=>{e.classList.toggle('hide',true )})
	if(invalid) $a('text.invalid').forEach((e,i,a)=>{e.classList.toggle('hide',false)})
	else        $a('text.invalid').forEach((e,i,a)=>{e.classList.toggle('hide',true )})
}

$('#novotes').addEventListener('change',function() {
	if(this.checked) {
		novotes = true
		invalid = true
		$('#invalid').checked = true
	}
	else novotes = false
	changeVoteData(casei)
})

$('#invalid').addEventListener('change',function() {
	if(this.checked) invalid = true
	else {
		invalid = false
		novotes = false
		$('#novotes').checked = false
	}
	changeVoteData(casei)
})

$('#casenum').addEventListener('change',function() {
	casei = parseInt(this.value)
	changeVoteData(casei)
})

$('#mode').addEventListener('change',function() {
	mode = parseInt(this.value)
	if (mode===0){
		d3.selectAll('.county').style('display','initial')
		d3.selectAll('.town'  ).style('display','none')
	}
	else if (mode===1) {
		d3.selectAll('.county').style('display','none')
		d3.selectAll('.town'  ).style('display','initial')
	}
	changeVoteData(casei)
})

drawPie()
drawCounty()
drawTown()
//drawVillage()
if (mode===0){
	d3.selectAll('.county').style('display','initial')
	d3.selectAll('.town'  ).style('display','none')
}
else if (mode===1) {
	d3.selectAll('.county').style('display','none')
	d3.selectAll('.town'  ).style('display','initial')
}

changeVoteData(casei)
