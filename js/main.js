/*
    File:           main.js
    Author:         Claudio Souza
    Date:           Jan 29th, 2020
    Description:    XML Project 1 (Load a XML document into a webpage. Validate the XML using a XML Schema.)    
*/

// Global Variable
let xmlDoc; 
let extXmlFile = "airport-one.xml";

// This function loads the XML document into the DOM
function loadXMLDoc() {
    // Get an XMLHttpRequest object
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Save the document node
            xmlDoc = this.responseXML;
            // Get Airport's name and DateTime Information
            loadInitialData();
        }
    };
    xmlhttp.open("GET", extXmlFile, true);
    xmlhttp.send();
}

// Load Initial Info (Headers)
function loadInitialData() {
    // Get the Airport name
    var airportNodes = xmlDoc.getElementsByTagName("airport");
    document.getElementById("airportName").innerHTML += (airportNodes[0].attributes[0].nodeName === "name") ? airportNodes[0].attributes[0].nodeValue : "wer";
    // Get Date and Time
    var h2 = "Updated: ";
    var lastUpdatedNodes = xmlDoc.getElementsByTagName("lastUpdated");
    
    for (let i = 0; i < lastUpdatedNodes.length; i++) {
        var date = lastUpdatedNodes[0].getElementsByTagName("date");
        var time = lastUpdatedNodes[0].getElementsByTagName("time");

        if (date.length > 0 && time.length > 0) {
            h2 += date[0].firstChild.nodeValue + " at " + time[0].firstChild.nodeValue;
        }
    }
    document.getElementById("dateTime").innerHTML = h2;
}

// Display a HTML table based on the XML fields / tags
function showFlights(flightTracker) {

    let table = "";
    let status = "";
    let flightsInfo = xmlDoc.getElementsByTagName(flightTracker);
    
    document.getElementById("info").innerHTML = (flightTracker === "arrival") ? "Arrivals" : "Departures";

    if (flightsInfo.length > 0) {
        // Header Table
        table += "<tr>";
        for (let i = 0; i < flightsInfo[0].childNodes.length; i++) {
            
            var flightChilds = flightsInfo[0].childNodes[i];

            if (flightChilds.nodeType === Node.ELEMENT_NODE) {
                // Check the fields' name and display it properly in the Table
                switch(flightChilds.nodeName) {
                    case "airline":
                        table += "<th><b>Airline</b></th>";
                        break;
                    case "flight":
                        table += "<th><b>Flight</b></th>";
                        break;
                    case "arrivingFrom":
                        table += "<th><b>Departing To</b></th>";
                        break;
                    case "departingTo":
                        table += "<th><b>Arriving From</b></th>";
                        break;  
                    case "scheduledTime":
                        table += "<th><b>Scheduled Time</b></th>";
                        break;
                    case "actualTime":
                        table += "<th><b>Actual Time</b></th>";
                        break;
                    case "status":
                        table += "<th><b>Status</b></th>";
                        break;
                    default:
                        table += "<th><b>" + flightChilds.nodeName + "</b></th>";
                }
            }
        }
        table += "</tr>";
            
        // It shows the data from XML to the Table (HTML)
        for (let i = 0; i < flightsInfo.length; i++) {  
            status = flightsInfo[i].getElementsByTagName("status")[0].firstChild.nodeValue;
            
            table += "<tr>";
            table += "<td>" + flightsInfo[i].getElementsByTagName("airline")[0].firstChild.nodeValue + "</td>";
            table += "<td>" + flightsInfo[i].getElementsByTagName("flight")[0].firstChild.nodeValue + "</td>";
            // Check Departure / Arrival Tag
            table += (flightTracker === 'departure') ? "<td>" + flightsInfo[i].getElementsByTagName("departingTo")[0].firstChild.nodeValue + "</td>" :
                "<td>" + flightsInfo[i].getElementsByTagName("arrivingFrom")[0].firstChild.nodeValue + "</td>";
                
            table += "<td>" + flightsInfo[i].getElementsByTagName("scheduledTime")[0].firstChild.nodeValue + "</td>";
            table += "<td>" + flightsInfo[i].getElementsByTagName("actualTime")[0].firstChild.nodeValue + "</td>";
            // Format some of the Status Tag accordingly
            if (status === "Late" || status === "Delayed") {table += "<td class=\"late\">" + status + "</td>"}
            else if (status === "Arrived") {table += "<td class=\"arrived\">" + status + "</td>"}
            else {table += "<td>" + status + "</td>"}
            
            table += "</tr>";            
        }   
    }
    document.getElementById("airportData").innerHTML = table;
}