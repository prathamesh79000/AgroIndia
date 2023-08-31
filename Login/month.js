var Kharif = ["June", "July", "September", "October", "November"];
var Rabi = ["November", "December", "January", "February", "March"];
var Zaid = ["March", "April", "May", "June"];
$("#inputSeason").change(function(){
    var SeasonSelected = $(this).val();
    var optionsList;
    var htmlString = "";

  switch(SeasonSelected){
    case "Kharif":
        optionsList = Kharif;
        break;

    case "Rabi":
        optionsList = Rabi;
        break;

    case "Zaid":
        optionsList = Zaid;
        break;
}

    for(var i = 0; i < optionsList.length; i++){
        htmlString = htmlString+"<option value='"+ optionsList[i] +"'>"+ optionsList[i] +"</option>";
  }
  $("#inputMonth").html(htmlString);

});