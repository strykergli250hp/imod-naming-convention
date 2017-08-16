/*

Server Info JS

Resolves server host hardware information based on naming convention.
Source: https://disney.service-now.com/nav_to.do?uri=%2Fkb_view.do%3Fsysparm_article%3DKB0014412

SAPIE003
Jul. 17th, 2017

a subtle change

*/

function evalServerHostInfo() {
	
	resetValues();
	
	var server_host_name = document.getElementById("server_host_name").value.trim();
	
	log("server_host_name = '" + server_host_name + "'");
	
	// evaluate the name composition, e.g. if it has primary and secondary naming
	// smallest possible length is 13 chars
	
	var len = server_host_name.length;
	
	var validInput = false;
	
	if (len < 13) {
		log('invalid input');
		
		validInput = false;
		
	} else if (len == 13 || len == 14) {
		log('primary expected');
		
		var primary = server_host_name;
		
		processPrimary(primary);
		setSecondary('-');
		
		validInput = true;
		
	} else if (len > 14) {
		log('primary and secondary expected');
		
		var pos = server_host_name.indexOf('-');
		
		// valid positions
		if (pos == 13 || pos == 14) {
			var primary = server_host_name.substring(0, pos);
			var secondary = server_host_name.substring(pos + 1, server_host_name.length);
			log("secondary = '" + secondary + "'");
			processPrimary(primary);
			processSecondary(secondary);
			validInput = true;
		} else {
			log('invalid input');
			validInput = false;
		}
	}
	
	if (validInput) {
		showInfo();
	} else {
		resetValues();
		showInvalidInputDiv();
	}
	
}



/*
Processes primary hardware naming convention
*/
function processPrimary(primary) {
	
	log("primary = '" + primary + "'");
	
	evalLocation(primary);
	evalServerType(primary);
	evalServerEnvironment(primary);
	evalServerUsage(primary);
	evalHardwareType(primary);
	evalServerPurpose(primary);
	evalServerNumber(primary);
	evalClusterNodeDesignation(primary);
	
	
}

/*
Processes secondary hardware naming convention
*/
function processSecondary(secondary) {
	
	secondary = secondary.toUpperCase();
	
	log("secondary = '" + secondary + "'");
	
	var secondaryText = '';
	
	if (secondary.startsWith('B') && secondary.length == 1) {
		secondaryText = 'Backup Interface'
	} if (secondary.startsWith('R') && secondary.length == 1) {
		secondaryText = 'RILO Interface'
	} else if (secondary.startsWith('M') && secondary.length == 3) {
		// it must have two-digit number
		var numberId = secondary.substring(1, 3);
		
		if (isNumeric(numberId)) {
			secondaryText = 'Management Port #' + numberId;
		} else {
			log('Not numeric');
		}
	} else if (secondary.startsWith('VC') && secondary.length == 3) {
		// it must have one-digit number
		var numberId = secondary.substring(2, 3);
		
		if (isNumeric(numberId)) {
			secondaryText = 'C7000 Flex-10 Module #' + numberId;
		} else {
			log('Not numeric');
		}
	} else if (secondary.startsWith('V') && secondary.length == 3) {
		// it must have two-digit number
		var numberId = secondary.substring(1, 3);
		
		if (isNumeric(numberId)) {
			secondaryText = 'vMotion Interface #' + numberId;
		} else {
			log('Not numeric');
		}
	} else if (secondary.startsWith('OA') && secondary.length == 3) {
		// it must have one-digit number
		var numberId = secondary.substring(2, 3);
		
		if (isNumeric(numberId)) {
			secondaryText = 'C7000 On-Board Interface #' + numberId;
		} else {
			log('Not numeric');
		}
	} else if (secondary.startsWith('SAS') && secondary.length == 4) {
		// it must have one-digit number
		var numberId = secondary.substring(3, 4);
		
		if (isNumeric(numberId)) {
			secondaryText = 'C7000 SAS Module #' + numberId;
		} else {
			log('Not numeric');
		}
	}
	
	setSecondary(secondaryText);
	
}



/* ++++++++++++++++ Location ++++++++++++++++ */

function evalLocation(primary) {
		
	var code = primary.substring(0, 4).toUpperCase();
	
	var value = getLocationValue(code);
	
	appendPrimary(value);
	setTextInElement("location", code, value);
	
}

