// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };
    var zoom = 12;
    var markers = [];
    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: zoom
    });
    var infoWindow = new google.maps.InfoWindow();
    var icon = 'img/red-camera-icon.png';

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            data.forEach(function(station) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(station.location.latitude),
                        lng: Number(station.location.longitude)
                    },
                    map: map,
                    label: station.cameralabel,
                    icon: icon,

                });
                markers.push(marker);
                google.maps.event.addListener(marker, 'click', function() {
                    map.panTo(this.getPosition());
                    var html = '<h2>' + station.cameralabel + '</h2>';
                    html += '<img src="' + station.imageurl.url + '"></img>';
                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                });
            });
        })
        .fail(function(error) {
            alert("Current camera is not available at this time. Please check back later.");
        })
        .always(function() {
            $('#ajax-loader').fadeOut();
        });

    $('#search').bind('search keyup', function() {
        var search = $('#search').val().toLowerCase();
        for (var i = 0; i < markers.length; ++i) {
            if(markers[i].label.toLowerCase().indexOf(search) == -1) {
                markers[i].setMap(null);
            } else {
                markers[i].setMap(map);
            }
        }
    });

    //resize map to always fit within current window size
    $(window).resize(function() {
        $('#map').height($(window).height() - $('#map').position().top - 20);
    });

    //close info window when click on map
    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });
});