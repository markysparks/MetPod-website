
// Initialize the Amazon Cognito credentials provider
AWS.config.region = "eu-west-2";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-west-2:070a1ea6-7e14-4416-989a-b4255d3edc4b",
    });

AWS.config.credentials.get(function(err) {
    if (err) {
        console.log("Error: " + err);
        return;
    }

    // Get the last 24hrs worth of data reports for the graphs
    let dynamodb = new AWS.DynamoDB({apiVersion: "2012-08-10"});
    let datumVal = new Date() - 86400000;
    let params = {
        TableName: "MetPodData",
        KeyConditionExpression: "#metpodID = :metpodID and #ttl <= :datum",
        ExpressionAttributeNames: {
            "#metpodID": "metpodID",
            "#ttl": "ttl"
        },
        ExpressionAttributeValues: {
            ":metpodID": {"S": "mpduk1"},
            ":datum": {"N": datumVal.toString()}
        }
    };

    // Get the latest data report for the dashboard fields
    let params_latest = {
        TableName: "MetPodData",
        KeyConditionExpression: "#metpodID = :metpodID",
        ExpressionAttributeNames: {
            "#metpodID": "metpodID"
        },
        ExpressionAttributeValues: {
            ":metpodID": {"S": "mpduk1"}
        },
        ScanIndexForward: false,
        Limit: 1
    };

    /* Create the context for applying the chart to the HTML canvas */
    let temp_ctx = $("#temperaturegraph").get(0).getContext("2d");
    let pressure_ctx = $("#pressuregraph").get(0).getContext("2d");
    let winddir_ctx = $("#winddirgraph").get(0).getContext("2d");
    let windspd_ctx = $("#windspdgraph").get(0).getContext("2d");
    let rainfall_ctx = $("#rainfallgraph").get(0).getContext("2d");

    let temperaturegraph = new Chart.Line(temp_ctx, {data: temp_init, options: options_temp});
    let pressuregraph = new Chart.Line(pressure_ctx, {data: pressure_init, options: options_press});
    let winddirgraph = new Chart.Line(winddir_ctx, {data: winddir_init, options: options_winddir});
    let windspdgraph = new Chart.Line(windspd_ctx, {data: windspd_init, options: options_windspd});
    let rainfallgraph = new Chart.Line(rainfall_ctx, {data: rainfall_init, options: options_rainfall});

    let obstime;
    let obstime_utc;

    $(function() {
      getData();
      getData_latest();
      $.ajaxSetup({ cache: false });
      setInterval(getData_latest,90000);
      setInterval(getData,90000);
      setInterval(updateReportTime, 10000);
    });

    function updateReportTime() {
        // set the displayed report time and age from the latest observation
        $(".obstime").html(obstime);
        $(".timediff").html(moment(obstime).fromNow());
    }

    function getData_latest() {
        dynamodb.query(params_latest, function(err, data_latest) {
            for (let i in data_latest['Items']) {
                obstime = moment(data_latest['Items'][i]['payload']['M']['timestamp']['S']).format("Y-MM-DD HH:mm");
                let tempc = data_latest['Items'][i]['payload']['M']['tempc']['N'];
                let dewptc = data_latest['Items'][i]['payload']['M']['dewptc']['N'];
                let day_max = data_latest['Items'][i]['payload']['M']['day_max']['N'];
                let night_min = data_latest['Items'][i]['payload']['M']['night_min']['N'];
                let trend = data_latest['Items'][i]['payload']['M']['trend']['N'];
                let tendency = data_latest['Items'][i]['payload']['M']['tendency']['N'];
                let humidity = data_latest['Items'][i]['payload']['M']['humidity']['N'];
                let pressure = data_latest['Items'][i]['payload']['M']['pressure']['N'];
                let qfe = data_latest['Items'][i]['payload']['M']['qfe']['N'];
                let qnh = data_latest['Items'][i]['payload']['M']['qnh']['N'];
                let winddir = data_latest['Items'][i]['payload']['M']['winddir_avg10m']['N'];
                let windspd = data_latest['Items'][i]['payload']['M']['windspd_avg10m']['N'];
                let windgust = data_latest['Items'][i]['payload']['M']['windgustkts']['N'];
                let rainfall = data_latest['Items'][i]['payload']['M']['dailyrainmm']['N'];
                let rainrate = data_latest['Items'][i]['payload']['M']['rainrate']['N'];

                if (typeof winddir === 'undefined') {winddir = '/'}
                    else if (parseFloat(winddir) < 10) {winddir = '00' + winddir}
                    else if (parseFloat(winddir) < 100) {winddir = '0' + winddir}
                if (typeof windgust === 'undefined') {windgust = '/'}
                if (typeof night_min === 'undefined') {night_min = '/'}
                if (typeof tempc === 'undefined') {tempc = '/'}
                if (typeof dewptc === 'undefined') {dewptc = '/'}
                if (typeof day_max === 'undefined') {day_max = '/'}
                if (typeof trend === 'undefined') {trend = '/'}
                if (typeof tendency === 'undefined') {tendency = '/'}
                if (typeof humidity === 'undefined') {humidity = '/'}
                if (typeof pressure === 'undefined') {pressure = '/'}
                if (typeof qfe === 'undefined') {qfe = '/'}
                if (typeof qnh === 'undefined') {qnh = '/'}
                if (typeof windspd === 'undefined') {windspd = '/'}
                if (typeof rainrate === 'undefined') {rainrate = '/'}
                if (typeof rainfall === 'undefined') {rainfall = '/'}

                document.getElementById('pressure').value = pressure;
                document.getElementById('qnh').value = qnh;
                document.getElementById('qfe').value = qfe;
                document.getElementById('chg3hr').value = tendency;
                document.getElementById('trend').value = trend;
                document.getElementById('daymax').value = day_max;
                document.getElementById('nightmin').value = night_min;
                document.getElementById('temp').value = tempc;
                document.getElementById('dewpt').value = dewptc;
                document.getElementById('humid').value = humidity;
                document.getElementById('winddir').value = winddir;
                document.getElementById('windspd').value = windspd;
                document.getElementById('gust').value = windgust;
                document.getElementById('total24hr').value = rainfall;
                document.getElementById('rainrate').value = rainrate;
            }
                updateReportTime();
        });
    }

    /* Makes a scan of the DynamoDB table to set a data object for the chart */
    function getData() {
      dynamodb.query(params, function(err, data) {
        if (err) {
          console.log(err);
          return null;
        } else {

    // placeholders for the data arrays
            let temperatureValues = [];
            let dewptValues = [];
            let pressureValues = [];
            let humidityValues = [];
            let winddirValues = [];
            let windspdValues = [];
            let windgustValues = [];
            let rainfallValues = [];
            let rainrateValues = [];
            let labelValues = [];

    // read the values from the dynamodb json packet
          for (let i in data['Items']) {
              let timeRead = moment(data['Items'][i]['payload']['M']['timestamp']['S']).format("Y-MM-DD HH:mm");
              let temperatureRead = parseFloat(data['Items'][i]['payload']['M']['tempc']['N']);
              let humidityRead = parseFloat(data['Items'][i]['payload']['M']['humidity']['N']);
              let dewptRead = parseFloat(data['Items'][i]['payload']['M']['dewptc']['N']);
              let pressureRead = parseFloat(data['Items'][i]['payload']['M']['pressure']['N']);
              let winddirRead = parseFloat(data['Items'][i]['payload']['M']['winddir_avg10m']['N']);
              let windspdRead = parseFloat(data['Items'][i]['payload']['M']['windspd_avg10m']['N']);
              let windgustRead = parseFloat(data['Items'][i]['payload']['M']['windgustkts']['N']);
              let rainfallRead = parseFloat(data['Items'][i]['payload']['M']['dailyrainmm']['N']);
              let rainrateRead = parseFloat(data['Items'][i]['payload']['M']['rainrate']['N']);

    // append the read data to the data arrays
            temperatureValues.push(temperatureRead);
            dewptValues.push(dewptRead);
            pressureValues.push(pressureRead);
            humidityValues.push(humidityRead);
            winddirValues.push(winddirRead);
            windspdValues.push(windspdRead);
            windgustValues.push(windgustRead);
            rainfallValues.push(rainfallRead);
            rainrateValues.push(rainrateRead);
            labelValues.push(timeRead);
          }
    // set the chart object data and label arrays
            temperaturegraph.data.labels = labelValues;
            temperaturegraph.data.datasets[0].data = temperatureValues;
            temperaturegraph.data.datasets[1].data = dewptValues;
            temperaturegraph.data.datasets[2].data = humidityValues;
            pressuregraph.data.labels = labelValues;
            pressuregraph.data.datasets[0].data = pressureValues;
            winddirgraph.data.labels = labelValues;
            winddirgraph.data.datasets[0].data = winddirValues;
            windspdgraph.data.labels = labelValues;
            windspdgraph.data.datasets[0].data = windspdValues;
            windspdgraph.data.datasets[1].data = windgustValues;
            rainfallgraph.data.labels = labelValues;
            rainfallgraph.data.datasets[0].data = rainrateValues;
            rainfallgraph.data.datasets[1].data = rainfallValues;

    // redraw the graph canvas
            temperaturegraph.update();
            pressuregraph.update();
            winddirgraph.update();
            windspdgraph.update();
            rainfallgraph.update();
            }
        });
    }
});
