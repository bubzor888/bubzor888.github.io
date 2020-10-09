
if (typeof makeImage === 'undefined') {
	var makeImage = {};
}

makeImage.draw = (function() {

    var logoImage = new Image();
    logoImage.src = "kona_logo.png";

    var userImage = new Image();

    var $uploadCrop;

    function createImage() {
        var context = $("#myCanvas")[0].getContext("2d");

        //Background
        context.fillStyle = "#00C2D2";
        context.fillRect(0, 0, 600, 800);

        //Name box
        context.fillStyle = "white";
        context.fillRect(10, 490, 580, 100);

        //Picture border
        context.fillStyle = "white";
        context.fillRect(310, 197, 280, 280);
        // context.fillStyle = "white";
        // context.fillRect(313, 200, 274, 274);

        //Results boxes
        context.fillStyle = "white";
        context.fillRect(10, 197, 280, 280);
        context.fillStyle = "#456BAA";
        context.fillRect(15, 264, 270, 52);
        context.fillStyle = "#00C2D2";
        context.fillRect(15, 316, 270, 52);
        context.fillStyle = "#456BAA";
        context.fillRect(15, 368, 270, 52);
        context.fillStyle = "#00C2D2";
        context.fillRect(15, 420, 270, 52);

        //Draw top logo
        context.drawImage(logoImage,0,0, 600, 187);

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
        context.font = "20pt Futura, Calibri, New Times Roman";
        context.textBaseline = "middle";
        context.textAlign = "left";
        context.fillStyle = "#ffffff"; // white text

        context.fillText("Swim", 35, 290);
        context.fillText(":", 140, 290);

        context.fillText(readValue("swim"), 175, 290);
        context.fillText("Bike", 35, 342);
        context.fillText(":", 140, 342);
        context.fillText(readValue("bike"), 175, 342);
        context.fillText("Run", 35, 394);
        context.fillText(":", 140, 394);
        context.fillText(readValue("run"), 175, 394);
        context.fillText("Total", 35, 446);
        context.fillText(":", 140, 446);
        context.fillText(calculateTotal(), 175, 446);

        //Align center for the name and results title
        context.fillStyle = "#000000"; // black text
        context.textAlign = "center";

        context.font = "30pt Futura, Calibri, New Times Roman";
        context.fillText("Results", 140, 232);
        
        //Grab the name and figure out 1 line or two
        var name = $("#nameInput").val();
        if (name.length > 20) {
            context.font = "30pt Futura, Calibri, New Times Roman";
            context.fillText(name.substr(0,name.indexOf(' ')), 300, 525);
            context.fillText(name.substr(name.indexOf(' ')+1), 300, 565);
        } else {
            context.font = "40pt Futura, Calibri, New Times Roman";
            context.fillText(name, 300, 545);
        }
    }

    function createImage_old() {
        var context = $("#myCanvas")[0].getContext("2d");

        //Background
        context.fillStyle = "black";
        context.fillRect(0, 0, 600, 800);

        //Name box
        context.fillStyle = "white";
        context.fillRect(10, 490, 580, 100);

        //Picture border
        context.fillStyle = "white";
        context.fillRect(310, 197, 280, 280);
        context.fillStyle = "#86764d";
        context.fillRect(313, 200, 274, 274);

        //Results boxes
        context.fillStyle = "white";
        context.fillRect(10, 197, 280, 280);
        context.fillStyle = "#86764d";
        context.fillRect(15, 264, 270, 52);
        context.fillStyle = "#726342";
        context.fillRect(15, 316, 270, 52);
        context.fillStyle = "#86764d";
        context.fillRect(15, 368, 270, 52);
        context.fillStyle = "#726342";
        context.fillRect(15, 420, 270, 52);

        //Draw top logo
        context.drawImage(logoImage,0,0, 600, 187);

        //Render their picture
        $('#upload-image').croppie('result', {
            type: 'canvas',
            size: 'viewport'
        }).then(function (resp) {
            userImage.src = resp;
            userImage.onload = function() {
                context.drawImage(userImage, 316, 203, 268, 268);
            }
        });

        //Draw Results Text
        context.font = "20pt Futura, Calibri, New Times Roman";
        context.textBaseline = "middle";
        context.textAlign = "left";
        context.fillStyle = "#ffffff"; // white text

        context.fillText("Swim", 35, 290);
        context.fillText(":", 140, 290);

        context.fillText(readValue("swim"), 175, 290);
        context.fillText("Bike", 35, 342);
        context.fillText(":", 140, 342);
        context.fillText(readValue("bike"), 175, 342);
        context.fillText("Run", 35, 394);
        context.fillText(":", 140, 394);
        context.fillText(readValue("run"), 175, 394);
        context.fillText("Total", 35, 446);
        context.fillText(":", 140, 446);
        context.fillText(calculateTotal(), 175, 446);

        //Align center for the name and results title
        context.fillStyle = "#000000"; // black text
        context.textAlign = "center";

        context.font = "30pt Futura, Calibri, New Times Roman";
        context.fillText("Results", 140, 232);
        
        //Grab the name and figure out 1 line or two
        var name = $("#nameInput").val();
        if (name.length > 20) {
            context.font = "30pt Futura, Calibri, New Times Roman";
            context.fillText(name.substr(0,name.indexOf(' ')), 300, 525);
            context.fillText(name.substr(name.indexOf(' ')+1), 300, 565);
        } else {
            context.font = "40pt Futura, Calibri, New Times Roman";
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

        return $(hourId).val() + ":" + $(minuteId).val() + ":"+ $(secondId).val();
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

        if (hours == 0) {
            hours = "00";
        }

        if (minutes == 0) {
            minutes = "00";
        }

        if (seconds == 0) {
            seconds = "00";
        }

        return hours + ":" + minutes +":" + seconds;
    }

    function validateInput() {
        $(".time-input").each( function(){ 
            if ($(this).val() == "") {
                $(this).val("00");
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