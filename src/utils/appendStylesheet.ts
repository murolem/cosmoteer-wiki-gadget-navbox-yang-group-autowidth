/**
 * Appends a new stylesheet to the `head`. 
 * Returns the created element.
 */
export function appendStylesheet(contents: string) {
    return $(`<style>${contents}</style>`).appendTo('head');
}