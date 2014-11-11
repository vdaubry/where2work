Parse.Cloud.beforeSave("Place", function(request, response) {
  //In case of update we only field by field modification
  if(request.object.existed() == true) {
    response.success();
  }
  //In case of create all mandatory fields must be sent
  else {
    var Place = Parse.Object.extend("Place");
    var query = new Parse.Query(Place);
    query.equalTo("name", request.object.get("name"));
    query.first().then(function(duplicate) {
      //If no duplicates or if it is an update
      if (typeof duplicate === "undefined") {
        if (!request.object.get("name")) {
          response.error("Name is missing");
        } else if (!request.object.get("address")) {
          response.error("Address is missing");
        } else if (!request.object.get("wifiQuality")) {
          response.error("Wifi Quality is missing");
        } else if (!request.object.get("type")) {
          response.error("Place type is missing");
        } else if (!request.object.get("phone")) {
          response.error("Phone friendliness is missing");
        } else if (!request.object.get("quiet")) {
          response.error("Noisiness is missing");
        } else {
          response.success();
        }
      } else {
        response.error("Name already exists");
      }
    });
  }
});
