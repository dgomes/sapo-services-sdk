﻿// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511

var authenticationData;

(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/tests/getErgos/getErgos.html", {
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

function getErgos() {
    var minParam = document.getElementById("minParam").value;
    var formatParam = document.getElementById("formatParam").value;

    var params = {};
    params.min = minParam || undefined;
    params.format = formatParam || undefined;

    try {
        var client =
            new Verbetes.ServiceClient(authenticationData.username, authenticationData.password, authenticationData.accessKey);

        client.asyncGetErgos(params)
            .then(function (resultText) {
                var resultDiv = document.getElementById("getErgosResult");

                resultDiv.innerHTML = resultText;
            },
            function (e) {
                var exceptionName = e.name;
                var exceptionMessage = e.message;
            });
    }
    catch (e) {
        //Add catch exception logic here
        var exceptionName = e.name;
        var exceptionMessage = e.message;
    }
}