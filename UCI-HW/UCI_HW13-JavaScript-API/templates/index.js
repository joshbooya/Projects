function optionList() {
    var $dataList = document.getElementById("selDataset");
    queryURL = "/names";

    d3.json(queryURL, function(error, response) {
        // Handle errors
        if (error) return console.warn(error);
        
        var results = response;
        console.log(results);


        for (var i = 0; i < results.length; i++) {
            var option = document.createElement("option");
            option.value = results[i];
            option.text = results[i];
            $dataList.append(option);
        }
    });
}
