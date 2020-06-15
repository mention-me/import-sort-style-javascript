"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
// Scan each module.paths. If there exists node_modules/moduleName then return true. Otherwise return false.
var isNodeModule = function (moduleName) {
    return module.paths.some(function (nodeModulePath) { return fs.existsSync(path.join(nodeModulePath, moduleName)); });
};
function default_1(styleApi) {
    var alias = styleApi.alias, and = styleApi.and, not = styleApi.not, dotSegmentCount = styleApi.dotSegmentCount, hasNoMember = styleApi.hasNoMember, isAbsoluteModule = styleApi.isAbsoluteModule, isRelativeModule = styleApi.isRelativeModule, moduleName = styleApi.moduleName, naturally = styleApi.naturally, unicode = styleApi.unicode;
    var isHotModuleReplacement = function (imported) { return Boolean(imported.moduleName.match(/^react-hot-loader/)); };
    var isReactModule = function (imported) { return Boolean(imported.moduleName.match(/^(react|react-dom)$/)); };
    var isStylesModule = function (imported) { return Boolean(imported.moduleName.match(/\.(s?css|less)$/)); };
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
            match: function (imported) { return isNodeModule(imported.moduleName); },
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
exports.default = default_1;
