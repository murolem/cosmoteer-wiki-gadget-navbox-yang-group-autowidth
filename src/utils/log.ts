import { loggerPrefix as logPrefix } from '$src/preset';

/**
 * Returns an instance of an object containing logging functions.
 * 
 * Prepends a prefix defined in `preset.ts` → `loggerPrefix` to each message. 
 */
export function getLoggers() {
    return {
        /**
         * Log messages using `console.log`.
         * @param message First message to log.
         * @param moreMessages Any additional messages to log.
         */
        logInfo: (message: string | number, moreMessages?: any[]) => {
            console.log.apply(null, [`[${logPrefix}] ${message}`].concat(moreMessages ?? []));
        },

        /**
        * Log warning messages using `mw.log.warn`.
        * @param message First message to log.
        * @param moreMessages Any additional messages to log.
        */
        logWarn: (message: string | number, moreMessages?: any[]) => {
            mw.log.warn.apply(null, [`[${logPrefix}] ${message}`].concat(moreMessages ?? []));
        },

        /**
         * Log error messages using `mw.log.error`.
         * @param message First message to log.
         * @param moreMessages Any additional messages to log.
         * @param opts Options.
         */
        logError: (message: string | number, moreMessages?: any[], opts?: Partial<{
            /** Whether to throw an error, stopping execution.
             * @default false
             */
            throwErr: boolean
        }>) => {
            var defaulOpts: Required<typeof opts> = {
                throwErr: false
            }
            // override any default opts with any provided ones
            opts = Object.assign(defaulOpts, opts ?? {});

            mw.log.error.apply(null, [`[${logPrefix}] ${message}`].concat(moreMessages ?? []));
            if (opts.throwErr) {
                throw new Error(`[${logPrefix}] an error occured - see output above for details`);
            }
        },
    }
}
