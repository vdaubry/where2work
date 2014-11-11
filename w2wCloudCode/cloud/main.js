Parse.Cloud.beforeSave("Place", function(request, response) {
  //In case of update we only field by field modification
  if(request.object.existed() == true) {
    response.success();
  }
  //In case of create all mandatory fields must be sent
  else {
    var Place = Parse.Object.extend("Place");
    var query = new Parse.Query(Place);
    query.equalTo("address", request.object.get("address"));
    query.first().then(function(duplicate) {
      //If no duplicates or if it is an update
      if (typeof duplicate === "undefined") {
        if (!request.object.get("name")) {
          response.error("Name is missing");
        } else if (!request.object.get("address")) {
          response.error("Address is missing");
        } else if (request.object.get("wifiQuality")==undefined) {
          response.error("Wifi Quality is missing");
        } else if (!request.object.get("placeType")) {
          response.error("Place type is missing");
        } else if (request.object.get("phoneFriendly")==undefined) {
          response.error("Phone friendliness is missing");
        } else if (request.object.get("quiet")==undefined) {
          response.error("Noisiness is missing");
        } else if (request.object.get("price")==undefined) {
          response.error("Price is missing");
        } else {
          response.success();
        }
      } else {
        response.error("Place already exists");
      }
    });
  }
});
