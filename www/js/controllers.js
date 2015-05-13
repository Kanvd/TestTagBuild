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
      alert("Test");
      // Check in the local storage if MCAS_APP_LOCKED is not defined
      var UHI_MCAS_APP_LOCKED = localStorage.getItem('UHI_MCAS_APP_LOCKED');
      var UHI_MCAS = localStorage.getItem('UHI_MCAS');
      alert(UHI_MCAS);
      var womenData = {};
      if ((UHI_MCAS != '') && (UHI_MCAS != null)) 
        womenData = JSON.parse(localStorage.getItem('UHI_MCAS'));
      alert(UHI_MCAS_APP_LOCKED);
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
                $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/woman_anc_visits.csv", CSVfiles.anc, true)
                  .then (function (success) {
                    $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/child.csv", CSVfiles.child, true)
                      .then (function (success) {
                        $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/child_immunization.csv", CSVfiles.immunization, true)
                          .then (function (success) {
                            $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/child_new_born.csv", CSVfiles.newBorn, true)
                              .then (function (success) {
                                UHI_MCAS_APP_LOCKED = 'true';
                                localStorage.setItem('UHI_MCAS_APP_LOCKED', UHI_MCAS_APP_LOCKED);
                                alert("File written with localstorage data in the csv files in the out directory");
                              }, function (error) { // woman_fp.csv file was not created
                                alert("child_new_born.csv file was not written. There was an error " + error);
                              });
                          }, function (error) { // woman_fp.csv file was not created
                            alert("child_immunization.csv file was not written. There was an error " + error);
                        });
                      }, function (error) { // woman_fp.csv file was not created
                        alert("child.csv file was not written. There was an error " + error);
                      });
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
          alert("UHI_MCAS_APP_LOCKED - "  + UHI_MCAS_APP_LOCKED);
          $cordovaFile.createDir(cordova.file.externalDataDirectory, "out", false);
          // Write the file with the local storage data
          var CSVfiles = jsonToCSVConvertor(womenData); 
          alert("after jsonToCSVConvertor");
          $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/woman.csv", CSVfiles.woman, true)
            .then (function (success) {
              $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/woman_fp.csv", CSVfiles.fp, true)
                .then (function (success) {
                  $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/woman_anc_visits.csv", CSVfiles.anc, true)
                    .then (function (success) {
                      $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/child.csv", CSVfiles.child, true)
                        .then (function (success) {
                          $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/child_immunization.csv", CSVfiles.immunization, true)
                            .then (function (success) {
                              $cordovaFile.writeFile(cordova.file.externalDataDirectory, "out/child_new_born.csv", CSVfiles.newBorn, true)
                                .then (function (success) {
                                  UHI_MCAS_APP_LOCKED = 'true';
                                  localStorage.setItem('UHI_MCAS_APP_LOCKED', UHI_MCAS_APP_LOCKED);
                                  alert("File written with localstorage data in the csv files in the out directory");
                                }, function (error) { // woman_fp.csv file was not created
                                  alert("child_new_born.csv file was not written. There was an error " + error);
                                });
                            }, function (error) { // woman_fp.csv file was not created
                              alert("child_immunization.csv file was not written. There was an error " + error);
                          });
                        }, function (error) { // woman_fp.csv file was not created
                          alert("child.csv file was not written. There was an error " + error);
                        });
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
            alert("UHI_MCAS_APP_LOCKED - " + UHI_MCAS_APP_LOCKED);
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

                  // Child data
                  var childCSVpromise = readCSVFile($cordovaFile, $q, "in/child.csv");
                  var childNewBornCSVpromise = readCSVFile($cordovaFile, $q, "in/child_new_born.csv");
                  var childImmunizationCSVpromise = readCSVFile($cordovaFile, $q, "in/child_immunization.csv");

                  var womanChildAllpromise = $q.all([womanCSVpromise, womanAncCSVpromise, womanFpCSVpromise, childCSVpromise, childNewBornCSVpromise, childImmunizationCSVpromise]);
                  womanChildAllpromise.then(function(success){
                    var womanCSV = success[0];
                    var womanAncCSV = success[1];
                    var womanFpCSV = success[2];

                    var childCSV = success[3];
                    var childNewCSV = success[4];
                    var childImmunizationCSV = success[5];

                    alert("child CSV -" + childCSV);
                    alert("childNewCSV CSV -" + childNewCSV);
                    alert("childImmunizationCSV CSV -" + childImmunizationCSV);


                    // Convert CSV to JSON
                    alert("before csvToJsonConvertor");
                    womenData = JSON.parse(csvToJsonConvertor(womanCSV, womanAncCSV, womanFpCSV));
                    alert("after csvToJsonConvertor");
                    alert("Woman Data - " + womenData);
                    var childData = {};
                    var fullData = {};
                    try {
                      childData = JSON.parse(csvToJsonConvertorChild(childCSV, childNewCSV, childImmunizationCSV));
                      alert("child data - " + childData);
                      if (womenData != null) {
                        alert(womenData);
                        alert("womanArray - " + womenData["womanArray"]);
                        fullData.womanArray = womenData.womanArray;
                        alert(JSON.stringify(fullData));
                      }
                      if (childData != null) {
                        alert(childData);
                        alert(childData["childArray"]);
                        fullData.childArray = childData.childArray;
                        alert(JSON.stringify(fullData));
                      }

                    }
                    catch(e) {
                      alert("Error message - " + e);
                    }
                    //alert("child data - " + csvToJsonConvertorChild(childCSV, childNewCSV, childImmunizationCSV));
                    alert("after csvToJsonConvertorChild");
                    alert("fullData - " + JSON.stringify(fullData));
                    if (fullData != null) {
                      // Set the local storage with the latest data from the file
                      localStorage.setItem('UHI_MCAS', JSON.stringify(fullData));
                    } 
                    
                    // delete all the files from the in folder
                    $cordovaFile.removeFile(cordova.file.externalDataDirectory, "in/woman.csv");
                    $cordovaFile.removeFile(cordova.file.externalDataDirectory, "in/woman_anc_visits.csv");
                    $cordovaFile.removeFile(cordova.file.externalDataDirectory, "in/woman_fp.csv");
                    // delete all the child files from the in folder
                    $cordovaFile.removeFile(cordova.file.externalDataDirectory, "in/child.csv");
                    $cordovaFile.removeFile(cordova.file.externalDataDirectory, "in/child_new_born.csv");
                    $cordovaFile.removeFile(cordova.file.externalDataDirectory, "in/child_immunization.csv");
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
    alert("readCSVFile file Name - " + fileName);
    $cordovaFile.readAsText(cordova.file.externalDataDirectory, fileName)
      .then(function (success) {
          deferred.resolve(success);
      }, function (error) {
        deferred.reject(error);
      })
  }, function (error) {
    alert("file Name - " + fileName + " Error - " + error);
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

function csvToJsonConvertorChild(csvChild, csvChildNew, csvChildImmunization) {
  if (!csvChild || !csvChildNew || !csvChildImmunization) {
    alert("undefined files");
    return;
  };
  alert("csvChild - " + csvChild);
  alert("csvChildNew - " + csvChildNew);
  alert("csvChildImmunization - " + csvChildImmunization);
  var childRows = csvChild.split("\n");
  var childNewRows = csvChildNew.split("\n");
  var childImmunizationRows = csvChildImmunization.split("\n");
  
  var result = [];
  var finalResult = [];
  var finalObj = {};
  var childHeaders = childRows[0].split(",");

  for(var i=1;i<childRows.length;i++) { 
    var obj = {}; 
    var displayID = "";  
    var childRow=childRows[i].split(","); 

    for(var j=0;j<childHeaders.length;j++) { 
      obj[childHeaders[j]] = childRow[j];
      if (childHeaders[j] === 'displayID')
          displayID = childRow[j];
    } 
    obj["newBornDetails"] = csvToJsonForChildDetails(childNewRows, displayID);
    obj["immunizationDetails"] = csvToJsonForChildDetails(childImmunizationRows, displayID);
    result.push(obj); 
  } 
   
    finalObj["childArray"] = result;
    finalResult.push(finalObj);
    //return result; //JavaScript object 
    return JSON.stringify(finalObj); //JSON } 
}

function csvToJsonForChildDetails(childDetRows, displayID) {
    var result = [];

    var childDetHeaders = childDetRows[0].split(",");
    for(var i=1;i<childDetRows.length;i++) { 
      var obj = {};
      var childDetDisplayID = "";
      var childDetRow=childDetRows[i].split(","); 
      
      for(var j=0;j<childDetHeaders.length;j++) { 
          if (childDetHeaders[j] == 'displayID') {
            childDetDisplayID = childDetRow[j];
          } else {
            obj[childDetHeaders[j]] = childDetRow[j];
          }
          
      }
      if (childDetDisplayID === displayID) {
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

    var CSVChild = '';
    var CSVChildNew = '';
    var CSVChildImmunization = '';    

    var womanLabelRow = "";
    var fpLabelRow = "";
    var ancLabelRow = "";
    var childLabelRow = "";
    var newBornLabelRow = "";
    var immunizationLabelRow = "";
    
    alert("jsonToCSVConvertor arrData - " + JSON.stringify(arrData));
    if (arrData != null) 
    {    
      alert("inside if");
      if (!(arrData["womanArray"] == null)) {
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
        alert("one line before arrData[childArray][0]");
        alert("value - " + arrData["childArray"]);
      }
      
      //alert("arrData[childArray][0] - " + arrData["childArray"][0]);

      if (arrData["childArray"] == null) {
        alert("in if statement");
      }
      else {
        alert("in else statement");
      }
      
      //////////////////////////////////////////////////////////////////
      /////// Child Data logic /////////////////////////////////////////
      if (!(arrData["childArray"] == null)) {
        //This loop will extract the label from 1st index of on array
        for (var index in arrData["childArray"][0]) {
          if (!((index.trim() === "newBornDetails") || (index.trim() === "immunizationDetails")))
            //Now convert each value to string and comma-seprated
            childLabelRow += index + ',';
        }
        
        childLabelRow = childLabelRow.slice(0, -1);
        
        //append Label row with line break
        CSVChild += childLabelRow + '\r\n';

        //1st loop is to extract each row
        for (var i = 0; i < arrData["childArray"].length; i++) {
            var childRow = "";
            
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData["childArray"][i]) {
              if (index === "newBornDetails") {
                  if (CSVChildNew === '') {
                      CSVChildNew += generateFpLabelRow(arrData["childArray"][i][index]);
                      CSVChildNew += jsonToCSVFp(arrData["childArray"][i]["displayID"], arrData["childArray"][i][index]);
                  }
                  else {
                      CSVChildNew += jsonToCSVFp(arrData["childArray"][i]["displayID"], arrData["childArray"][i][index]);
                  }
                } else
                    if (index === "immunizationDetails") {
                          if (CSVChildImmunization === '') {
                              CSVChildImmunization += generateFpLabelRow(arrData["childArray"][i][index]);
                              CSVChildImmunization += jsonToCSVFp(arrData["childArray"][i]["displayID"], arrData["childArray"][i][index]);
                          }
                          else {
                              CSVChildImmunization += jsonToCSVFp(arrData["childArray"][i]["displayID"], arrData["childArray"][i][index]);
                          }
                    } else {
                        childRow += '"' + arrData["childArray"][i][index] + '",';
                    }
            }

            //womanRow.slice(0, womanRow.length - 1);
            childRow = childRow.slice(0, -1);
            
            //add a line break after each row
            CSVChild += childRow + '\r\n';
        }        
      }
    }
    alert("end of child data parsing");

      ///////// Child Data logic //////////////////////////////////////
    //  if (CSVWoman == '') {        
    //      alert("Invalid data");
    //      return;
     // }   

    CSVfiles["woman"] = CSVWoman;
    CSVfiles["fp"] = CSVWomanFp;
    CSVfiles["anc"] = CSVWomanAnc;
    CSVfiles["child"] = CSVChild;
    CSVfiles["newBorn"] = CSVChildNew;
    CSVfiles["immunization"] = CSVChildImmunization;
    
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
