angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('FileCtrl', function($scope, $cordovaFile, $q) {
  $scope.syncData = function() {
    document.addEventListener('deviceready', function () {
      // Check in the local storage if MCAS_APP_LOCKED is not defined
      var UHI_MCAS_APP_LOCKED = localStorage.getItem('UHI_MCAS_APP_LOCKED');
      var womenData = JSON.parse(localStorage.getItem('UHI_MCAS'));
      if (UHI_MCAS_APP_LOCKED === null) {
        UHI_MCAS_APP_LOCKED = 'false';
        localStorage.setItem('UHI_MCAS_APP_LOCKED', UHI_MCAS_APP_LOCKED);
        // Check if the out folder exists. If not create the out folder.
        // CREATE
        $cordovaFile.createDir(cordova.file.externalDataDirectory, "out", false);
        // Write the file with the local storage data
        var CSVfiles = jsonToCSVConvertor(womenData); 
        $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/woman.csv", CSVfiles.woman, true)
          .then (function (success) {
            $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/woman_fp.csv", CSVfiles.fp, true)
              .then (function (success) {
                $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/woman_anc_visits.csv", CSVfiles.fp, true)
                  .then (function (success) {
                    UHI_MCAS_APP_LOCKED = 'true';
                    localStorage.setItem('UHI_MCAS_APP_LOCKED', UHI_MCAS_APP_LOCKED);
                    alert("File written with localstorage data in the csv files in the out directory");
                  }, function (error) { // woman_fp.csv file was not created
                    alert("Woman_anc_visits.csv file was not written. There was an error " + error);
                  });
              }, function (error) { // woman_fp.csv file was not created
                alert("Woman_fp.csv file was not written. There was an error " + error);
              });
          }, function (error) { // woman.csv file was not created
            alert("Woman.csv file was not written. There was an error " + error);
          });
      } else  { // UHI_MCAS_APP_LOCKED is defined
        if (UHI_MCAS_APP_LOCKED === 'false') { // UHI_MCAS_APP_LOCKED is false
          // Check if the out folder exists. If not create the out folder.
          // CREATE
          $cordovaFile.createDir(cordova.file.externalDataDirectory, "out", false);
          // Write the file with the local storage data
          var CSVfiles = jsonToCSVConvertor(womenData); 
          $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/woman.csv", CSVfiles.woman, true)
            .then (function (success) {
              $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/woman_fp.csv", CSVfiles.fp, true)
                .then (function (success) {
                  $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/woman_anc_visits.csv", CSVfiles.fp, true)
                    .then (function (success) {
                      UHI_MCAS_APP_LOCKED = 'true';
                      localStorage.setItem('UHI_MCAS_APP_LOCKED', UHI_MCAS_APP_LOCKED);
                      alert("File written with localstorage data in the csv files in the out directory");
                    }, function (error) { // woman_fp.csv file was not created
                      alert("Woman_anc_visits.csv file was not written. There was an error " + error);
                    });
                }, function (error) { // woman_fp.csv file was not created
                  alert("Woman_fp.csv file was not written. There was an error " + error);
                });
            }, function (error) { // woman.csv file was not created
              alert("Woman.csv file was not written. There was an error " + error);
            });
        } else { 
          if (UHI_MCAS_APP_LOCKED === 'true') { // UHI_MCAS_APP_LOCKED is true
            // Check if the the in folder exists, if not, then create otherwise check for the file
            $cordovaFile.createDir(cordova.file.externalDataDirectory, "in", false)
              .then(function (success) {
                // success
              }, function (error) {
                // error
                // Read the woman.csv, womanAnc.csv, womanfp.csv and assign it to the local variable
                try {
                  var womanCSVpromise = readCSVFile($cordovaFile, $q, "in/woman.csv");
                  var womanAncCSVpromise = readCSVFile($cordovaFile, $q, "in/woman_anc_visits.csv");
                  var womanFpCSVpromise = readCSVFile($cordovaFile, $q, "in/woman_fp.csv");

                  var womanAllpromise = $q.all([womanCSVpromise, womanAncCSVpromise, womanFpCSVpromise]);
                  womanAllpromise.then(function(success){
                    var womanCSV = success[0];
                    var womanAncCSV = success[1];
                    var womanFpCSV = success[2];

                    // Convert CSV to JSON
                    womenData = csvToJsonConvertor(womanCSV, womanAncCSV, womanFpCSV);
                    if (womenData) {
                      // Set the local storage with the latest data from the file
                      localStorage.setItem('UHI_MCAS', womenData);
                    } 
                    
                    // delete all the files from the in folder
                    $cordovaFile.removeFile(cordova.file.externalDataDirectory, "in/woman.csv");
                    $cordovaFile.removeFile(cordova.file.externalDataDirectory, "in/woman_anc_visits.csv");
                    $cordovaFile.removeFile(cordova.file.externalDataDirectory, "in/woman_fp.csv");
                    // set MCAS_APP_LOCKED to false
                    UHI_MCAS_APP_LOCKED = 'false';
                    localStorage.setItem('UHI_MCAS_APP_LOCKED', UHI_MCAS_APP_LOCKED);
                    alert("Sync completed successfully. You can disconnect now");
                  }, function(error) {
                    alert(JSON.stringify(error));
                  });
                }
                catch (e) {
                  alert(e);
                }
              });
          }
        }
      }
    });
  };
});

