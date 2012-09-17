﻿// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511

var authenticationData;

(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/tests/ImageGetListBySearch/ImageGetListBySearch.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            authenticationData = options;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();

function imageGetListBySearch() {
    var stParam = document.getElementById("stParam").value;
    var pageParam = document.getElementById("pageParam").value;
    
    var fromDatePicker = document.getElementById("datefromParam").winControl;
    var datefromParam = fromDatePicker.current;

    var toDatePicker = document.getElementById("datetoParam").winControl;
    var datetoParam = toDatePicker.current;

    var params = {};

    //this parameter cannot have blank spaces.
    params.string = stParam || undefined;
    params.page = pageParam || undefined;
    params.datefrom = datefromParam || undefined;
    params.dateto = datetoParam || undefined;
    
    var client = new PhotosServiceClient(
        authenticationData.username, authenticationData.password, authenticationData.accessKey);

    client.asyncImageGetListBySearch(params).then(function (resultText) {
        var resultDiv = document.getElementById("imageGetListBySearchResult");

        resultDiv.innerHTML = resultText;
        
    });
}
