<html>
<head>
 	<link rel="stylesheet" href="jquery-ui.css" />    
    <link rel="stylesheet" href="jquery.dataTables.min.css"/>	 
	<script src="jquery-3.3.1.js"> </script><!-- Latest compiled and minified CSS -->
    <script src="jquery.dataTables.min.js"></script>    
    <script src="jquery-ui.min.js"></script>   
    <script>
    	function goAhead(t) {
    		console.log("this" + t);
    		var xhttp;
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                 if (this.readyState == 4 && this.status == 200){
                     /* json= JSON.parse(this.responseText); */
//                     console.log(document.getElementById("tttopic").value);
//                     console.log(json.data);
                     if (t == "student") {
             			window.location.replace("StudentHome");
             		}
             		else if (t == "instructor"){
             			window.location.replace("InstructorHome");
             		}
             		else window.location.replace("TAHome");
//                     console.log(document.getElementById("tttopic").value);
                 }
            }
            xhttp.open("GET", "Home?role="+t, true);
            xhttp.send();
    		
    	}
    </script>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Homepage</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">


    <link rel="stylesheet" href="assets/css/fonticons.css">
    <link rel="stylesheet" href="assets/css/slider-pro.css">
    <link rel="stylesheet" href="assets/css/stylesheet.css">
    <link rel="stylesheet" href="assets/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">


    <!--For Plugins external css-->
    <link rel="stylesheet" href="assets/css/plugins.css" />

    <!--Theme custom css -->
    <link rel="stylesheet" href="assets/css/style.css">

    <!--Theme Responsive css-->
    <link rel="stylesheet" href="assets/css/responsive.css" />

    <!-- <script src="assets/js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script> -->
</head>
<body data-spy="scroll" data-target=".navbar-collapse">
	<!-- <div class='preloader'><div class='loaded'>&nbsp;</div></div> -->
        <header id="main_menu" class="header navbar-fixed-top">            
            <div class="main_menu_bg">
                <div class="container">
                    <div class="row">
                        <div class="nave_menu">
                            <nav class="navbar navbar-default" id="navmenu">
                                <div class="container-fluid">
                                    <!-- Brand and toggle get grouped for better mobile display -->
                                    <!-- <div class="navbar-header">
                                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false" onClick=goBack()>
                                            <span class="sr-only">Toggle navigation</span>
                                            <span class="icon-bar"></span>
                                            <span class="icon-bar"></span>
                                            <span class="icon-bar"></span>
                                        </button>
                                        <button type="button" onClick="window.location.replace('Home')" class="btn">
                                            Home
                                        </button>
                                        
                                    </div> -->

                                    <!-- Collect the nav links, forms, and other content for toggling -->

                                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                        <ul class="nav navbar-nav navbar-right">
                                            <button type="button" class="btn" align="right" onClick="window.location.replace('LogoutServlet')">
                                            	Logout 
                                        	</button>
                                        
                                        </ul>    
                                    </div>

                                    

                                </div>
                            </nav>
                        </div>  
                    </div>

                </div>

            </div>
        </header> <!--End of header -->
<!--     <div class='preloader'><div class='loaded'>&nbsp;</div></div>
 -->    
    <p id="error" style="color:red"></p>


        <!-- Contact Section -->
        <section id="contact" class="contactus margin-top-120">
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="main_contact sections">
                            <div class="head_title text-center">
                                <h1 id="heading">Choose your role:</h1>
                            </div>

                            <br><br>
                            <div id="content" align="center">
                            <button type="button" onClick="goAhead('student')" class="btn">Student</button>
                            </div> 
                            
                            <div id="content" align="center">
                            <button type="button" onClick="goAhead('instructor')" class="btn">Instructor</button>
                            </div> 
                            
                            <div id="content" align="center">
                            <button type="button" onClick="goAhead('TA')" class="btn">TA</button>
                            </div> 

                    </div>
                </div><!-- End of row -->
            </div><!-- End of container -->
        </section><!-- End of contact Section -->


       
        <!-- footer section -->
        <footer id="footer" class="footer">
            <div class="container">
                <div class="main_footer">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="copyright_text text-center">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div><!-- End of container -->
        </footer><!-- End of footer Section-->



    
	<div class="scrollup">
        <a href="#"><i class="fa fa-chevron-up"></i></a>
    </div>

    <script src="assets/js/vendor/bootstrap.min.js"></script>
    <script src="assets/js/jquery.easing.1.3.js"></script>
    
    <!-- <script src="assets/js/vendor/jquery-1.11.2.min.js"></script> -->
    <!-- <script src="http://maps.google.com/maps/api/js"></script>
    <script src="assets/js/gmaps.min.js"></script>
    <script>
        var map = new GMaps({
            el: '.ourmap',
            lat: -12.043333,
            lng: -77.028333,
            scrollwheel: false,
            zoom: 15,
            zoomControl: true,
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            overviewMapControl: false,
            clickable: false,
            styles: [{'stylers': [{'hue': '#000'}, {saturation: -200},
                        {gamma: 0.50}]}]
        });
        map.addMarker({
            lat: -12.043333,
            lng: -77.028333
        });
    </script>
     --><script src="assets/js/plugins.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>