function getLocationValue(code) {
	
	var value = '';
	
	switch (code) {
		case 'CAAN': value = 'California Anaheim Data Center'; break;
		case 'CABU': value = 'California Burbank Data Center'; break;
		case 'CACA': value = 'California Adventures'; break;
		case 'CADL': value = 'California Disneyland'; break;
		case 'CLCE': value = 'Disney Cruise Lines - Celebration'; break;
		case 'CLDS': value = 'Disney Cruise Lines - Dreams (Ship)'; break;
		case 'CLFS': value = 'Disney Cruise Lines - Fantasy (Ship)'; break;
		case 'CLMS': value = 'Disney Cruise Lines - Magic (Ship)'; break;
		case 'CLWS': value = 'Disney Cruise Lines - Wonder (Ship)'; break;
		case 'FLDC': value = 'Florida Data Center'; break;
		case 'FLDD': value = 'Florida Downtown Disney'; break;
		case 'FLEP': value = 'Florida Epcot'; break;
		case 'FLFA': value = 'Florida Feature Animation'; break;
		case 'FLHS': value = 'Florida Hollywood Studios'; break;
		case 'FLMK': value = 'Florida Magic Kingdom'; break;
		case 'FLVB': value = 'Florida Vero Beach'; break;
		case 'HIKA': value = 'Hawaii Kapolei (Aulani)'; break;
		case 'NCKM': value = 'North Carolina King Mountain'; break;
		case 'SCHH': value = 'South Carolina Hilton Head'; break;
		case 'CHDC': value = 'China - Shanghai Data Center'; break;
		case 'CHDL': value = 'China - Shanghai Disneyland'; break;
		case 'FRDC': value = 'Paris Data Center'; break;
		case 'FRDL': value = 'Paris Disneyland'; break;
		case 'FRSP': value = 'Paris Studios Park'; break;
		case 'HKDC': value = 'Hong Kong Data Center'; break;
		case 'HKDL': value = 'Hong Kong Disneyland'; break;
		case 'JPDC': value = 'Tokyo Data Center'; break;
		case 'JPDL': value = 'Tokyo Disneyland'; break;
		case 'JPDS': value = 'Tokyo DisneySea'; break;
		default:
			log('Invalid or unknown code: ' + code);
	}
	
	log('@getLocationValue(' + code + ') = ' + value);
	
	return value;
	
}


/* ++++++++++++++++ Server Type ++++++++++++++++ */


function evalServerType(primary) {
		
	var code = primary.substring(4, 5).toUpperCase();
	
	var value = getServerTypeValue(code);
	
	appendPrimary(value);
	setTextInElement("server_type", code, value);
	
}

function getServerTypeValue(code) {
	
	var value = '';
	
	switch (code) {
		case 'P': value = 'Physical'; break;
		case 'R': value = 'Cluster Resource'; break;
		case 'V': value = 'Virtual'; break;
		default:
			log('Invalid or unknown code: ' + code);
	}
	
	log('@getServerTypeValue(' + code + ') = ' + value);
	
	return value;
	
}


/* ++++++++++++++++ Server Environment ++++++++++++++++ */


function evalServerEnvironment(primary) {
		
	var code = primary.substring(5, 6).toUpperCase();
	
	var value = getServerEnvironmentValue(code);
	
	appendPrimary(value);
	setTextInElement("server_environment", code, value);
	
}

function getServerEnvironmentValue(code) {
	
	var value = '';
	
	switch (code) {
		case 'D': value = 'Development'; break;
		case 'F': value = 'Function Test/Bashful/Sleepy/UAT/UAT3'; break;
		case 'I': value = 'Production-Fix/Grumpy'; break;
		case 'P': value = 'Production'; break;
		case 'Q': value = 'QA/Stress/DOC/ORT/ORT2'; break;
		case 'R': value = 'Training'; break;
		case 'S': value = 'Stress'; break;
		default:
			log('Invalid or unknown code: ' + code);
	}
	
	log('@getServerEnvironmentValue(' + code + ') = ' + value);
	
	return value;
	
}



/* ++++++++++++++++ Server Usage ++++++++++++++++ */

function evalServerUsage(primary) {
		
	var code = primary.substring(6, 7).toUpperCase();
	
	var value = getServerUsageValue(code);
	
	appendPrimary(value);
	setTextInElement("server_usage", code, value);
	
}

function getServerUsageValue(code) {
	
	var value = '';
	
	switch (code) {
		case 'C': value = 'Clustered'; break;
		case 'L': value = 'Load-Balanced'; break;
		case 'S': value = 'Standalone'; break;
		default:
			log('Invalid or unknown code: ' + code);
	}
	
	log('@getServerUsageValue(' + code + ') = ' + value);
	
	return value;
	
}

/* ++++++++++++++++ Hardware Type ++++++++++++++++ */

function evalHardwareType(primary) {
		
	var code = primary.substring(7, 8).toUpperCase();
	
	var value = getHardwareTypeValue(code);
	
	appendPrimary(value);
	setTextInElement("hardware_type", code, value);
	
}

function getHardwareTypeValue(code) {
	
	var value = '';
	
	switch (code) {
		case 'E': value = 'Enclosure'; break;
		case 'H': value = 'HP'; break;
		case 'I': value = 'Isilon'; break;
		case 'L': value = 'Linux'; break;
		case 'N': value = 'Network'; break;
		case 'W': value = 'Windows'; break;
		case 'V': value = 'Hypervisor'; break;
		default:
			log('Invalid or unknown code: ' + code);
	}
	
	log('@getHardwareTypeValue(' + code + ') = ' + value);
	
	return value;
	
}

