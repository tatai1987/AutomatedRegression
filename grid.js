function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}

function updateMDF() {
    
    var suite = $('input[name=suite]:checked', '#tab-execution-console').val();
    var idForSuite = $('input[name=suite]:checked', '#tab-execution-console')[0].id;
    var environment = $('input[name=environment]:checked', '#tab-env-health').val();
    
    var excel_file;
    var suites = suite.split(" ");

    var excel = new ActiveXObject("Excel.Application");

    if (idForSuite.indexOf("nwp") !== -1) {
        if (idForSuite.indexOf("smoke") !== -1) {
            excel_file = excel.Workbooks.Open("C:\\Automation\\NWP\\Smoke\\DataFiles\\MDF.xlsx");
        }

        if (idForSuite.indexOf("regression") !== -1) {
            excel_file = excel.Workbooks.Open("C:\\Automation\\NWP\\Regression\\DataFiles\\MDF.xlsx");
        }

        var excel_sheet = excel_file.Worksheets("Applications");
        var xlUp = -4162;
        var countrow = excel_sheet.cells(excel_sheet.rows.count, 1).end(xlUp).row;

        for (var i = 2; i <= countrow; i++) {
            excel_sheet.Cells(i, 4).Value = 'No';
        }

        if (suites.length > 1) {
            for (var i = 2; i <= countrow; i++) {
                if (excel_sheet.Cells(i, 1).Value == environment && (excel_sheet.Cells(i, 2).Value == suites[0] || excel_sheet.Cells(i, 2).Value == suites[1] || excel_sheet.Cells(i, 2).Value == suites[2])) {
                    excel_sheet.Cells(i, 4).Value = 'Yes';
                }
            }
        }
        else {
            for (var i = 2; i <= countrow; i++) {
                if (excel_sheet.Cells(i, 1).Value == environment && excel_sheet.Cells(i, 2).Value == suites[0]) {
                    excel_sheet.Cells(i, 4).Value = 'Yes';
                }
            }
        }

        var excel_sheet = excel_file.Worksheets("Global");
        var countrow = excel_sheet.cells(excel_sheet.rows.count, 6).end(xlUp).row;

        for (var i = 2; i <= countrow; i++) {
            excel_sheet.Cells(i, 7).Value = 'N';
        }


        if (suites.length > 1) {
            for (var i = 2; i <= countrow; i++) {
                if (excel_sheet.Cells(i, 8).Value.indexOf(suites[0]) !== -1 || excel_sheet.Cells(i, 8).Value.indexOf(suites[1]) !== -1 || excel_sheet.Cells(i, 8).Value.indexOf(suites[2]) !== -1) {
                    excel_sheet.Cells(i, 7).Value = 'Y';
                }
            }
        }
        else {
            for (var i = 2; i <= countrow; i++) {
                if (excel_sheet.Cells(i, 8).Value.indexOf(suites[0]) !== -1) {
                    excel_sheet.Cells(i, 7).Value = 'Y';
                }
            }

        }

        excel_file.save();
        excel_file.Close();
        excel.DisplayAlerts = false;
        excel.Application.Quit();

     }
    var shell = new ActiveXObject("WScript.Shell");


    if (idForSuite.indexOf("nwp") !== -1) {
        if (idForSuite.indexOf("smoke") !== -1) {
            shell.Exec("wscript C:\\Automation\\NWP\\Smoke\\Execute.vbs");
        }

        if (idForSuite.indexOf("regression") !== -1) {
            shell.Exec("wscript C:\\Automation\\NWP\\Regression\\Execute.vbs");
        }
    }

    if (idForSuite.indexOf("sof") !== -1) {
        if (idForSuite.indexOf("smoke") !== -1) {
            shell.Exec("wscript C:\\Automation\\SOF\\Smoke\\Execute.vbs");
        }

        if (idForSuite.indexOf("regression") !== -1) {
            shell.Exec("wscript C:\\Automation\\SOF\\Regression\\Execute.vbs");
        }

    }

}

