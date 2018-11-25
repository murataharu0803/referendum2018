var colors = ['#199B07','#888888','#333333','#AA3027']
var arc = d3.arc()
	.innerRadius(30)
	.outerRadius(50)
	.cornerRadius(1)
	.padAngle(.01)
var voters = 19757067
var results = [
	{'case':  '7', 'result': [7955753,715140,2109157]},
	{'case':  '8', 'result': [7599267,823945,2346316]},
	{'case':  '9', 'result': [7791856,756041,2231425]},
	{'case': '10', 'result': [7658008,459508,2907429]},
	{'case': '11', 'result': [7083379,507101,3419624]},
	{'case': '12', 'result': [6401748,540757,4072471]},
	{'case': '13', 'result': [4763086,505153,5774556]},
	{'case': '14', 'result': [3382286,608484,6949697]},
	{'case': '15', 'result': [3507665,619001,6805171]},
	{'case': '16', 'result': [5895560,922960,4014215]}
]

function draw(i){
	var svg = d3.select('body').select('#box'+i).append('svg')
		.attr('width', '100%')
		.attr('height', '100%')
		.attr('viewBox', '-50 -50 100 100')

	var arcs = d3.pie().sortValues(null)([0,0,1,0]);
	var g = svg.append('g').attr('class','pie')
	for (value in [0,0,0,0]) g.append('path')
	g.selectAll('path')
		.data(arcs)
		.style('fill', function(d,i){
          return colors[i];
        })
		.attr('d',arc)
}

function allVote(arr){
	var data = arr
	var novote = voters - data[0] - data[1] - data[2]
	data.splice(2,0,novote)
	return data
}

function arc2Tween(d, indx) {
	var interp = d3.interpolate(this._current, d)
	// this will return an interpolater
	//  function that returns values
	//  between 'this._current' and 'd'
	//  given an input between 0 and 1

	this._current = d
	// update this._current to match the new value

	return function(t) {
		// returns a function that attrTween calls with
		//  a time input between 0-1; 0 as the start time,
		//  and 1 being the end of the animation

		var tmp = interp(t)
		// use the time to get an interpolated value
		//  (between this._current and d)

		return arc(tmp, indx)
		// pass this new information to the accessor
		//  function to calculate the path points.
		//  make sure sure you return this.

		// n.b. we need to manually pass along the
		//  index to drawArc so since the calculation of
		//  the radii depend on knowing the index. if your
		//  accessor function does not require knowing the
		//  index, you can omit this argument
	}
}

function changeData(i,arr){
	var arcs = d3.pie().sortValues(null)(allVote(arr));
	var path = d3.select('#box'+i).select('g.pie').selectAll('path').data(arcs)
	path.transition().duration(300).attrTween('d',arc2Tween)
}

for (var i=7;i<17;i++) {
	draw(i)
}

for (var i=7;i<17;i++) {
	changeData(i,allVote(results[i-7].result))
}