function readCSVFile($cordovaFile, $q, fileName) {

  var deferred = $q.defer();
  var promise = $cordovaFile.checkFile(cordova.file.externalDataDirectory, fileName);
  promise.then(function (success) {
    // read the file
    $cordovaFile.readAsText(cordova.file.externalDataDirectory, fileName)
      .then(function (success) {
          deferred.resolve(success);
      }, function (error) {
        deferred.reject(error);
      })
  }, function (error) {
    deferred.reject(error);
  })
  return deferred.promise;
}

function csvToJsonConvertor(csvWoman, csvWomanAncVisits, csvWomanFp) {
  if (!csvWoman || !csvWomanAncVisits || !csvWomanFp) {
    alert("undefined files");
    return;
  };
  var womanRows = csvWoman.split("\n");
  var womanAncVisitRows = csvWomanAncVisits.split("\n");
  var womanFpRows = csvWomanFp.split("\n");
  
  var result = [];
  var finalResult = [];
  var finalObj = {};
  var womanHeaders = womanRows[0].split(",");

  for(var i=1;i<womanRows.length;i++) { 
    var obj = {}; 
    var displayID = "";  
    var womanRow=womanRows[i].split(","); 

    for(var j=0;j<womanHeaders.length;j++) { 
      obj[womanHeaders[j]] = womanRow[j];
      if (womanHeaders[j] === 'displayID')
          displayID = womanRow[j];
    } 
    obj["familyPlanningVisits"] = csvToJsonForFp(womanFpRows, displayID);
    obj["ANC"] = csvToJsonForFp(womanAncVisitRows, displayID);
    result.push(obj); 
} 
   
    finalObj["womanArray"] = result;
    finalResult.push(finalObj);
    //return result; //JavaScript object 
    return JSON.stringify(finalObj); //JSON } 
}

function csvToJsonForFp(womanDetRows, displayID) {
    var result = [];

    var womanDetHeaders = womanDetRows[0].split(",");
    for(var i=1;i<womanDetRows.length;i++) { 
      var obj = {};
      var womanDetDisplayID = "";
      var womanDetRow=womanDetRows[i].split(","); 
      
      for(var j=0;j<womanDetHeaders.length;j++) { 
          if (womanDetHeaders[j] == 'displayID') {
            womanDetDisplayID = womanDetRow[j];
          } else {
            obj[womanDetHeaders[j]] = womanDetRow[j];
          }
          
      }
      if (womanDetDisplayID === displayID) {
          result.push(obj); 
      }
    } 
   
    return result; //JavaScript object 
    //return JSON.stringify(result); //JSON } 
}

