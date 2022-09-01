const isValid = function(value) {
    if (typeof(value) === 'undefined' || typeof(value) === null) {
        return false
    }
    if (typeof(value) === "number" && (value).toString().trim().length > 0) {
        return true
    }
    if (typeof(value) === "string" && (value).trim().length > 0) {
        return true
    }

}

module.exports.isValid = isValid;
