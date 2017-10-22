myApp.controller('myCtrl', ['$scope','$http','$filter','myFactory', function($scope,$http,$filter,myFactory) {  
	
    $scope.records = [];
    
	// Initial currency list
	$scope.currencies = ["NZD","USD","EUR","CNY","JPY"];
	
	// Reset new data
    $scope.reset = function() {
      $scope.newSourceCurrency = $scope.currencies[0];
      $scope.newTargetCurrency = $scope.currencies[1];
      $scope.newInputAmount = 0;
      $scope.newCurrencyRate = 0;
      $scope.newOutputAmount = 0;
      $scope.historicalSourceCurrency = null;
      $scope.historicalTargetCurrency = null;
      $scope.labels = null;
      $scope.data = null;
    }
    
    $scope.reset();
    
    // Get historical data
    $scope.getHistoricalData = function() {  
      if ($scope.newSourceCurrency == $scope.newTargetCurrency)
        return;
      myFactory.getData($scope.newSourceCurrency,$scope.newTargetCurrency).then(function(data) {
        $scope.newCurrencyRate = data.CurrentInterbankRate;
	    $scope.historicalSourceCurrency = $scope.newSourceCurrency;
        $scope.historicalTargetCurrency = $scope.newTargetCurrency;
	    var dates = new Array();
        var rates = new Array();
        angular.forEach(data.HistoricalPoints, function(data) {
    	  dates.push($filter('date')(new Date(data.PointInTime),'yyyy-MM-dd'));
    	  rates.push(data.InterbankRate);
        });
        $scope.labels = dates;
        $scope.data = new Array();
        $scope.data.push(rates);
      }, function(status) {
        console.log(status);
      });
    }
    
    // Add new data
    $scope.calculate = function() {
	  if (!$scope.newInputAmount)
		return;
      if ($scope.newSourceCurrency == $scope.newTargetCurrency)
        return;
      myFactory.getData($scope.newSourceCurrency,$scope.newTargetCurrency).then(function(data) {
        if (data.CurrentInterbankRate != null && angular.isNumber(data.CurrentInterbankRate)) {
  		  $scope.newCurrencyRate = data.CurrentInterbankRate;
  		  $scope.newOutputAmount = $scope.newCurrencyRate*$scope.newInputAmount;
  		  $scope.records.push({
  			sourceCurrency: $scope.newSourceCurrency,
          	targetCurrency: $scope.newTargetCurrency,
          	inputAmount: $scope.newInputAmount,
          	currencyRate: $scope.newCurrencyRate,
          	outputAmount: $scope.newOutputAmount,
      	  });
        }  
      });
    }
}]);