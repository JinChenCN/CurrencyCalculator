myApp.factory('myFactory', ['$http','$q',function($http,$q) {
	return {
	  getData: function(newSourceCurrency,newTargetCurrency) {
		var deferred = $q.defer();
		$http.get('https://api.ofx.com/PublicSite.ApiService/SpotRateHistory/week/'+newSourceCurrency+'/'+newTargetCurrency+'?DecimalPlaces=6&ReportingInterval=daily')
	      .success(function(data, status, headers, config) {
	        deferred.resolve(data);
	      })
	      .error(function(data, status, headers, config) {
	        deferred.reject(status);
	      });
		return deferred.promise;
	  }
	}
}])