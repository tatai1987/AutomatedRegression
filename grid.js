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
        alert('Inside Update MDF');
        var excel = new ActiveXObject("Excel.Application");
        alert(excel);
        var excel_file = excel.Workbooks.Open("C:\\Automation\\regression\\MDF.xlsx");
        alert('I am here');
        //excel.Visible = true;
        
        var excel_sheet = excel_file.Worksheets("Applications");
        
        var data = excel_sheet.Cells(2,2).Value;
        alert(data);

         for(var i=1;i<=39;i++){
                excel_sheet.Cells(i,4).Value ='No';
            }
        

        for(var i=1;i<=39;i++){
            var data =excel_sheet.Cells(i,1).Value;
            if(data =='PTE' && excel_sheet.Cells(i,2).Value =='NWPFE_AUTH'){
                excel_sheet.Cells(i,4).Value ='Yes';
                console.info(excel_sheet.Cells(i,4).Value);
            }
        }
         console.info(data);
         excel.Workbooks.Close=true;
        //var shell = new ActiveXObject("WScript.Shell");
        //shell.Exec("wscript C:\\Automation\\regression\\MDF.xlsx"); 
}

function runVBS() {
        alert('Inside Run VBS');
        var shell = new ActiveXObject("WScript.Shell");
        shell.Exec("wscript C:\\Automation\\Execute.vbs"); 
}

//according menu

$(document).ready(function()
{
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
		if($(this).is('.inactive-header')) {
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