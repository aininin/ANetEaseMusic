$(function(){
	let id = parseInt(location.search.match(/\bid=([^$]*)/)[1]);

	$.get('./songs.json').then(function(response){
		// let songs = JSON.parse(response);
		let songs = response;
		let song = songs.filter((s)=>s.id === id)[0];
		let {url,name,singer,coverImg,bgImg,lyric} = song;
		initPlayer(url)
		initText(name,singer,coverImg,bgImg,lyric)
	})
	//初始化播放器
	function initPlayer(url){
		let audio = document.createElement('audio')
		audio.src = url;
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
	}
	//初始化歌曲名，歌手,歌词,封面图片，背景图片
	function initText(name,singer,coverImg,bgImg,lyric){
		$('.song-description>h1').text(name+'-'+singer);
		parseLyric(lyric)
		$('.disc-container .cover').attr('src',coverImg)
		$('.page .bg-img').css('background-image','url('+bgImg+')')
	}
	//解析歌词并显示
	function parseLyric(lyric){
		let array = lyric.split('\n');
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
	}
})