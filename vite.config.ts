import { defineConfig } from 'vite';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import fs from 'fs';
import Logger from '@aliser/logger';
const { logInfo, logError } = new Logger('vite-config');
import postcss from 'postcss';
import postcssNesting from 'postcss-nesting';
import autoprefixer from 'autoprefixer';
import PostcssModulesPlugin from 'postcss-modules';
import postcssPresetEnv from 'postcss-preset-env';
import postcssUtilities from 'postcss-utilities';
import postcssInlineSvg from 'postcss-inline-svg';
import stylelint from 'stylelint';
import colorguard from 'colorguard';
import postcssVariablesPrefixer from 'postcss-variables-prefixer';
import pluginBunner from 'vite-plugin-banner';
import { cssPrefix, banner } from './src/preset';

export default defineConfig(({ mode }) => {
    const isConfigUnspecified = ['development', 'production', 'test'].includes(mode);
    if (isConfigUnspecified) {
        return {
            plugins: [
                tsconfigPaths()
            ]
        };
    }

    const pathToSourceFile = mode;
    const sourceFileExists = fs.existsSync(pathToSourceFile);
    if (!sourceFileExists)
        logError(`source file does not exists on path '${pathToSourceFile}'`, { throwErr: true });

    const inputFilePathParsed = path.parse(pathToSourceFile);
    const outputFilenameWithoutExtension = inputFilePathParsed.name;
    const outputFilenameFull = `${outputFilenameWithoutExtension}.js`;
    // const outputFilePath = path.join('./dist', outputFilenameFull);

    return {
        css: {
            postcss: {
                plugins: [
                    postcssNesting(),
                    autoprefixer(),
                    PostcssModulesPlugin({
                        generateScopedName: `${cssPrefix}[local]`,
                    }),
                    // postcssVariablesPrefixer({
                    //     prefix: cssPrefix
                    // }),
                    postcssPresetEnv(),
                    postcssUtilities(),
                    postcssInlineSvg(),
                    // stylelint(),
                    colorguard(),
                ]
            }
        },
        plugins: [
            tsconfigPaths(),
            pluginBunner({
                content: banner,
                verify: false
            })
        ],
        build: {
            target: 'es5',
            minify: false,
            emptyOutDir: false,
            lib: {
                entry: pathToSourceFile,
                formats: ['es'],
                fileName: outputFilenameWithoutExtension,
            }
        },
    }
});