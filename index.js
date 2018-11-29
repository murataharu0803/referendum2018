var voteType = ['agree','invalid','novote','disagree']
var colors = ['#199B07','#888888','#333333','#AA3027']
var arc = d3.arc()
	.innerRadius(30)
	.outerRadius(50)
	.cornerRadius(1)
	.padAngle(.01)
var voters = 19757067
var results = [
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
var novotes = false
var invalid = true

function draw(i){
	var svg = d3.select('body').select('#box'+i).append('svg')
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

function allVote(arr){
	var data = arr.slice()
	var novote = voters - data[0] - data[1] - data[2]
	data.splice(2,0,novote)
	return data
}

function changeVoteData(i){
	var r = results[i-7].result
	var novotenum = voters - r.agree - r.disagree - r.invalid
	var arcs = d3.pie().sortValues(null)(
		[r.agree,r.invalid*(invalid?1:0),novotenum*(novotes?1:0),r.disagree]);
	var arctotal = r.agree+r.invalid*(invalid?1:0)+novotenum*(novotes?1:0)+r.disagree
	var path = d3.select('#box'+i).select('g.pie').selectAll('path')
	var text = d3.select('#box'+i).select('g.pie').selectAll('text')
	path.data(arcs).attr('d',arc)
	text.data(arcs).text(d=>Math.round(d.value*100/arctotal)+'%')
	text.attr('x',d=>arc.centroid(d)[0]).attr('y',d=>arc.centroid(d)[1]+2)
	if(novotes) $a('text.novote' ).forEach((e,i,a)=>{e.classList.toggle('hide',false)})
	else        $a('text.novote' ).forEach((e,i,a)=>{e.classList.toggle('hide',true )})
	if(invalid) $a('text.invalid').forEach((e,i,a)=>{e.classList.toggle('hide',false)})
	else        $a('text.invalid').forEach((e,i,a)=>{e.classList.toggle('hide',true )})
}

for (var i=7;i<17;i++) {
	draw(i)
}

function update(){
	for (var i=7;i<17;i++) {
		changeVoteData(i)
	}
}

$('#novotes').addEventListener('change',function() {
	if(this.checked) {
		novotes = true
		invalid = true
		$('#invalid').checked = true
	}
	else novotes = false
	update()
})

$('#invalid').addEventListener('change',function() {
	if(this.checked) invalid = true
	else {
		invalid = false
		novotes = false
		$('#novotes').checked = false
	}
	update()
})

setTimeout(update,0)