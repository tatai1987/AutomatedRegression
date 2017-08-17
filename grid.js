$(document).ready(function () {
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
});

function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}

function updateMDF() {
    
    var excel = new ActiveXObject("Excel.Application");
    var test_type= 'regression';
    var excel_file;
    if (test_type == 'regression') {
         excel_file = excel.Workbooks.Open("C:\\Automation\\regression\\MDF.xlsx");
    }
    else {
         excel_file = excel.Workbooks.Open("C:\\Automation\\smoke\\MDF.xlsx");
        
    }

    var excel_sheet = excel_file.Worksheets("Applications");
    var xlUp = -4162;
    var countrow= excel_sheet.cells(excel_sheet.rows.count,1).end(xlUp).row;
    
    for (var i = 1; i <= countrow; i++) {
        excel_sheet.Cells(i, 4).Value = 'No';
    }

    
    for (var i = 1; i <= countrow; i++) {
        if (excel_sheet.Cells(i, 1).Value == 'PTE' && excel_sheet.Cells(i, 2).Value == 'NWPFE_AUTH') {
            excel_sheet.Cells(i, 4).Value = 'Yes';
        }
    }
   

    var excel_sheet = excel_file.Worksheets("Global");
    var countrow= excel_sheet.cells(excel_sheet.rows.count,6).end(xlUp).row;
    
    for (var i = 1; i <= countrow; i++) {
        excel_sheet.Cells(i, 7).Value = 'N';
    }

    for (var i = 1; i <= countrow; i++) {
        if (excel_sheet.Cells(i, 8).Value == 'NWPFE_AUTH') {
            excel_sheet.Cells(i, 7).Value = 'Y';
        }
    }

    excel_file.save();
    excel_file.Close();
    excel.DisplayAlerts = false;
    excel.Application.Quit();

}

function readMRF() {
    
    var excel = new ActiveXObject("Excel.Application");

    var excel_file;

    excel_file = excel.Workbooks.Open("C:\\Automation\\DataFiles\\MRF.xlsx");
    
    var excel_sheet = excel_file.Worksheets("Execution_Report");
    var xlUp = -4162;
    var countrow= excel_sheet.cells(excel_sheet.rows.count,1).end(xlUp).row;
    var failCounter=0;
    var passCounter=0;
    for (var i = 1; i <= countrow; i++) {
        alert(excel_sheet.Cells(i, 6).Value);
        if(excel_sheet.Cells(i, 6).Value == 'Fail'){
            failCounter++;
        }
        if(excel_sheet.Cells(i, 6).Value == 'Pass'){
            passCounter++;
        }
    }
    alert(failCounter);
     alert(passCounter);
    var chart = new CanvasJS.Chart("chartContainer",
    {
        theme: "theme2",
        title:{
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
                     {  y: passCounter, indexLabel: "Pass" },
                     {  y: failCounter, indexLabel: "Fail" }
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

function runVBS() {
    $('#test-console').submit(); 
    var shell = new ActiveXObject("WScript.Shell");
    shell.Exec("wscript C:\\Automation\\Execute.vbs");
}
function showSelected(){
  console.info("i am here");    
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