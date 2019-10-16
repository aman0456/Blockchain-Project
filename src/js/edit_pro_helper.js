function addSectionString(sectionName) {
	return "<div class=\"panel panel-info\" id=\"section-" + sectionName + "\">\n" + 
				"              <div class=\"panel-heading text-center\"><h2><strong>" + sectionName + "</strong></h2></div>"
				+ ""
				+ "<div class=\"panel-body\" id=\"sectionBody-" + sectionName + "\"></div></div>";
}

function getVerifier(username, status) {
	statusSymbol = "glyphicon";
	if (status) {
		statusSymbol = "glyphicon-ok"
	}
	return "<li class=\"list-group-item\" style=\"border: none;\">" + username + "   <span class=\"glyphicon " + statusSymbol + "\"></span><br/></li>";
}

function getPointEntryString(point) {
	var pointId = point[0];
	var pointHeading = point[1];
	var pointText = point[3];
	var pointDate = point[4];
	var final = "<div id=\"pointDiv" + pointId + "\">\n" + 
		"                  <div class=\"row\">\n" + 
		"                    <div class=\"col-lg-6\">\n" + 
		"                      <h3 id=\"acad1\"><strong>" + pointHeading + "</strong></h3>\n" + 
		"                    </div>\n" + 
		"                    <div class=\"col-lg-6\">\n" + 
		"                      <h3 class=\"text-right\">" + pointDate + "</h3>\n" + 
		"                    </div>\n" + 
		"                  </div>\n" + 
		"                  <p>\n" + 
		"                    " + pointText + "<br/>\n" + 
		"                  </p>\n" + 
		"                  <div class=\"row\">\n" + 
		"                    <div class=\"col-lg-6\">\n" + 
		"                      <button class=\"btn btn-primary\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapseverifylist-" + pointId + "\" aria-expanded=\"false\" aria-controls=\"collapseverifylist\">\n" + 
		"                       List of Verifiers\n" + 
		"                      </button>\n" + 
		"                      <div class=\"collapse\" id=\"collapseverifylist-" + pointId + "\">\n" + 
		"                        <div class=\"card card-body\">\n" +
		"							<ul class=\"list-group\" id=\"verifiers-" + pointId + "\"></ul>" +
		"                          <form class=\"form-inline\">\n" + 
		"                            <input class=\"form-control\" id=\"verifierToAdd-" + pointId + "\">\n" + 
		"                            <button type=\"button\" class=\"btn btn-primary\" onclick=\"App.addVerifier(" + pointId + ")\">Add</button>\n" + 
		"                          </form>\n" + 
		"                        </div>\n" + 
		"                      </div>\n" + 
		"                    </div>\n" + 
		"                    <div class=\"col-lg-6\">\n" + 
		"                      <button type=\"button\" class=\"btn btn-danger pull-right\" onclick=\"App.deletePoint(" + pointId + ")\">Delete</button>\n" + 
		"                    </div>\n" + 
		"                  </div>\n" + 
		"                </div>";
	return final;
}