function readMRF() {

    var excel = new ActiveXObject("Excel.Application");

    var excel_file;
    var idForSuite = document.getElementsByName("suite")[0].getAttribute('id');
    

    if (idForSuite.indexOf("nwp") !== -1) {
        if (idForSuite.indexOf("smoke") !== -1) {
            excel_file = excel.Workbooks.Open("C:\\Automation\\NWP\\Smoke\\DataFiles\\MRF.xlsx");
        }

        if (idForSuite.indexOf("regression") !== -1) {
            excel_file = excel.Workbooks.Open("C:\\Automation\\NWP\\Regression\\DataFiles\\MRF.xlsx");
        }
    }

    if (idForSuite.indexOf("sof") !== -1) {
        if (idForSuite.indexOf("smoke") !== -1) {
            excel_file = excel.Workbooks.Open("C:\\Automation\\SOF\\Smoke\\DataFiles\\MRF.xlsx");
        }

        if (idForSuite.indexOf("regression") !== -1) {
            excel_file = excel.Workbooks.Open("C:\\Automation\\SOF\\Regression\\DataFiles\\MRF.xlsx");
        }

    }


    var excel_sheet = excel_file.Worksheets("Execution_Report");
    var xlUp = -4162;
    var countrow = excel_sheet.cells(excel_sheet.rows.count, 6).end(xlUp).row;
    var failCounter = 0;
    var passCounter = 0;
    var titleList = [];
    var testCaseIdList = [];
    var executionStatusList = [];
    var dateList = [];
    var failureReasonList = [];

    for (var i = 1; i <= countrow; i++) {

        if (excel_sheet.Cells(i, 6).Value == 'Fail') {
            failCounter++;
        }
        if (excel_sheet.Cells(i, 6).Value == 'Pass') {
            passCounter++;
        }
        titleList.push(excel_sheet.Cells(i, 3).Value);
        testCaseIdList.push(excel_sheet.Cells(i, 4).Value);
        executionStatusList.push(excel_sheet.Cells(i, 6).Value);
        dateList.push(excel_sheet.Cells(i, 8).Value);
        failureReasonList.push(excel_sheet.Cells(i, 11).Value);
    }
    $('#dyn-table').html('<table class="table"><tbody></tbody></table>');

    for (var i = 0; i < countrow; i++) {
        console.info(failureReasonList[i]);
        if (failureReasonList[i] == undefined) {
            failureReasonList[i] = ' ';
        }
        console.info(failureReasonList[i]);
        $('#dyn-table tbody').append('<tr><td class="active">' + titleList[i]
            + '</td> <td class="success">' + testCaseIdList[i]
            + ' </td> <td class="warning">' + executionStatusList[i]
            + ' </td> <td class="danger">' + dateList[i]
            + ' </td> <td class="info">' + failureReasonList[i]
            + ' </td> </tr>')
    }

    var chart = new CanvasJS.Chart("chartContainer",
        {
            theme: "theme2",
            title: {
                text: "Execution Result"
            },
            animationEnabled: true,
            data: [
                {
                    type: "doughnut",
                    startAngle: 60,
                    toolTipContent: "{legendText}: {y} - <strong>#percent% </strong>",
                    showInLegend: true,
                    dataPoints: [
                        { y: passCounter, indexLabel: "Pass" },
                        { y: failCounter, indexLabel: "Fail" }
                    ]
                }
            ]
        });
    chart.render();
    excel_file.save();
    excel_file.Close();
    excel.DisplayAlerts = false;
    excel.Application.Quit();
}

function createTable() {
    $(document.createElement('table'));
}
//according menu

$(document).ready(function () {
    //Add Inactive Class To All Accordion Headers
    $('.accordion-header').toggleClass('inactive-header');

    //Set The Accordion Content Width
    var contentwidth = $('.accordion-header').width();
    $('.accordion-content').css({});

    //Open The First Accordion Section When Page Loads
    $('.accordion-header').first().toggleClass('active-header').toggleClass('inactive-header');
    $('.accordion-content').first().slideDown().toggleClass('open-content');

    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();

    //Wizard
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var $target = $(e.target);
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);

    });
    $(".prev-step").click(function (e) {

        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);

    });
    $("input[name='environment']").change(function () {
        // Do something interesting here
        $('input[name=environment]:checked', '#tab-env-health').val();
        console.info("here");
    });

    $("input[name='environment']").change(function () {
        alert('ole');
    });

    // The Accordion Effect
    $('.accordion-header').click(function () {
        if ($(this).is('.inactive-header')) {
            $('.active-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
            $(this).toggleClass('active-header').toggleClass('inactive-header');
            $(this).next().slideToggle().toggleClass('open-content');
        }

        else {
            $(this).toggleClass('active-header').toggleClass('inactive-header');
            $(this).next().slideToggle().toggleClass('open-content');
        }
    });

    return false;
});