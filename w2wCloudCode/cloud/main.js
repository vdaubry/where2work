Parse.Cloud.beforeSave("Place", function(request, response) {
  var Place = Parse.Object.extend("Place");
  var query = new Parse.Query(Place);
  query.equalTo("name", request.object.get("name"));
  query.first().then(function(duplicate) {
    //If no duplicates
    if (typeof duplicate === "undefined") {
      if (!request.object.get("name")) {
        response.error("Name is missing");
      } else if (!request.object.get("address")) {
        response.error("Address is missing");
      } else if (!request.object.get("wifiQuality")) {
        response.error("Wifi Quality is missing");
      } else {
        response.success();
      }
    } else {
      response.error("Name already exists");
    }
  });
});
