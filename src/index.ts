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

    const isHotModuleReplacement = ({ moduleName }) => /^react-hot-loader/.test(moduleName);
    const isReactModule = ({ moduleName }) => /^(react|react-dom)$/.test(moduleName);
    const isStylesModule = ({ moduleName }) => /\.(s?css|less)$/.test(moduleName);
    const isTypescriptType = ({ type }) => type === "import-type";

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
            match: and(isAbsoluteModule, not(isStylesModule), not(isTypescriptType)),
            sort: moduleName(naturally),
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // import … from "./foo";
        // import … from "../foo";
        {
            match: and(isRelativeModule, not(isStylesModule), not(isTypescriptType)),
            sort: [dotSegmentCount, moduleName(naturally)],
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // import type ... from "..."
        {
            match: isTypescriptType,
            sort: [dotSegmentCount, moduleName(naturally)],
            sortNamedMembers: alias(unicode),
        },
        { separator: true },

        // import "./styles.less";
        { match: and(hasNoMember, isRelativeModule, isStylesModule) },
        { separator: true },
    ];
}
