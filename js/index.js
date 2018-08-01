$(function(){
	$.get('./songs.json').then(function(response){
		//response是字符串,github服务器
		let items = JSON.parse(response);
		items.forEach( (i)=> {
			let $li = $(`<li>
							<a href="./song.html?id=${i.id}">
								<h3>${i.name}</h3>
								<p>
									<svg class='icon-sq'>
										<use xlink:href="#icon-sq">
									</svg>
									<span>${i.singer}-${i.special}</span>
								</p>
								<svg class='icon-play-circle'>
									<use xlink:href="#icon-play-circle">
								</svg>
							</a>
						</li>`)
			$('#latestMusic').append($li);
		});
		$('#latestMusicLoading').remove();
	},function(){
		alert('failure');
	})
})

