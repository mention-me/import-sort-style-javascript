import * as path from "path";
import * as fs from "fs";

import { IStyleAPI, IStyleItem } from "import-sort-style";

// Scan each module.paths. If there exists node_modules/moduleName then return true. Otherwise return false.
const isNodeModule = (moduleName) => {
    return module.paths.some((nodeModulePath) => fs.existsSync(path.join(nodeModulePath, moduleName)));
};

export default function (styleApi: IStyleAPI): IStyleItem[] {
    const {
        alias,
        and,
        not,
        dotSegmentCount,
        hasNoMember,
        isAbsoluteModule,
        isRelativeModule,
        moduleName,
        naturally,
        unicode,
    } = styleApi;

    const isHotModuleReplacement = (imported) => Boolean(imported.moduleName.match(/^react-hot-loader/));
    const isReactModule = (imported) => Boolean(imported.moduleName.match(/^(react|react-dom)$/));
    const isStylesModule = (imported) => Boolean(imported.moduleName.match(/\.(s?css|less)$/));

    return [
        // import "foo"
        { match: and(hasNoMember, isAbsoluteModule, not(isStylesModule)) },
        { separator: true },

        // import "./foo"
        { match: and(hasNoMember, isRelativeModule, not(isStylesModule)) },
        { separator: true },

        // import { hot } from "react-hot-loader/root";
        {
            match: isHotModuleReplacement,
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // import React from "react";
        {
            match: isReactModule,
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // Node modules
        {
            match: (imported) => isNodeModule(imported.moduleName),
            sort: moduleName(naturally),
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // import … from "foo";
        {
            match: and(isAbsoluteModule, not(isStylesModule)),
            sort: moduleName(naturally),
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // import … from "./foo";
        // import … from "../foo";
        {
            match: and(isRelativeModule, not(isStylesModule)),
            sort: [dotSegmentCount, moduleName(naturally)],
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // import "./styles.less";
        { match: and(hasNoMember, isRelativeModule, isStylesModule) },
        { separator: true },
    ];
}
