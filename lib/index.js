"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
// Scan each module.paths. If there exists node_modules/moduleName then return true. Otherwise return false.
var isNodeModule = function (_a) {
    var moduleName = _a.moduleName;
    return module.paths.some(function (nodeModulePath) { return fs.existsSync(path.join(nodeModulePath, moduleName)); });
};
function default_1(styleApi) {
    var alias = styleApi.alias, and = styleApi.and, not = styleApi.not, dotSegmentCount = styleApi.dotSegmentCount, hasNoMember = styleApi.hasNoMember, isAbsoluteModule = styleApi.isAbsoluteModule, isRelativeModule = styleApi.isRelativeModule, moduleName = styleApi.moduleName, naturally = styleApi.naturally, unicode = styleApi.unicode;
    var isHotModuleReplacement = function (_a) {
        var moduleName = _a.moduleName;
        return /^react-hot-loader/.test(moduleName);
    };
    var isReactModule = function (_a) {
        var moduleName = _a.moduleName;
        return /^(react|react-dom)$/.test(moduleName);
    };
    var isStylesModule = function (_a) {
        var moduleName = _a.moduleName;
        return /\.(s?css|less)$/.test(moduleName);
    };
    var isAsset = function (_a) {
        var moduleName = _a.moduleName;
        return /\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot)(\?.*)?$/i.test(moduleName);
    };
    var isTypescriptType = function (_a) {
        var type = _a.type;
        return type === "import-type";
    };
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
            match: and(isNodeModule, not(isRelativeModule)),
            sort: moduleName(naturally),
            sortNamedMembers: alias(unicode),
        },
        { separator: true },
        // Absolute imports
        {
            match: and(isAbsoluteModule, not(isStylesModule), not(isTypescriptType)),
            sort: moduleName(naturally),
            sortNamedMembers: alias(unicode),
        },
        { separator: true },
        // Relative imports
        {
            match: and(isRelativeModule, not(isStylesModule), not(isTypescriptType), not(isAsset)),
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
        // Assets (images, fonts, etc)
        {
            match: isAsset,
            sort: [dotSegmentCount, moduleName(naturally)],
            sortNamedMembers: alias(unicode),
        },
        // import "./styles.less";
        { match: and(hasNoMember, isRelativeModule, isStylesModule) },
        { separator: true },
    ];
}
exports.default = default_1;
