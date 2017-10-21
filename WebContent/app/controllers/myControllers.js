myApp.controller('myCtrl', ['$scope','$http','$filter','myFactory',function ($scope,$http,$filter,myFactory) {  
	
    $scope.records = [];
    
	// Initial currency list
	$scope.currencies = ["NZD","USD","EUR","CNY","JPY"];
	
	// Reset new data
    $scope.reset = function () {
      $scope.newSourceCurrency = $scope.currencies[0];
      $scope.newTargetCurrency = $scope.currencies[1];
      $scope.newInputAmount = 0;
      $scope.newCurrencyRate = 0;
      $scope.newOutputAmount = 0;
      $scope.newHistoricalData = null;
    }
    
    $scope.reset();
    
    // Check historical data
    $scope.check = function (index) {
      myFactory.setAge(20);	
      console.log(myFactory.getAge());
    	
      var historicalData = $scope.records[index].historicalData;
      $scope.historicalSourceCurrency = $scope.records[index].sourceCurrency;
      $scope.historicalTargetCurrency = $scope.records[index].targetCurrency;
      var dates = new Array();
      var rates = new Array();
      angular.forEach(historicalData, function(data){
    	dates.push($filter('date')(new Date(data.PointInTime),'yyyy-MM-dd'));
    	rates.push(data.InterbankRate);
      });
      $scope.labels = dates;
      $scope.data = new Array();
      $scope.data.push(rates);
    };
    
    // Add new data
    $scope.calculate = function () {
    	if (!$scope.newInputAmount)
          return;
        if ($scope.newSourceCurrency == $scope.newTargetCurrency)
          return;
        $http.get('https://api.ofx.com/PublicSite.ApiService/SpotRateHistory/week/'+$scope.newSourceCurrency+'/'+$scope.newTargetCurrency+'?DecimalPlaces=6&ReportingInterval=daily')
		  .then(function(res) {
		    if (res.data.CurrentInterbankRate!=null && angular.isNumber(res.data.CurrentInterbankRate)) {
			  $scope.newCurrencyRate = res.data.CurrentInterbankRate;
			  $scope.newOutputAmount = $scope.newCurrencyRate*$scope.newInputAmount;
			  $scope.newHistoricalData = res.data.HistoricalPoints;
			  $scope.records.push({
			    sourceCurrency: $scope.newSourceCurrency,
        	    targetCurrency: $scope.newTargetCurrency,
        	    inputAmount: $scope.newInputAmount,
        	    currencyRate: $scope.newCurrencyRate,
        	    outputAmount: $scope.newOutputAmount,
        	    historicalData: $scope.newHistoricalData
    		  });
			}
		  });
    }
}]);