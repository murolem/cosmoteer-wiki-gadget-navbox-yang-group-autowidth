/**
 * The name of this gadget. Used in other variables.
 */
export var gadgetName = 'gadget-navbox-yang-group-autowidth';

/**
 * A banner to append at the start of each generated file.
 * 
 * For this to work, the `pluginBunner` vite plugin must be enabled.
 * If it's not enabled, this won't be appended.
 */
export var banner = [
    '/*',
    ' * gadget: Provides an automatic width calculation of {{Navbox}} group.',
    ' * authors: aliser.',
    ' * documentation and master version: https://github.com/murolem/cosmoteer-wiki-gadget-navbox-yang-group-autowidth',
    ' * license: MIT',
    '*/',
    '' // additional spacing between the banner and the code
].join('\n');

/**
 * The prefix used by the logger in `lib/log.ts`.
 */
export var loggerPrefix = gadgetName;

/** 
 * The prefix to append to css class names.
 * 
 * For this to work, the `PostcssModulesPlugin` vite postcss plugin must be enabled.
 * If it's not enabled, css class names will remain the same.
 */
export var cssPrefix = `${gadgetName}--`;