/* ++++++++++++++++ Server Purpose ++++++++++++++++ */

function evalServerPurpose(primary) {
		
	var code = primary.substring(8, 9).toUpperCase();
	
	var value = getServerPurposeValue(code);
	
	appendPrimary(value);
	setTextInElement("server_purpose", code, value);
	
}

function getServerPurposeValue(code) {
	
	var value = '';
	
	switch (code) {
		case 'A': value = 'Application'; break;
		case 'D': value = 'Database'; break;
		case 'H': value = 'Hardware'; break;
		case 'N': value = 'Network'; break;
		case 'P': value = 'Appliance'; break;
		case 'S': value = 'Storage'; break;
		default:
			log('Invalid or unknown code: ' + code);
	}
	
	log('@getServerPurposeValue(' + code + ') = ' + value);
	
	return value;
	
}

/* ++++++++++++++++ Server Number ++++++++++++++++ */

function evalServerNumber(primary) {
		
	var value = primary.substring(9, 13).toUpperCase();
	
	appendPrimary('#' + value);
	setTextInElement("server_number", '#', value);
	
}

/* ++++++++++++++++ Cluster Node Designation ++++++++++++++++ */

function evalClusterNodeDesignation(primary) {
		
	var value = primary.substring(13, 14).toUpperCase();
		
	appendPrimaryNoSpace(value);
	setTextInElement("cluster_node", '-', value);
	
}



/* ++++++++++++++++ Utils ++++++++++++++++ */


/* Util */
function log(message) {
	if (true) {
		console.log(message);
	}
}

/* Util */
function resetValues() {
	
	// descriptions
	//document.getElementById('hardware_description').innerHTML = '';
	document.getElementById('primary_information').innerHTML = '';
	document.getElementById('secondary_information').innerHTML = '';
	
	
	// breakdown
	document.getElementById('location_code').innerHTML = 
	document.getElementById('location_value').innerHTML = 
	
	document.getElementById('server_type_code').innerHTML = 
	document.getElementById('server_type_value').innerHTML = 
	
	document.getElementById('server_environment_code').innerHTML = 
	document.getElementById('server_environment_value').innerHTML = 
	
	document.getElementById('server_usage_code').innerHTML = 
	document.getElementById('server_usage_value').innerHTML = 
	
	document.getElementById('hardware_type_code').innerHTML = 
	document.getElementById('hardware_type_value').innerHTML = 
	
	document.getElementById('server_purpose_code').innerHTML = 
	document.getElementById('server_purpose_value').innerHTML = 
	
	document.getElementById('server_number_code').innerHTML = 
	document.getElementById('server_number_value').innerHTML = 
	
	document.getElementById('cluster_node_code').innerHTML = 
	document.getElementById('cluster_node_value').innerHTML = 'Unknown';
	
	hideDivs();
	
}



/* Util */
function appendPrimary(value) {
	document.getElementById('primary_information').innerHTML = 
	document.getElementById('primary_information').innerHTML + ' ' + value;
}

/* Util */
function appendPrimaryNoSpace(value) {
	document.getElementById('primary_information').innerHTML = 
	document.getElementById('primary_information').innerHTML + value;
}

/* Util */
function setSecondary(value) {
	document.getElementById('secondary_information').innerHTML = value;
}

/* Util */
function setTextInElement(elementId, code, value) {
	document.getElementById(elementId + '_code').innerHTML = code;
	document.getElementById(elementId + '_value').innerHTML = value;
}

/* Util */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/* Util */
function showInvalidInputDiv() {
	document.getElementById('invalid_input').style.display = 'block';
	fadeIn('invalid_input');
}

/* Util */
function showInfo() {
	document.getElementById('information_section').style.display = 'block';
	fadeIn('information_section');
}

/* Util */
function clearInfo() {
	document.getElementById("server_host_name").value = '';
	fadeOut('information_section');
	fadeOut('invalid_input');
}

function hideDivs() {
	document.getElementById('information_section').style.display = 'none';
	document.getElementById('invalid_input').style.display = 'none';
}

/* Util */
function fadeIn(elementId) {
	
	var el = document.getElementById(elementId);
	el.style.opacity = 0;
	
	var tick = function() {
		el.style.opacity = +el.style.opacity + 0.15;
		
		if (+el.style.opacity < 1) {
			(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		}
	};
	tick();
}

/* Util */
function fadeOut(elementId) {
	
	var el = document.getElementById(elementId);
	el.style.opacity = 1;
	
	var tick = function() {
		el.style.opacity = +el.style.opacity - 0.40;
		
		if (+el.style.opacity > 0) {
			(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		}
	};
	tick();
}