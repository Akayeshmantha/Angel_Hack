var prodit = ["Laptops", "Keyboards", "mouse", "PCs"];
var prodfur = ["Tables", "Chairs"];
var rules_it = [
    {
        filedName: "min_cost",
        displayName: "Minimum cost"
    },
    {
        filedName: "supplier_ratings",
        displayName: "supplier ratings"
    },
    {
        filedName: "service_period",
        displayName: "Service period"
    }
]

var obj = {

        industryName:"",
        productName:"",
        pre_rules:[],
        post_rules:[]       

    }

$(document).ready(function() {

    appendRules("#rules", rules_it);




    $(".rule").bind("click", function() {
        Index = $(this).attr("arrindex");
        appendContractDetails("#contractDetails", Index, rules_it)
    });

    $("#industry").change(function() {
        switch ($(this).val()) {
            case "it":
                appendToASelect("#product", prodit)
                break;
            case "office":
                appendToASelect("#product", prodfur)
                break;
        }
    });




});



 function submita(){
   
    var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:8090/insert",
  "method": "POST",
  "headers": {
    "content-type": "application/json",

  },
  "processData": false,
  "data": JSON.stringify(obj)
}

$.ajax(settings).done(function (response) {
  console.log("obj");
  console.log(obj)

   swal("Your order has been added to the Network", "", "success").then((value) => {
 location.reload();
});
});


}


function appendRules(ID, arr) {
    for (var x = 0; x < arr.length; x++) {
        $(ID).append('<div rule' + x + 'clicked="false" arrindex="' + x + '" class="card shadow-1 rule">' + arr[x].displayName + '</div>');
    }

}

function appendContractDetails(id, index, arr) {
    var attrValue = $("[rule" + index + "clicked]").attr("rule" + index + "clicked");
    if (!attrValue || attrValue == "false") {
        $(id).append(
            '<div id="ruleform' + index + '" class="row ruleform">' +
            '<div class="col-md-5">' +
            arr[index].displayName +
            '</div>' +
            '<div class="col-md-6">' +
            '<input displayname="'+arr[index].displayName+'" index="'+index+'" placeholder="Condition value"" id="element'+index+'" class="form-control input_n" name="' + arr[index].filedName + '" />' +
            '</div>' +
            '</div>'

        );
        $("[rule" + index + "clicked]").attr("rule" + index + "clicked", true);
        $("[rule" + index + "clicked]").addClass("disable_rule")
    } else {
        $("#ruleform" + index).remove();
        $("[rule" + index + "clicked]").attr("rule" + index + "clicked", false);
        $("[rule" + index + "clicked]").removeClass("disable_rule")
    }
}

var newRuleCount = 0; 
function CreateNewRule(id){
$(id).append(
            '<div class="row ruleform rulenew">' +
            '<div class="col-md-5">' +
              '<input name="newrulename'+newRuleCount+'" placeholder="Condition name" class="form-control rulenamet" />'+
            '</div>' +
            '<div class="col-md-6">' +
            '<input name="newrulevalue'+newRuleCount+'" placeholder="Condition value"  class="form-control rulevaluet" />' +
            '</div>' +
            '</div>'

        );

newRuleCount++;
}




var drop = $("input");
drop.on('dragenter', function(e) {
    $(".drop").css({
        "border": "4px dashed #09f",
        "background": "rgba(0, 153, 255, .05)"
    });
    $(".cont").css({
        "color": "#09f"
    });
}).on('dragleave dragend mouseout drop', function(e) {
    $(".drop").css({
        "border": "3px dashed #DADFE3",
        "background": "transparent"
    });
    $(".cont").css({
        "color": "#8E99A5"
    });
});



function handleFileSelect(evt) {
    // var files = evt.target.files; // FileList object

    // // Loop through the FileList and render image files as thumbnails.
    // for (var i = 0, f; f = files[i]; i++) {

    //   // Only process image files.
    //   if (!f.type.match('image.*')) {
    //     continue;
    //   }

    //   var reader = new FileReader();

    //   // Closure to capture the file information.
    //   reader.onload = (function(theFile) {
    //     return function(e) {
    //       // Render thumbnail.
    //       var span = document.createElement('span');
    //       span.innerHTML = ['<img class="thumb" src="', e.target.result,
    //                         '" title="', escape(theFile.name), '"/>'].join('');
    //       document.getElementById('list').insertBefore(span, null);
    //     };
    //   })(f);

    //   // Read in the image file as a data URL.
    //   reader.readAsDataURL(f);
    // }
}

$('#files').change(handleFileSelect);



function appendToASelect(id, arr) {

    $(id)
        .find('option')
        .remove()
        .end();
    for (var x = 0; x < arr.length; x++) {
        $(id).append('<option value="' + arr[x] + '">' + arr[x] + '</option>')
            .val(arr[x])

    }
    $(id).val(arr[0])


}


function generateSmartContract(){
    var industryName = $("#industry").val() == "it" ? "IT Products" : "Office Suplies";
    var productName = $("#product").val();
    var orderTitle = $("#order_title").val();
    var orderDesc = $("#order_desc").val();
    

    obj.industryName = industryName;
    obj.productName = productName;
   
    $("#contractDetails").find('.input_n')
        .each(function() {
            $("#pre_rules").append(
                '<div class="row">'+
                    '<div class="col-md-5">'+
                        $(this).attr("displayname")+
                    '</div>'+
                    '<div class="col-md-7">'+
                        $(this).val()+
                    '</div>'+
                '</div>' 
              )
obj.pre_rules.push(
      {
        displayName: $(this).attr("displayname"),
        value: $(this).val()
      }

  )


        });

  var nwVal = 0;
    $("#customRules").find('.rulenamet')
        .each(function() {
            $("#ruleNameC").append(
                '<div>'+
                    $(this).val()+
                '</div>' 
              )
obj.post_rules.push(
      {
        displayName: $(this).val(),
        value: ""
      }

  )


        }); 

            $("#customRules").find('.rulevaluet')
        .each(function() {
            $("#ruleValueC").append(
                '<div>'+
                    $(this).val()+
                '</div>' 
              )

            obj.post_rules[nwVal].value = $(this).val()
        });    


// ruleNameC
// ruleValueC


console.log(obj)
    $("#indestry-view").html(industryName)
    $("#product-view").html(productName)
$("#order_id_view").html( Math.floor((Math.random() * 99999) + 1))

$("#order_title_view").html(orderTitle);
$("#order_desc_view").html(orderDesc);

}



var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the crurrent tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {

  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...


    if(n == 1 && currentTab == 3){

        generateSmartContract();


    }



  if (currentTab >= x.length) {
    // ... the form gets submitted:
    submita();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  // var x, y, i, valid = true;
  // x = document.getElementsByClassName("tab");
  // y = x[currentTab].getElementsByTagName("input");
  // // A loop that checks every input field in the current tab:
  // for (i = 0; i < y.length; i++) {
  //   // If a field is empty...
  //   if (y[i].value == "") {
  //     // add an "invalid" class to the field:
  //     y[i].className += " invalid";
  //     // and set the current valid status to false
  //     valid = false;
  //   }
  // }
  // // If the valid status is true, mark the step as finished and valid:
  // if (valid) {
  //   document.getElementsByClassName("step")[currentTab].className += " finish";
  // }
  // return valid; // return the valid status

  return true;
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}