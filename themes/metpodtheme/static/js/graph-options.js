 /* Set the initial data */
 let temp_init = {
     labels: [],
     datasets: [
         {
             label: "Temperature °C",
             borderColor: 'rgba(255, 0, 0, 1)',
             backgroundColor: 'rgba(255, 0, 0, 1)',
             fill: false,
             spanGaps: false,
             pointRadius: 0,
             data: [],
         },
         {
             label: "Dew Point °C",
             borderColor: 'rgba(0, 153, 0, 1)',
             backgroundColor: 'rgba(0, 153, 0, 1)',
             fill: false,
             spanGaps: false,
             pointRadius: 0,
             data: [],
         },
         {
             label: 'Humidity %',
             showLine: false, // This line isn't shown, only the value on the tooltip
             spanGaps: false,
             fill: false,
             pointRadius: 0,
             data: [],
             yAxisID: 'y-axis-2',
         },
     ]
 };

 let pressure_init = {
     labels: [],
     datasets: [
         {
             label: "Pressure hPa",
             borderColor: 'rgba(83, 51, 237, 1)',
             backgroundColor: 'rgba(83, 51, 237, 1)',
             fill: false,
             spanGaps: false,
             pointRadius: 0,
             data: []
         }
     ]
 };

 let winddir_init = {
     labels: [],
     datasets: [
         {
             label: 'Wind Direction',
             fill: false,
             borderColor: 'rgba(0, 51, 153, 1)',
             backgroundColor: 'rgba(0, 51, 153, 1)',
             pointRadius: 1.5,
             data: []
         }
     ]
 };

 let windspd_init = {
     labels: [],
     datasets: [
         {
             label: 'Speed (10 min mean)',
             data: [],
             fill: false,
             borderColor: 'rgba(0, 0, 0, 1)',
             backgroundColor: 'rgba(0, 0, 0, 1)',
             pointRadius: 1.5,
         },
         {
             label: 'Gust',
             data: [],
             fill: false,
             borderColor: 'rgba(153, 153, 153, 1)',
             backgroundColor: 'rgba(153, 153, 153, 1)',
             pointRadius: 1.5,
         }
     ],
 };

 let rainfall_init = {
     labels: [],
     datasets: [
         {
             label: 'Rain rate mm/hr',
             data: [],
             fill: false,
             borderColor: 'rgba(79, 255, 76, 1)',
             backgroundColor: 'rgba(79, 255, 76, 1)',
             pointRadius: 0,
         },
         {
             label: 'Rainfall total (09 -> 09hrs)',
             data: [],
             fill: false,
             borderColor: 'rgba(83, 51, 237, 1)',
             backgroundColor: 'rgba(83, 51, 237, 1)',
             pointRadius: 0,
         }
     ],
 };

 /* Set the options for our charts */
 let options_winddir = {
     showLines: false,
     pointStyle: 'cross',
     responsive: true,
     maintainAspectRatio: true,
     animation: false,
     tooltips: {
         mode: 'index',
         intersect: false,
     },
     hover: {
         mode: 'nearest',
         intersect: true
     },
     scales: {
         xAxes: [{
             type: 'time',
             distribution: 'linear',
             time: {
                 displayFormats: {}
             },
             display: true,
             scaleLabel: {
                 display: false,
                 labelString: 'Time'
             }
         }],
         yAxes: [{
             display: true,
             scaleLabel: {
                 display: true,
                 position: 'left',
                 labelString: 'Degrees',
             },
             ticks: {
                 min: 0,
                 max: 360,
                 stepSize: 90,
             },
         }]
     }
 };

 let options_windspd = {
     showLines: false,
     responsive: true,
     maintainAspectRatio: true,
     animation: false,
     tooltips: {
         mode: 'index',
         intersect: false,
     },
     hover: {
         mode: 'nearest',
         intersect: true
     },
     scales: {
         xAxes: [{
             type: 'time',
             distribution: 'linear',
             time: {
                 displayFormats: {}
             },
             display: true,
             scaleLabel: {
                 display: false,
                 labelString: 'Time'
             }
         }],
         yAxes: [{
             display: true,
             scaleLabel: {
                 display: true,
                 labelString: 'Knots'
             },
             ticks: {
                 min: 0,
                 suggestedMax: 25
             }
         }]
     }
 };

 let options_rainfall = {
     showLines: true,
     responsive: true,
     maintainAspectRatio: true,
     animation: false,
     tooltips: {
         mode: 'index',
         intersect: false,
     },
     hover: {
         mode: 'nearest',
         intersect: true
     },
     scales: {
         xAxes: [{
             type: 'time',
             distribution: 'linear',
             time: {
                 displayFormats: {}
             },
             display: true,
             scaleLabel: {
                 display: false,
                 labelString: 'Time'
             }
         }],
         yAxes: [{
             display: true,
             scaleLabel: {
                 display: true,
                 labelString: 'mm'
             },
             ticks: {
                 min: 0,
                 suggestedMax: 6
             }
         }]
     }
 };

 let options_press = {
                    responsive: true,
                    maintainAspectRatio: true,
                    animation: false,
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            distribution: 'linear',
                            time: {
                                displayFormats: {
                                }
                            },
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: 'Time'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'hPa'
                            },
                            ticks: {
                                suggestedMin: 1000,
                                suggestedMax: 1010
                            }
                        }]
                    }
                };

 let options_temp = {
     responsive: true,
     maintainAspectRatio: true,
     animation: false,
     tooltips: {
         mode: 'index',
         intersect: false,
     },
     hover: {
         mode: 'nearest',
         intersect: true
     },
     scales: {
         xAxes: [{
             type: 'time',
             distribution: 'linear',
             time: {
                 displayFormats: {}
             },
             display: true,
             scaleLabel: {
                 display: false,
                 labelString: 'Time'
             }
         }],
         yAxes: [{
             display: true,
             id: 'y-axis-1',
             scaleLabel: {
                 display: true,
                 labelString: 'Degrees C'
             },
             ticks: {
                 suggestedMin: 0,
                 suggestedMax: 10,
             }
         }, {
             display: false,
             position: 'right',
             id: 'y-axis-2',
             scaleLabel: {
                 display: false,
                 labelString: 'Humidity'
             },
             ticks: {
                 suggestedMin: 30,
                 max: 100,
             },
             gridLines: {
                 drawOnChartArea: false, // only want the grid lines for one axis to show up
             },

         }]
     }
 };

