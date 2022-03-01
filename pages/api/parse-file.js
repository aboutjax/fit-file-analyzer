var FitParser = require("fit-file-parser").default;

export default async function handler(req, res) {
  const fs = require("fs");

  let promise = new Promise(function (resolve, reject) {
    // the function is executed automatically when the promise is constructed
    fs.readFile("./fit/outdoor.fit", function (err, content) {
      // Create a FitParser instance (options argument is optional)
      var fitParser = new FitParser({
        force: true,
        speedUnit: "km/h",
        lengthUnit: "km",
        temperatureUnit: "kelvin",
        elapsedRecordField: true,
        mode: "both",
      });

      // Parse your file
      fitParser.parse(content, function (error, data) {
        // Handle result of parse method
        if (error) {
          console.log(error);
          reject("error");
        } else {
          let parsed = JSON.stringify(data);
          resolve(data);
        }
      });
    });
  });

  let parsedData = await promise;

  res.status(200).json({ data: parsedData });
}
