function printFloat(n, precision) {
    // Make a float printable to a specific precision
    precision = Math.pow(10, precision)

    var index,
        str = "" + Math.floor(n * precision) / precision

    if (str.indexOf("e") >= 0) {
        // Holy moly! That's a crazy number! Oh well :)
        return str
    }

    // Pad the string on the right
    if ((index = str.indexOf(".")) < 0) {
        return str + ".000"
    }
    else {
        index = 4 - (str.length - index)
        while (index--) {
            str += "0"
        }
    }

    return str
}
