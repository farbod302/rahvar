const ChartJSImage = require('chart.js-image');


const line_chart = ChartJSImage().chart({
    "type": "line",
    "data": {
        "labels": [
            "فروردین",
            "اردیبهشت",
            "خرداد",
            "مهر",
            "آبان",
            "آذر",
            "دی"
        ],
        "datasets": [
            {
                "label": "کد تخلف در سال ۱۴۰۰",
                "borderColor": "rgb(255,+99,+132)",
                "backgroundColor": "rgba(255,+99,+132,+.5)",
                "data": [
                    57,
                    90,
                    11,
                    -15,
                    37,
                    -37,
                    -27
                ]
            },
            {
                "label": "کد تخلف در سال ۱۴۰۱",
                "borderColor": "rgb(54,+162,+235)",
                "backgroundColor": "rgba(54,+162,+235,+.5)",
                "data": [
                    71,
                    -36,
                    -94,
                    78,
                    98,
                    65,
                    -61
                ]
            },
        ]
    },
    "options": {
        "title": {
            "display": false,
            "text": "Chart.js Line Chart"
        },
        "scales": {
            "xAxes": [
                {
                    "scaleLabel": {
                        "display": true,
                        "labelString": "بازه زمانی"
                    }
                }
            ],
            "yAxes": [
                {
                    "stacked": true,
                    "scaleLabel": {
                        "display": true,
                        "labelString": "تعداد"
                    }
                }
            ]
        }
    }
}) // Line chart
    .backgroundColor('white')
    .width(500) // 500px
    .height(300); // 300px

line_chart.toFile(`${__dirname}/../files/chart.png`);