function jsonToCSVConvertor(JSONData) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSVfiles = {};
    var CSVWoman = '';
    var CSVWomanFp = '';
    var CSVWomanAnc = '';    

    var womanLabelRow = "";
    var fpLabelRow = "";
    var ancLabelRow = "";
    
    if (arrData != null) 
    {    
      //This loop will extract the label from 1st index of on array
      for (var index in arrData["womanArray"][0]) {
        if (!((index.trim() === "familyPlanningVisits") || (index.trim() === "ANC")))
          //Now convert each value to string and comma-seprated
          womanLabelRow += index + ',';
      }
      
      womanLabelRow = womanLabelRow.slice(0, -1);
      
      //append Label row with line break
      CSVWoman += womanLabelRow + '\r\n';

      //1st loop is to extract each row
      for (var i = 0; i < arrData["womanArray"].length; i++) {
          var womanRow = "";
          
          //2nd loop will extract each column and convert it in string comma-seprated
          for (var index in arrData["womanArray"][i]) {
            if (index === "familyPlanningVisits") {
                if (CSVWomanFp === '') {
                    CSVWomanFp += generateFpLabelRow(arrData["womanArray"][i][index]);
                    CSVWomanFp += jsonToCSVFp(arrData["womanArray"][i]["displayID"], arrData["womanArray"][i][index]);
                }
                else {
                    CSVWomanFp += jsonToCSVFp(arrData["womanArray"][i]["displayID"], arrData["womanArray"][i][index]);
                }
              } else
                  if (index === "ANC") {
                        if (CSVWomanAnc === '') {
                            CSVWomanAnc += generateFpLabelRow(arrData["womanArray"][i][index]);
                            CSVWomanAnc += jsonToCSVFp(arrData["womanArray"][i]["displayID"], arrData["womanArray"][i][index]);
                        }
                        else {
                            CSVWomanAnc += jsonToCSVFp(arrData["womanArray"][i]["displayID"], arrData["womanArray"][i][index]);
                        }
                  } else {
                      womanRow += '"' + arrData["womanArray"][i][index] + '",';
                  }
          }

          //womanRow.slice(0, womanRow.length - 1);
          womanRow = womanRow.slice(0, -1);
          
          //add a line break after each row
          CSVWoman += womanRow + '\r\n';
      }

      if (CSVWoman == '') {        
          alert("Invalid data");
          return;
      }   
    }

    CSVfiles["woman"] = CSVWoman;
    CSVfiles["fp"] = CSVWomanFp;
    CSVfiles["anc"] = CSVWomanAnc;
    return CSVfiles;
}


function generateFpLabelRow(fpObject) {
    var fpLabelRow = 'displayID,';
    //This loop will extract the label from 1st index of on array
    for (var index in fpObject[0]) {
        //Now convert each value to string and comma-seprated
        fpLabelRow += index + ',';
    }
    
    fpLabelRow = fpLabelRow.slice(0, -1);
    
    //append Label row with line break
    fpLabelRow += '\r\n';
    return fpLabelRow;
}

function jsonToCSVFp(displayID, fpObject) {
    var csvfp = '';
    //1st loop is to extract each row
    for (var i = 0; i < fpObject.length; i++) {
        var fpRow = '"' + displayID + '",';;
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in fpObject[i]) {
            fpRow += '"' + fpObject[i][index] + '",';
        }
        
        //fpRow.slice(0, fpRow.length - 1);
        fpRow = fpRow.slice(0, -1);
        
        //add a line break after each row
        csvfp += fpRow + '\r\n';
    }

   // if (fpRow == '') {        
   //     alert("Invalid data");
   //     return;
   // }   

    return csvfp; 
} 
