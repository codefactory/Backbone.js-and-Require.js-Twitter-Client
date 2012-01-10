define([
	'jquery',
	'underscore',
	'backbone',
	'collections/tweets',
	'views/tweets'
], function ($, _, Backbone, TweetCollection, TweetsView) {
	
	var AppRouter = Backbone.Router.extend({
		
		// homeTimeline, search 두 가지 mode 있음. 초기는 homeTimeline으로 설정
		mode: 'homeTimeline',
		
		// collection fetch할 때 사용하는 options
		fetchOptions: {
			data: {
				q: '',
				rpp: 20,
				page: 1
			}
		},
		
		routes: {
			'!/:screen_name': 'homeTimeline',	// 홈 타임라인
			'!/search/:query': 'search',		// 검색
			'*other': 'defaultRoute',
		},
		
		// collection fetch할 때 사용하는 url들
		urls: {
			homeTimeline: 'API/api.php?mode=home_timeline',
			search: 'API/api.php?mode=search'
		},
		
		// 로그인 된 경우 홈 타임라인으로 이동
		defaultRoute: function () {
			if (sessionStorage.user_id && sessionStorage.screen_name) {
				location.hash = '!/' + sessionStorage.screen_name;
			}
		},
		
		// 홈 타임라인 보기
		homeTimeline: function (screen_name) {
			
			if (sessionStorage.user_id && sessionStorage.screen_name) {		// 로그인 된경우
				
				$('#search_txt').val('');
				
				/*
				 * mode, fetchOptions를 설정하고 loadTweet 호출
				 */
				this.mode = 'homeTimeline';
				
				this.fetchOptions.data.page = 1;	// 최초 호출이므로 page는 1, window scroll에 의해서 호출 될 때에는 page 값이 변함
				this.loadTweets(1, this.mode);
				
			} else {	// 로그인 안한 경우
				location = './';
			}
			
		},
		
		// 검색
		search: function (query) {
			
			$('#search_txt').val(query);
			
			/*
			 * mode, fetchOptions를 설정하고 loadTweet 호출
			 */
			this.mode = 'search';
			
			this.fetchOptions.data.page = 1;	// 최초 호출이므로 page는 1, window scroll에 의해서 호출 될 때에는 page 값이 변함
			this.fetchOptions.data.q = query;
			
			this.loadTweets(1, this.mode);
		},
		
		// 트윗 목록 불러오기
		loadTweets: function (page, mode) {
			if (page === 1) {
				$('#result').empty();
			}
			
			// collection, view 만들기
			var tweets = new TweetCollection(),
				tweetsView = new TweetsView({model: tweets});
			
			tweets.url = this.urls[mode];
			
			// fetch: 서버에서 데이터를 받아와서 collection을 만듬
			// fetchOptions에 success 콜백을 넣고 데이터가 받아지면 tweetsView.render()로 화면에 트윗 목록을 출력해도 되나
			// tweets collection에 reset 이벤트(데이터 변경)가 발생하면 render 메서드가 호출되도록 등록해 놓는 방식으로 처리했음
			tweets.fetch(this.fetchOptions);
		}
		
	});
	
	return AppRouter;
	
});
