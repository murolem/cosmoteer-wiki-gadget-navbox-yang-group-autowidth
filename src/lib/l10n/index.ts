// export function l10n() {

// }



// // localization function.
// // you can remove it if you don't use it.
// export const l10n = (() => {
//     var strings = {
//         'label': {
//             'en': 'Purge Cache'
//         }
//     } satisfies Record<string, Record<'en' & string, string>>;
//     type Strings = typeof strings;
//     type Lang = keyof Strings[keyof Strings];

//     var lang: Lang = (() => {
//         var result = mw.config.get('wgUserLanguage');
//         return result in strings ? (result as Lang) : 'en';
//     })();

//     return (key: string) => {
//         if (key in strings) {
//             if (lang in strings[key as keyof Strings]) {
//                 return strings[key as keyof Strings][lang];
//             } else {
//                 // no lang available, fallback to "en", which is always present
//                 // by enforcing the type on "strings".
//                 return strings[key as keyof Strings]['en'];
//             }
//         } else {
//             // no key found
//             console.error(`[l10n][${logPrefix}] translation not found for key: ${key}`);
//             return '__UNKNOWN_KEY__';
//         }
//     }
// })();