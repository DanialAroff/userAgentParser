window.userAgentParser = {
    getDeviceInfo: async function() { 
        var v_userAgent = navigator.userAgent;
        var v_browserName = "Unknown";
        var v_browserVersion = "Unknown";
        var v_osName = "Unknown";
        var v_osVersion = "Unknown";
        var v_deviceType = "Unknown";
        var v_deviceManufacturer = "Unknown";
        var v_deviceModel = "Unknown";

        // Browser Detection
        if (v_userAgent.includes("Chrome") && !v_userAgent.includes("Edg") && !v_userAgent.includes("OPR")) {
            v_browserName = "Chrome";
            var chromeMatch = v_userAgent.match(/Chrome\/(\d+)/);
            v_browserVersion = chromeMatch && chromeMatch[1] || "Unknown";
        } else if (v_userAgent.includes("Edg")) {
            v_browserName = "Edge";
            var edgeMatch = v_userAgent.match(/Edg\/(\d+)/);
            v_browserVersion = edgeMatch && edgeMatch[1] || "Unknown";
        } else if (v_userAgent.includes("Safari") && !v_userAgent.includes("Chrome")) {
            v_browserName = "Safari";
            var safariMatch = v_userAgent.match(/Version\/(\d+)/);
            v_browserVersion = safariMatch && safariMatch[1] || "Unknown";
        } else if (v_userAgent.includes("Opera") || v_userAgent.includes("OPR")) {
            v_browserName = "Opera";
            var operaMatch = v_userAgent.match(/(?:Opera|OPR)\/(\d+)/);
            v_browserVersion = operaMatch && operaMatch[1] || "Unknown";
        } else if (v_userAgent.includes("Firefox")) {
            v_browserName = "Firefox";
            var firefoxMatch = v_userAgent.match(/Firefox\/(\d+)/);
            v_browserVersion = firefoxMatch && firefoxMatch[1] || "Unknown";
        }

        if (navigator.userAgentData) {
            var uad = {};
            try {
                uad = await navigator.userAgentData.getHighEntropyValues(['architecture', 'model', 'platformVersion', 'uaFullVersion']);
            } catch (e) {
                console.error('N/A');
            }
            // OS Detection
            v_osName = uad.platform;
            var platformVersion = uad.platformVersion;
            if (v_osName === "Windows") {
                platformVersion = parseInt(platformVersion.split('.')[0]);
                if (platformVersion >= 13) {
                    v_osVersion = '11';
                } else if (platformVersion > 0) {
                    v_osVersion = '10';
                } else {
                    var windowsMatch = v_userAgent.match(/Windows NT (\d+(\.\d+)?)/);
                    v_osVersion = windowsMatch && windowsMatch[1] || "Unknown";
                }
            } else {
                v_osVersion = uad.platformVersion;
            }

            // Device detection
            v_deviceModel = uad.model ? uad.model : "Unknown";
        } else {
            // OS Detection
            if (v_userAgent.includes("Android")) {
                v_osName = "Android";
                var androidMatch = v_userAgent.match(/Android (\d+(\.\d+)?)/);
                v_osVersion = androidMatch && androidMatch[1] || "Unknown";
            } else if (/iPhone|iPad|iPod/.test(v_userAgent)) {
                v_osName = "iOS";
                var iosMatch = v_userAgent.match(/OS (\d+(_\d+)?)/);
                v_osVersion = iosMatch && iosMatch[1] ? iosMatch[1].replace("_", ".") : "Unknown";
            } else if (v_userAgent.includes("Windows NT")) {
                v_osName = "Windows";
                var windowsMatch = v_userAgent.match(/Windows NT (\d+(\.\d+)?)/);
                v_osVersion = windowsMatch && windowsMatch[1] || "Unknown";
            } else if (v_userAgent.includes("Mac OS X")) {
                v_osName = "Mac OS";
                var macMatch = v_userAgent.match(/Mac OS X (\d+(_\d+)?)/);
                v_osVersion = macMatch && macMatch[1] ? macMatch[1].replace("_", ".") : "Unknown";
            } else if (v_userAgent.includes("Linux")) {
                v_osName = "Linux";
                v_osVersion = "Unknown"; // Linux distributions don't usually report versions in the user agent
            }
        }

        // Device Type Detection
        if (/Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini|IEMobile|Mobile/.test(v_userAgent)) {
            v_deviceType = "Mobile";
        } else if (/Tablet|iPad|PlayBook|Nexus 7|Nexus 10|Silk/.test(v_userAgent)) {
            v_deviceType = "Tablet";
        } else {
            v_deviceType = "Desktop";
        }

        // Device Information Object
        var v_deviceInfo = {
            browsername: v_browserName,
            browserversion: v_browserVersion,
            osname: v_osName,
            osversion: v_osVersion,
            devicetype: v_deviceType,
            devicemanufacturer: v_deviceManufacturer,
            devicemodel: v_deviceModel
        };

        return v_deviceInfo;
    }
};