define([
	'underscore',
	'backbone',
	'models/tweet',
	'views/tweet'
], function (_, Backbone, TweetModel, TweetView) {
	
	/*
	 * tweet collection
	 * collection에 들어가는 model 데이터가 서버에서 불려오는 것이라 여기에서는 model 설정 외에는 특별히 하는 일 없음
	 */
	var Tweets = Backbone.Collection.extend({
		
		model: TweetModel,
		
		initialize: function () {
			
		}
		
	});
	
	return Tweets;
	
});
