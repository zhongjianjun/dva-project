export function getToken(key) {
    if (document.cookie) {
        var arr = {};
        document.cookie.split(";").map(value => {
            value = value.trim();
            arr[value.substring(0, value.indexOf("="))] = value.substring(
                value.indexOf("=") + 1,
                value.length
            );
        });
        return arr[key]||arr;
    } else {
        return false;
    }
}