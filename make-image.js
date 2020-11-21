
if (typeof makeImage === 'undefined') {
	var makeImage = {};
}

makeImage.draw = (function() {

    var sprintLogo = new Image(), konaLogo = new Image(), olympicLogo = new Image(), halfLogo = new Image();
    sprintLogo.src = "sprint_logo.jpg";
    konaLogo.src = "kona_logo.png";
    olympicLogo.src = "olympic_logo.png";
		halfLogo.src = "703_logo.png";

    var userImage = new Image();

    var $uploadCrop;

    function createImage() {
        var context = $("#myCanvas")[0].getContext("2d");

        var raceType = $("input:radio[name='raceRadios']:checked").val();

        //Set the style. Default to PPF colors
        var backgroundColor = "black";
        var pictureBoarderColor = "#86764d"
        var rowColor1 = "#86764d"
        var rowColor2 = "#726342"

        if (raceType == "kona-challenge") {
            backgroundColor = "#00C2D2";
            pictureBoarderColor = "white";
            rowColor1 = "#456BAA"
            rowColor2 = "#00C2D2"
        } else if (raceType == "ppf-70.3") {
						backgroundColor = "black";
						pictureBoarderColor = "#57859B";
						rowColor1 = "#B0C4C8";
						rowColor2 = "#57859B";
				}

        //Background
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, 600, 800);

        //Name box
        context.fillStyle = "white";
        context.fillRect(10, 490, 580, 100);

        //Picture border
        context.fillStyle = "white";
        context.fillRect(310, 197, 280, 280);
        context.fillStyle = pictureBoarderColor;
        context.fillRect(313, 200, 274, 274);

        //Results boxes
        context.fillStyle = "white";
        context.fillRect(10, 197, 280, 280);
        context.fillStyle = rowColor1;
        context.fillRect(15, 264, 270, 52);
        context.fillStyle = rowColor2;
        context.fillRect(15, 316, 270, 52);
        context.fillStyle = rowColor1;
        context.fillRect(15, 368, 270, 52);
        context.fillStyle = rowColor2;
        context.fillRect(15, 420, 270, 52);

        //Draw top logo
        if (raceType == "ppf-sprint") {
            context.drawImage(sprintLogo,0,0, 600, 187);
        } else if (raceType == "kona-challenge") {
            context.drawImage(konaLogo,0,0, 600, 187);
        } else if (raceType == "ppf-olympic") {
            context.drawImage(olympicLogo,0,0, 600, 187);
        } else if (raceType == "ppf-70.3") {
					  context.drawImage(halfLogo,0,0,600,187);
				}

        //Render their picture
        $('#upload-image').croppie('result', {
            type: 'canvas',
            size: 'viewport'
        }).then(function (resp) {
            userImage.src = resp;
            userImage.onload = function() {
                context.drawImage(userImage, 315, 202, 270, 270);
            }
        });

        //Draw Results Text
        context.font = "20pt Arial, Arial, Helvetica";
        context.textBaseline = "middle";
        context.textAlign = "left";
        context.fillStyle = "#ffffff"; // white text

        context.fillText("Swim", 35, 290);
        context.fillText(":", 120, 290);
        context.fillText(readValue("swim"), 150, 290);
        context.fillText("Bike", 35, 342);
        context.fillText(":", 120, 342);
        context.fillText(readValue("bike"), 150, 342);
        context.fillText("Run", 35, 394);
        context.fillText(":", 120, 394);
        context.fillText(readValue("run"), 150, 394);
        context.fillText("Total", 35, 446);
        context.fillText(":", 120, 446);
        context.fillText(calculateTotal(), 150, 446);

        //Align center for the name and results title
        context.fillStyle = "#000000"; // black text
        context.textAlign = "center";

        context.font = "30pt Arial, Arial, Helvetica";
        context.fillText("Results", 140, 232);

        //Grab the name and figure out 1 line or two
        var name = $("#nameInput").val();
        if (name.length > 20) {
            context.font = "30pt Arial, Arial, Helvetica";
            context.fillText(name.substr(0,name.indexOf(' ')), 300, 525);
            context.fillText(name.substr(name.indexOf(' ')+1), 300, 565);
        } else {
            context.font = "40pt Arial, Arial, Helvetica";
            context.fillText(name, 300, 545);
        }
    }

    function readFile(input) {
        if (input.files && input.files[0]) {
           var reader = new FileReader();

           reader.onload = function (e) {
               $('.upload-wrapper').addClass('ready');
               $uploadCrop.croppie('bind', {
                   url: e.target.result
               }).then(function(){
                   console.log('jQuery bind complete');
               });

           }

           reader.readAsDataURL(input.files[0]);
       }
       else {
           swal("Sorry - you're browser doesn't support the FileReader API");
       }
    }

    function readValue(type) {
        var hourId = "#" + type + "Hours";
        var minuteId = "#" + type + "Minutes";
        var secondId = "#" + type + "Seconds";

        return normalizeValue($(hourId).val()) + ":" + normalizeValue($(minuteId).val()) + ":"+ normalizeValue($(secondId).val());
    }

    function normalizeValue(val) {
        var intVal = parseInt(val);
        if (intVal == 0) {
            return "00";
        } else if (intVal < 10) {
            return "0" + intVal;
        } else {
            return intVal;
        }
    }

    function calculateTotal() {
        var hours = parseInt($("#swimHours").val()) + parseInt($("#bikeHours").val()) + parseInt($("#runHours").val());
        var minutes = parseInt($("#swimMinutes").val()) + parseInt($("#bikeMinutes").val()) + parseInt($("#runMinutes").val());
        var seconds = parseInt($("#swimSeconds").val()) + parseInt($("#bikeSeconds").val()) + parseInt($("#runSeconds").val());

        while (seconds >= 60) {
            minutes++;
            seconds-= 60;
        }

        while (minutes >= 60) {
            hours++;
            minutes-= 60;
        }

        return normalizeValue(hours) + ":" + normalizeValue(minutes) +":" + normalizeValue(seconds);
    }

    function validateInput() {
        $(".time-input").each( function(){
            if ($(this).val() == "" || isNaN(parseInt($(this).val()))) {
                $(this).val("0");
            }
        });
    }

    return {
		init: function() {
            $(document).on("click", "#submit-btn", function() {
                validateInput();
                createImage();
                $('#inputForm').attr('hidden', 'hidden');
                $('#resultPage').removeAttr('hidden');
            });


            $uploadCrop = $('#upload-image').croppie({
                viewport: {
                    width: 270,
                    height: 270,
                    type: 'square'
                }
            });

            $('#pictureUpload').on('change', function () { readFile(this); });

            $('#restart-btn').on('click', function() {
                $('#inputForm').removeAttr('hidden');
                $('#resultPage').attr('hidden', 'hidden');
            });
        }
    };
})();

$(document).ready(function() {
	makeImage.draw.init();
});
