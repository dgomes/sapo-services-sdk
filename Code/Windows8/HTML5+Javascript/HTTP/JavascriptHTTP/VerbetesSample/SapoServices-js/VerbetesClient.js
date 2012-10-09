﻿(function () {
    "use strict";

    WinJS.Namespace.define("Verbetes", {
        ServiceClient: WinJS.Class.define(
            function (username, password, accessKey) {

                if (!(username && password && accessKey))
                    throw "MUST provide username, password and accessKey";
                this.username = username;
                this.password = password;
                this.accessKey = accessKey;
                this.verbetesBaseUri = "https://services.sapo.pt/InformationRetrieval/Verbetes/";
            },
            {
                asyncWhoIs: function (params) {
                    var whoIsAllowedParams = ["name", "name_like", "job", "job_like", "date", "margin", "min", "format", "context",
                        "ESBAccessKey", "ESBUsername", "ESBPassword"];
                    if (params) {
                        //transform date to string with the correct format
                        if (params.date)
                            params.date = dateToString(params.date);

                        params.ESBUsername = username;
                        params.ESBPassword = password;
                        params.ESBAccessKey = accessKey;

                        var uri = new Windows.Foundation
                                .Uri(buildUri(this.verbetesBaseUri, params, whoIsAllowedParams, "WhoIs"));
                        uri = uri.absoluteCanonicalUri;
                        return WinJS.xhr({ type: "GET", url: uri })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }

                    throw "MUST specify parameters";
                },

                asyncGetPersonalities: function (params) {
                    var getPersonalitiesAllowedParams = ["min", "format", "ESBAccessKey", "ESBUsername", "ESBPassword"];
                    if (params) {
                        params.ESBUsername = username;
                        params.ESBPassword = password;
                        params.ESBAccessKey = accessKey;

                        var uri = new Windows.Foundation
                                .Uri(buildUri(this.verbetesBaseUri, params, getPersonalitiesAllowedParams, "GetPersonalities"));
                        uri = uri.absoluteCanonicalUri;
                        return WinJS.xhr({ type: "GET", url: uri })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify parameters";
                },

                asyncGetErgos: function (params) {
                    var getErgosAllowedParams = ["min", "format", "ESBAccessKey", "ESBUsername", "ESBPassword"];
                    if (params) {

                        params.ESBUsername = username;
                        params.ESBPassword = password;
                        params.ESBAccessKey = accessKey;

                        var uri = new Windows.Foundation
                                .Uri(buildUri(this.verbetesBaseUri, params, getErgosAllowedParams, "GetErgos"));
                        uri = uri.absoluteCanonicalUri;
                        return WinJS.xhr({ type: "GET", url: uri })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify parameters";
                },

                asyncGetEgoNet: function (params) {
                    var getEgoNetAllowedParams = ["depth", "minFrequencyEdges", "name", "beginDate", "endDate", "ESBAccessKey", "ESBUsername", "ESBPassword"];

                    if (params) {
                        //Convert dates to Strings
                        if (params.beginDate)
                            params.beginDate = dateToString(params.beginDate);
                        if (params.endDate)
                            params.endDate = dateToString(params.endDate);

                        params.ESBUsername = username;
                        params.ESBPassword = password;
                        params.ESBAccessKey = accessKey;

                        var uri = new Windows.Foundation
                                .Uri(buildUri(this.verbetesBaseUri, params, getEgoNetAllowedParams, "GetEgoNet"));
                        uri = uri.absoluteCanonicalUri;
                        return WinJS.xhr({ type: "GET", url: uri })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify parameters";
                },

                asyncGetCoOccurrencesTrends: function (params) {
                    var getCoOccurrencesTrendsAllowedParams = ["name1", "name2", "begin_date", "end_date", "format",
                        "ESBAccessKey", "ESBUsername", "ESBPassword"];
                    if (params) {
                        //Convert dates to Strings
                        if (params.begin_date)
                            params.begin_date = dateToString(params.begin_date);
                        if (params.end_date)
                            params.end_date = dateToString(params.end_date);

                        params.ESBUsername = username;
                        params.ESBPassword = password;
                        params.ESBAccessKey = accessKey;

                        var uri =
                            new Windows.Foundation
                                .Uri(buildUri(this.verbetesBaseUri, params, getCoOccurrencesTrendsAllowedParams, "GetCoOccurrencesTrends"));
                        uri = uri.absoluteCanonicalUri;
                        return WinJS.xhr({ type: "GET", url: uri })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify parameters";
                },

                asyncGetCoOccurrences: function (params) {
                    var getCoOcurrencesAllowedParams = ["name", "begin_date", "end_date", "format",
                        "ESBAccessKey", "ESBUsername", "ESBPassword"];
                    if (params) {
                        //Convert dates to Strings
                        if (params.begin_date)
                            params.begin_date = dateToString(params.begin_date);
                        if (params.end_date)
                            params.end_date = dateToString(params.end_date);

                        params.ESBUsername = username;
                        params.ESBPassword = password;
                        params.ESBAccessKey = accessKey;

                        var uri = new Windows.Foundation
                                .Uri(buildUri(this.verbetesBaseUri, params, getCoOcurrencesAllowedParams, "GetCoOccurrences"));
                        uri = uri.absoluteCanonicalUri;
                        return WinJS.xhr({ type: "GET", url: uri })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify parameters";
                }
            }
        )
    });


})();
// !Bug at xhr.getAllResponseHeaders()

//var contentLength = xhr.getAllResponseHeaders();
//if (xhr.status == 200 && contentLength > 0)
//    return xhr.responseText;

//var res = eval("(" + xhr.responseText + ")");

//var res1 = JSON.parse(xhr.responseText);