angular.module('theta.controllers',[])

.controller('HomeCtrl', function($scope,$state,$rootScope,$http) {
	$scope.veg = false;
	$scope.budget = 1000;
	$scope.rest="any";
	$scope.starter=true;
	$scope.main=true;
	$scope.dessert=true;
	$scope.people=2;

	hotel_url = "http://theta-appl.azurewebsites.net/get_all_hotels/?format=json";
	$http.get(hotel_url)
    .then(function(response) {$scope.hotels = response.data; });

	$scope.showMe = function(rest,budget,people,starter,main,dessert,veg) {
		// alert(rest);
		/*$rootScope.sugs = {
			"suggestions" : [
				{
					"id" : 1,
					"hotel" : "A",
					"cost" : 200,
					"dishes" : [["abc","cdf"],["sg","sdgs"]],
					"thumb" : "img/cover.jpg",
					"rating": 9.5
				},
				{
					"id" : 2,
					"hotel" : "B",
					"cost" : 400,
					"dishes" : [["dd","ref"],["ur","jh"]],
					"thumb" : "img/cover.jpg",
					"rating": 10
				}
			]
		}*/


		
		sug_url = "http://theta-appl.azurewebsites.net/get_suggestions/";
		option = 0;
		if(starter) option += 1;
		if(main) option += 2;
		if(dessert) option += 4;

		// console.log(rest);
		
		sug_url += rest + "/";
		sug_url +=  budget+"/"+people+"/";

		if(option != 0) {
			sug_url +=  +option+"/";
		}

		sug_url += veg +"/?format=json";

		$rootScope.sugs = [
			{
				id:0,
				hotel: "Loading...",
				dishes: ["Please be patient.."],
				rating: 15,
				cost: 0,
				thumb: "img/load.gif"
			}
		];

		$http.get(sug_url)
		    .then(function(response) {$rootScope.sugs = response.data});

		$state.go('suglist');
	}
})

.controller('SugListCtrl', function($scope,$state,$rootScope) {
	$scope.showDetail = function(id) {
		$state.go('sugdetail',{"sugId":id});
	}
})

.controller('SugDetailCtrl', function($scope,$stateParams,$rootScope,$filter) {
	// alert($stateParams.sugId)
	// $scope.dish = $filter('filter')($rootScope.sugs,{id:$stateParams.sugId})
	// alert($filter('filter')([1,2,3,4,5]),{$:4})
	for(i in $rootScope.sugs) {
		if($rootScope.sugs[i].id == $stateParams.sugId)
			$scope.dish = $rootScope.sugs[i];
	}

	$scope.items = new Array();
	$scope.items_index = new Array();

	for(i in $scope.dish.dishes) {
		$scope.items[i] = $scope.dish.dishes[i][0];
		$scope.items_index[i] = 0;
	}

/*	collection = function() {
		array = new Array();
		index = 0;
		add : function(item) {array[array.length] = item;}
		getLeft: function() { 
			if( index == 0)
				index = array.length;
			return array[--index];
		};
		getRight: function() { 
			if( index == array.length-1)
				index = 0;
			return array[index++];
		}
	};*/
/*
	for(i in $scope.dish.dishes) {
		collection.add()	
	}*/


	$scope.moveLeft = function(ind) {
		if($scope.items_index[ind] == 0) {
			$scope.items_index[ind] = $scope.items[ind].length-1;
		} else {
			$scope.items_index[ind]--;
		}
		i = $scope.items_index[ind];

		$scope.items[ind] = $scope.dish.dishes[ind][i];
	}

	$scope.moveRight = function(ind) {
		if($scope.items_index[ind]+2 == $scope.items[ind].length) {
			$scope.items_index[ind] = 0;
		} else {
			$scope.items_index[ind]++;
		}
		i = $scope.items_index[ind];
		$scope.items[ind] = $scope.dish.dishes[ind][i];
	}
	// console.log($scope.dish)

});