    $(document).ready(function(){
    var config = {
    apiKey: "AIzaSyAXcUlssxAQWwLIQ4B2K02ldUvvM2L3Fqw",
    authDomain: "trainschedulehomework.firebaseapp.com",
    databaseURL: "https://trainschedulehomework.firebaseio.com",
    projectId: "trainschedulehomework",
    storageBucket: "trainschedulehomework.appspot.com",
    messagingSenderId: "263530006592"
  };
  firebase.initializeApp(config);

  var rtvName;
     var rtvRole;
     var rtvStartDate;
     var rtvMonthlyRate;

  var database = firebase.database();
  var trainName="Run of the Mill";
  var destination="Nowhere Important";
  var firstTrainTime="01:00";
  var frequency="Initial Comment";
  var timeToWait="0";
  var dueTime="00:00";
  var rtvTrainName;
  var rtvDestination;
  var rtvFirstTrainTime;
  var rtvFrequency;

    $("#add-train").on("click", function(event) {
        event.preventDefault();
        trainName = $("#trainName-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTrainTime = $("#firstTrainTime-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        database.ref().push({
          trainName: trainName,
          destination: destination,
          firstTrainTime: firstTrainTime,
          frequency: frequency
        });
        
        resetForm($('#trainAddForm'));

    });

  database.ref().on("child_added", function(childSnapshot) {
     rtvTrainName=(childSnapshot.val().trainName);
     rtvDestination=(childSnapshot.val().destination);
     rtvFirstTrainTime=(childSnapshot.val().firstTrainTime);
     rtvFrequency=parseInt((childSnapshot.val().frequency));
     frequency=rtvFrequency;

 timeCalc();
});
   
  function timeCalc(){
        var start=moment(rtvFirstTrainTime, "HH:mm");
        var nowTime=moment();
        var trips=nowTime.diff(start, 'minutes');
        var tripsCompleted=Math.floor(trips/rtvFrequency);
        var dueTimeMin=(tripsCompleted*rtvFrequency)+rtvFrequency;
        dueTime=start.add(dueTimeMin, 'minutes').format("HH:mm");
        var remainder=trips % rtvFrequency;
        timeToWait=frequency-remainder;
          $("#trainData").append("<tr class='trainDataRow'>" +
              "<td>"+rtvTrainName + 
              "<td>"+rtvDestination+"</td>" +
              "<td>"+rtvFrequency+"</td>" +
              "<td>"+dueTime+"</td>" + 
              "<td>"+ timeToWait+ "</td>" +
              "</tr>"
              );
        return;
  }

  $("#timeRefresh").on("click", function(refresh) {
  refresh.preventDefault();
  updateTime();
  refreshTimes();
});
    
function updateTime(){
   
    var currTime = moment().format('HH:mm');
   $('#current-time').html( "Current time in Orange County: "+ currTime +"<h4>(auto-refreshes every 60 seconds)</h4>"

    );
}

updateTime();

setInterval(function(){
   updateTime();
   refreshTimes();
},60000);

function refreshTimes() {
 
      return database.ref().once('value').then(function(refreshSnapshot) {
         $(".trainDataRow").empty();
            refreshSnapshot.forEach(function(childSnapshot) {
             rtvDestination=(childSnapshot.val().destination);
             rtvFirstTrainTime=(childSnapshot.val().firstTrainTime);
             rtvFrequency=parseInt((childSnapshot.val().frequency));
             frequency=rtvFrequency;
             rtvTrainName=(childSnapshot.val().trainName);
           
            timeCalc();
        });
      });
}


function resetForm($form) {
    $form.find('input:text').val('');         
}
   
});






