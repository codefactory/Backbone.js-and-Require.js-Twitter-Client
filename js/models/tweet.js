define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	
	/*
	 * tweet model
	 * collection에 들어가는 model 데이터가 서버에서 불려오는 것이라 여기에서는 특별히 하는 일 없음
	 */
	var Tweet = Backbone.Model.extend({
		
		initialize: function () {
			
		}
		
	});
	
	return Tweet;
	
});
