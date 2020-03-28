import * as babel from '@babel/core';
// @ts-ignore
import pluginTransformTypeScript from '@babel/plugin-transform-typescript';
// @ts-ignore
import pluginDecorators from '@babel/plugin-proposal-decorators';
// @ts-ignore
import pluginClassProperties from '@babel/plugin-proposal-class-properties';
// @ts-ignore
import pluginNullishCoalescingOperator from '@babel/plugin-proposal-nullish-coalescing-operator';
// @ts-ignore
import pluginOptionalChaining from '@babel/plugin-proposal-optional-chaining';
// @ts-ignore
import { declare } from '@babel/helper-plugin-utils';

const $ = declare((api: any, {
    allowDeclareFields,
    onlyRemoveTypeImports,
    useDefineForClassFields,
}: $.Options): babel.PluginItem => {
    api.assertVersion(7);

    // Note, if we choose to use @babel/preset-typescript instead of @babel/plugin-transform-typescript
    // We have to wrap the `plugins` into an anonymous preset and that preset should
    // be placed prior to @babel/preset-typescript.
    // Otherwise, the @babel/proposal-class-properties would execute before @babel/plugin-transform-typescript.
    // The result would be, unexpectly, even if we pass `loose: true` && `allowDeclareFields: false`
    // to @babel/preset-typescript, class fields with no explicit initializer was still not intent to be erased.
    // This behaviour does not match what tsc does as tsconfig `useDefineForClassFields` enabled.
    return {
        overrides: [{
            plugins: [
                [pluginTransformTypeScript, {
                    allowNamespaces: true,
                    allowDeclareFields,
                    onlyRemoveTypeImports,
                }],
    
                [pluginDecorators, {
                    legacy: true
                }],
    
                [pluginClassProperties, {
                    loose: !useDefineForClassFields,
                }],
    
                // ?? operator
                pluginNullishCoalescingOperator,
    
                // ?. operator
                pluginOptionalChaining,
            ]
        }],
    }
})

namespace $ {
    export type Options = Partial<{
        /**
         * See `@babel/plugin-transform-typescript`.
         */
        allowDeclareFields: boolean;

        /**
         * See `@babel/plugin-transform-typescript`.
         */
        onlyRemoveTypeImports: boolean;

        /**
         * If true, `loose: true` is passed to `@babel/plugin-proposal-class-properties`.
         */
        useDefineForClassFields: boolean;
    }>;
}

export default $;