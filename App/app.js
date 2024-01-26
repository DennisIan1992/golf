var myNinjaApp = angular.module('myNinjaApp', ['ngRoute']);

myNinjaApp.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'NinjaController'})
        .when('/teams', {
                templateUrl: 'views/teams.html',
                controller: 'NinjaController'})
        .when('/tournaments', {
            templateUrl: 'views/tournaments.html',
            controller: 'NinjaController'})
        .when('/standings', {
            templateUrl: 'views/standings.html',
            controller: 'NinjaController'})
        .when('/leaderboard', {
                templateUrl: 'views/leaderboard.html',
                controller: 'NinjaController'})
        .otherwise({
            redirectTo: '/home'
        });

}]);

myNinjaApp.controller('NinjaController', ['$scope', '$http', '$filter', function($scope,$http,$filter){

    $http.get('https://api.sportsdata.io/golf/v2/json/News?key=999ba6c7697c4988bfbec5370d8f3dee').then(function(response){
        $scope.news = response.data;        
        });


    $http.get('data/owners.json').then(function(response){
        $scope.owners = response.data;
        });

    $http.get('data/teams.json').then(function(response){
        $scope.teams = response.data;

        $http.delete('http://localhost:3000/teams').then(function(response){

        });

        $scope.objTeams = [{owner: null,
            gone: null,
            gtwo: null,
            gthree: null,
            gfour: null,
            gfive: null,
            gsix: null,
            gseven: null,
            geight: null,
            week: null
        }];

        angular.forEach($scope.teams, function(feTeam) {
            console.log("In ForEach")
            //console.log(lc);
            
            var vOwner = feTeam.owner;
            var v1 = feTeam.gone;
            var v2 = feTeam.gtwo;
            var v3 = feTeam.gthree;
            var v4 = feTeam.gfour;
            var v5 = feTeam.gfive;
            var v6 = feTeam.gsix;
            var v7 = feTeam.gseven;
            var v8 = feTeam.geight;
            var vWeek = feTeam.week;



            var objTeam = {
                owner: vOwner,
                gone: v1,
                gtwo: v2,
                gthree: v3,
                gfour: v4,
                gfive: v5,
                gsix: v6,
                gseven: v7,
                geight: v8,
                week: vWeek}
                //console.log(objGolfer);
            $scope.objTeams.push(objTeam);

            
            //console.log('Team: ' + objTeam.owner + ' - ' + objTeam.gone + ' - ' + objTeam.gtwo + ' - ' + objTeam.gthree + ' - ' + objTeam.gfour + ' - ' + objTeam.gfive + ' - ' + objTeam.gsix + ' - ' + objTeam.gseven + ' - ' + objTeam.geight + ' - ' + objTeam.week);
            
            $http.post('http://localhost:3000/teams', JSON.stringify(objTeam))
            .then(function(response){
                console.log('Post team response: ' + response);
            });
            
        
        });
        
    $scope.objTeams.splice(0,1);
    });


    $http.get('https://api.sportsdata.io/golf/v2/json/Tournaments?key=999ba6c7697c4988bfbec5370d8f3dee').then(function(response){
        $scope.tournaments = response.data;        
        });

        

//var LeaderboardApiURL = 'https://api.sportsdata.io/golf/v2/json/Leaderboard/' + '584' + '?key=999ba6c7697c4988bfbec5370d8f3dee';
var LeaderboardApiURL = 'https://site.api.espn.com/apis/site/v2/sports/golf/leaderboard';
//console.log(LeaderboardApiURL);

$http.get(LeaderboardApiURL).then(function(response){
    $scope.lb = response.data;
    console.log($scope.lb);
});

    $http.delete('http://localhost:3000/golf').then(function(response){

    });

        $http.get(LeaderboardApiURL).then(function(response){
            $scope.leaderboardCompetitors = response.data.events[0].competitions[0].competitors; 
            $scope.lc = [{name: null, 
                            position:null,
                            rank: 0,
                            thru:null,
                            r1: null,
                            r2: null,
                            r3: null,
                            r4: null,
                            total:null
                        }];
              
                //console.log($scope.leaderboardCompetitors);     
                angular.forEach($scope.leaderboardCompetitors, function(feLc) {
                    console.log("In ForEach")
                    //console.log(lc);
                    
                    var vName = feLc.athlete.displayName;
                    var vId = feLc.athlete.id;
                    var vPosition = feLc.status.position.displayName;
                    var vRank = parseInt(feLc.status.position.id);
                    var vThru = feLc.status.thru;
                    var vR1 = null;
                    var vR2 = null;
                    var vR3 = "-";
                    var vR4 = "-";
                    var vTotal = feLc.statistics[0].displayValue;
                    var liveScoreSum = 0;
                    
                    

                    if(feLc.status.period == '1')
                    {
                        if(feLc.status.type.state == 'pre'){
                            vR1 = $filter('date')(feLc.linescores[0].teeTime, 'hh.mm a');
                        }
                        if(vThru < 18 && vThru > 0){
                            //vTotal = feLc.linescores[0].displayValue;
                            vR1 = feLc.linescores[0].displayValue;
                        }
                        if(vThru == 18){
                            //vTotal = feLc.score.displayValue;                                                     
                            vR1 = feLc.linescores[0].displayValue;
                        }                        
                        vR2 = $filter('date')(feLc.linescores[1].teeTime, 'hh.mm a');    
                        
                    }
                    if(feLc.status.period == '2')
                    {                        
                        //console.log('Perios 2')
                        if (feLc.linescores[1].displayValue == 'E'){
                            liveScoreSum = 0;
                        }
                        if (feLc.linescores[1].displayValue != 'E'){
                            liveScoreSum = parseInt(feLc.linescores[1].displayValue)
                        }

                        if(vThru == 0){
                            
                        //console.log('Not Started')
                            //vTotal = feLc.score.displayValue;
                            vR2 = $filter('date')(feLc.linescores[1].teeTime, 'hh.mm a');                            
                            vR1 = feLc.linescores[0].displayValue;
                        }
                        if(vThru < 18 && vThru > 0){
                            //console.log('Started/ Thru: ' + vThru)
                            //vTotal = parseInt(feLc.linescores[0].displayValue) + liveScoreSum;
                            vR2 = feLc.linescores[1].displayValue;                            
                            vR1 = feLc.linescores[0].displayValue;
                        }
                        if(vThru == 18){
                            //console.log('Complete')
                            //vTotal = feLc.score.displayValue;
                            vR2 = feLc.linescores[1].displayValue;                            
                            vR1 = feLc.linescores[0].displayValue;
                        }                        
                    }
                    if(feLc.status.period == '3')
                    {       
                        //console.log('Perios 3')  
                        if (feLc.linescores[2].displayValue == 'E'){
                            liveScoreSum = 0;
                        }
                        if (feLc.linescores[2].displayValue != 'E'){
                            liveScoreSum = parseInt(feLc.linescores[2].displayValue)
                        }

                        if(vThru == 0){
                            //vTotal = feLc.score.displayValue;
                            vR3 = $filter('date')(feLc.linescores[2].teeTime, 'hh.mm a'); 
                            vR2 = feLc.linescores[1].displayValue;
                            vR1 = feLc.linescores[0].displayValue;
                        }
                        if(vThru < 18 && vThru > 0){
                            //vTotal = parseInt(feLc.score.displayValue) + liveScoreSum;
                            vR3 = feLc.linescores[2].displayValue;
                            vR2 = feLc.linescores[1].displayValue;                            
                            vR1 = feLc.linescores[0].displayValue;
                        }
                        if(vThru == 18){
                            //vTotal = feLc.score.displayValue;
                            vR2 = feLc.linescores[2].displayValue;
                            vR2 = feLc.linescores[1].displayValue;                            
                            vR1 = feLc.linescores[0].displayValue;
                        }
                    }
                    if(feLc.status.period == '4')
                    {     
                        //console.log('Perios 4')    

                        if (feLc.linescores[3].displayValue == 'E'){
                            liveScoreSum = 0;
                        }
                        if (feLc.linescores[3].displayValue != 'E'){
                            liveScoreSum = parseInt(feLc.linescores[3].displayValue)
                        }

                        if(vThru == 0){
                            //vTotal = feLc.score.displayValue;
                            vR4 = $filter('date')(feLc.linescores[3].teeTime, 'hh.mm a'); 
                            vR3 = feLc.linescores[2].displayValue;
                            vR2 = feLc.linescores[1].displayValue;
                            vR1 = feLc.linescores[0].displayValue;
                        }
                        if(vThru < 18 && vThru > 0){
                            //vTotal = parseInt(feLc.score.displayValue) + liveScoreSum;
                            vR4 = feLc.linescores[3].displayValue;
                            vR3 = feLc.linescores[2].displayValue;
                            vR2 = feLc.linescores[1].displayValue;                            
                            vR1 = feLc.linescores[0].displayValue;
                        }
                        if(vThru == 18){
                            //vTotal = feLc.score.displayValue;
                            vR4 = feLc.linescores[3].displayValue;
                            vR3 = feLc.linescores[2].displayValue;
                            vR2 = feLc.linescores[1].displayValue;                            
                            vR1 = feLc.linescores[0].displayValue;
                        }
                    }


                    var objGolfer = {
                        name: vName,
                        id: vId,
                        position: vPosition,
                        rank: vRank,
                        thru: vThru,
                        roundOne: vR1,
                        roundTwo: vR2,
                        roundThree: vR3,
                        roundFour: vR4,
                        total:vTotal}
                        //console.log(objGolfer);
                    $scope.lc.push(objGolfer);

                    /*
                    console.log('Start json write')
                    var json = JSON.stringify(objGolfer);

                    var fs = require('fs');
                    fs.writeFile('data/leaderboard.json', json, 'utf8', callback);
                    
                     var headers = new Headers({
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    });
                    this.http.post(this.oauthUrl, JSON.stringify(postData), {
                        headers: headers
                    })*/

                    var headers = new Headers({
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    });
                    

                    $http.get('http://localhost:3000/golf', {headers: headers})
                    .then(function(response){
                        $scope.getGolfersAPI = response.data;
                        console.log(response.data);
                    });

                    
                    
                    


                    try{
                    $http.post('http://localhost:3000/golf', JSON.stringify(objGolfer))
                    .then(function(response){
                        console.log(response);
                    });
                } catch (error){
                    console.log(error.message);
                }

                    

                });
                
                $scope.lc.splice(0,1);
                //console.log($scope.lc);

                /*$http.post('data/leaderboard.json', JSON.stringify($scope.lc))
                    .then(function(response){
                        console.log(response)
                    });*/
            });

//console.log($scope.leaderboardCompetitors);//"Start ForEach");

            

            //console.log($scope.leaderboardJson);
            //console.log($scope.owners);

        var dateSOY = new Date();
        dateSOY = Date.parse('01/17/2024');
        var dateEOY = new Date();
        dateEOY = Date.parse('08/31/2024');
        var dateComp = new Date();
        var b = new Boolean();     

        $scope.greaterThan = function(prop){
            return function(tournaments){
                b= false;
                //console.log(dateSOY);
                dateComp = Date.parse(tournaments[prop]);
                //console.log(dateComp);
              if (dateComp > dateSOY) {
                if (dateComp < dateEOY) {
                 b =  true;    
                }
            }

            //console.log(b);
            return b;
            }}

        
}]);