$(function(){
	$.get('./lyric.json').then(function(object){
		let lyric = JSON.parse(object);
		let array = lyric.lyric.split('\n');
		let regex = /^\[(.+)\](.*)$/;
		array = array.map(function(string,index){
			let matches = string.match(regex);
			if (matches) {
				return {time:matches[1],words:matches[2]}
			}
		})
		let $lyric_div = $('.lyric>.lines');
		array.map(function(object){
			if (!object) {
				return;
			}
			let $p = $('<p>');
			$p.attr('data-time',object.time).text(object.words)
			$p.appendTo($lyric_div);
		})
	})
	let audio = document.createElement('audio')
	audio.src = "https://dl.stream.qqmusic.qq.com/C400002E3MtF0IAMMY.m4a?vkey=393072E3E6BCBE6EED00B39CAD0F75FB9B0D8A5B5124FC2319442F051509F2CED0E49EC494CDD823FAD6141BDC858B32A4404EC5974A6BDF&guid=7085573444&uin=0&fromtag=66";
	audio.oncanplay = function(){
		audio.play()
		$('.disc-container').addClass('playing')
	}
	$('.icon-pause').on('click',function(){
		audio.pause()
		$('.disc-container').removeClass('playing')
	})
	$('.icon-play').on('click',function(){
		audio.play()
		$('.disc-container').addClass('playing')
	})
})