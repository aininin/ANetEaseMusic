$(function(){
	let id = parseInt(location.search.match(/\bid=([^$]*)/)[1]);

	$.get('./songs.json').then(function(response){
		let songs = JSON.parse(response);
		//let songs = response;
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
		//当前歌词显示
		setInterval(function(){
			let seconds = audio.currentTime; //当前歌词秒数
			let minutes = ~~(seconds / 60); //当前歌词分钟，两次取反可以对分钟数取整
			let left = seconds -minutes*60; //剩下的时间
			let time = `${pad(minutes)}:${pad(left)}`; //让当前歌词时间格式与JSON里一样
			let $lines = $('.lines > p'); //获取html中歌词列表
			let $whichLine; //当前显示哪一行
			for(let i=0; i<$lines.length; i++){
				//如果歌词列表有下一行，当前行时间小于当前播放时间，下一行时间大于当前播放时间
				if ($lines.eq(i+1).length !=0 && $lines.eq(i).attr('data-time')<time && $lines.eq(i+1).attr('data-time')>time) {
					$whichLine = $lines.eq(i);
					break;
				}
			}
			if($whichLine){
				$whichLine.addClass('active').prev().removeClass('active');
				let top = $whichLine.offset().top;
				let linesTop = $('.lines').offset().top;
				let linesHeight = $('.lyric').height()/3;
				let delta = top - linesTop - linesHeight;
				$('.lines').css('transform',`translateY(-${delta}px)`);
			}
		},500);
	}
	//给播放到哪一秒补0
	function pad(number){
		return number >= 10? number+'' : '0'+number;
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