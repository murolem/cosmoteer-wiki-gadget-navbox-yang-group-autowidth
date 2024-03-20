import { getLoggers } from '$utils/log';
var loggers = getLoggers();
var logError = loggers.logError;

/**
 * Removes "px" from the end of provided string.
 * 
 * If no "px" is found at the end, the provided string is returned as is.
 */
export function removePxFromStringEnd(str: string): string {
    if (str.endsWith('px')) {
        return str.slice(0, -2);
    } else {
        return str;
    }
}

/**
 * Removes "px" from the end of provided string and converts the resulting value to number (float).
 * 
 * @throws {Error} if no "px" is found at the end.
 */
export function removePxFromStringEndAndConvertToNumber(str: string): number {
    var result = removePxFromStringEnd(str);
    if (result.length === str.length) {
        // no "px" found → throw error
        logError(`expected "px" at the end of given string: ${str}`, [], { throwErr: true });
    }

    return parseFloat(result);
}