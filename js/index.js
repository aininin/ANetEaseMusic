$(function(){
	setTimeout(function(){
		$.get('./songs.json').then(function(response){
			//response是字符串,github服务器
			//let items = JSON.parse(response);
			let items = response;
			items.forEach( (i)=> {
				//动态添加li元素
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
	},1000);
	/*
		点击导航 tab 进行切换
	*/
	$('.siteNav').on('click','ol.tabItems>li',function (e) {
		let $li = $(e.currentTarget);
		$li.addClass('active').siblings().removeClass('active');
		let index = $li.index();
		$li.trigger('tabChange',index); //随着tab切换触发内容切换
		$('.tabContent > li').eq(index).addClass('active').siblings().removeClass('active');
	})

	/*
		tab切换后，相应的内容也进行切换
	*/
	$('.siteNav').on('tabChange',function(e,index){
		//找到对应的li
		let $li = $('.tabContent > li').eq(index); 
		//如果已经下载过则显示，没有则请求JSON内容
		if ($li.attr('data-downloaded') === 'yes') {
			return;
		}
		if (index === 1) {
			$.get('./hotMusic.json').then(function(response){
				console.log(response);
				//没有则加载JSON内容,并设置属性表示已下载过
				$li.attr('data-downloaded','yes');
				$('#tab2Loading').remove();
			})
		}else if (index === 2) {
			$.get('./searchMusic.json').then(function(response){
				console.log(response);
				//没有则加载JSON内容,并设置属性表示已下载过
				$li.attr('data-downloaded','yes');
				$('#tab3Loading').remove();
			})
		}
	})
	/*
		监听input输入事件，每次输入完等一段时间如果不继续输入则查询
		如果继续输入，则重新等待
	*/
	let timer = undefined;
	$('input#searchSong').on('input',function(e){
		let $input = $(e.currentTarget); //得到input属性
		let value = $input.val().trim(); //得到input值
		if (value === '') {return;}
		//如果之前已经设置了timer，则销毁
		if (timer) {
			clearTimeout(timer);
		}
		//并重新设置一个timer
		timer = setTimeout(function(){
			search(value).then((result)=>{
				//如果查询执行成功，销毁timer
				timer = undefined;
				if (result.length != 0) {
					$('.tab3 #searchResult').text(result.map((r)=>r.name).join(','));
				}else {
					$('.tab3 #searchResult').text('no result!');
				}
			});
		}, 300)
		
	})
	/*
		根据关键词进行搜索
	*/
	function search(keyword){
		return new Promise((resolve,reject)=>{
			var database = [
				{"id":1,"name":"光年之外（电影《太空旅客》中文主题曲）"},
				{"id":2,"name":"Darkside"},
				{"id":3,"name":"最好"},
				{"id":4,"name":"孤独她呀"},
				{"id":5,"name":"你要的全拿走"},
				{"id":6,"name":"烟火里的尘埃"},
				{"id":7,"name":"心事"},
				{"id":8,"name":"浪人琵琶"},
				{"id":9,"name":"一（电视剧《媚者无疆》人物主题曲）"},
				{"id":10,"name":"Unicorn"}
				];
			let result = database.filter(function(item){
				return item.name.indexOf(keyword)>=0;
			})
			setTimeout(function(){
				resolve(result)
			},(Math.random()*1000 + 500))
		})
	}
	window.search = search
})

