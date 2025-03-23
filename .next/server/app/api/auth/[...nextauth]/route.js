"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cmikae%5CDownloads%5Csquareonerentalswebsite%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmikae%5CDownloads%5Csquareonerentalswebsite&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cmikae%5CDownloads%5Csquareonerentalswebsite%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmikae%5CDownloads%5Csquareonerentalswebsite&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_mikae_Downloads_squareonerentalswebsite_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./src/app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\mikae\\\\Downloads\\\\squareonerentalswebsite\\\\src\\\\app\\\\api\\\\auth\\\\[...nextauth]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_mikae_Downloads_squareonerentalswebsite_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNtaWthZSU1Q0Rvd25sb2FkcyU1Q3NxdWFyZW9uZXJlbnRhbHN3ZWJzaXRlJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNtaWthZSU1Q0Rvd25sb2FkcyU1Q3NxdWFyZW9uZXJlbnRhbHN3ZWJzaXRlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNrRDtBQUMvSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3NxdWFyZW9uZXJlbnRhbHN3ZWIvPzU2YzAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcbWlrYWVcXFxcRG93bmxvYWRzXFxcXHNxdWFyZW9uZXJlbnRhbHN3ZWJzaXRlXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcWy4uLm5leHRhdXRoXVxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxtaWthZVxcXFxEb3dubG9hZHNcXFxcc3F1YXJlb25lcmVudGFsc3dlYnNpdGVcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxbLi4ubmV4dGF1dGhdXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cmikae%5CDownloads%5Csquareonerentalswebsite%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmikae%5CDownloads%5Csquareonerentalswebsite&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/[...nextauth]/route.ts":
/*!*************************************************!*\
  !*** ./src/app/api/auth/[...nextauth]/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler),\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/providers/google */ \"(rsc)/./node_modules/next-auth/providers/google.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/models/User */ \"(rsc)/./src/models/User.ts\");\n/* harmony import */ var _lib_mongodb__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/lib/mongodb */ \"(rsc)/./src/lib/mongodb.ts\");\n\n\n\n\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2__[\"default\"])({\n            clientId: process.env.GOOGLE_CLIENT_ID,\n            clientSecret: process.env.GOOGLE_CLIENT_SECRET\n        }),\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"text\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_5__[\"default\"])();\n                const user = await _models_User__WEBPACK_IMPORTED_MODULE_4__.User.findOne({\n                    email: credentials.email\n                }).lean();\n                if (!user || !user.hashedPassword) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                const isCorrectPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_3___default().compare(credentials.password, user.hashedPassword);\n                if (!isCorrectPassword) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                return {\n                    id: user._id.toString(),\n                    email: user.email,\n                    name: user.name,\n                    image: user.image,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user, account }) {\n            if (user) {\n                token.id = user.id;\n                token.role = user.role;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token && session.user) {\n                session.user.id = token.id;\n                session.user.role = token.role;\n            }\n            return session;\n        },\n        async signIn ({ user, account }) {\n            if (account?.provider === \"google\") {\n                try {\n                    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_5__[\"default\"])();\n                    // Check if user exists\n                    const existingUser = await _models_User__WEBPACK_IMPORTED_MODULE_4__.User.findOne({\n                        email: user.email\n                    }).lean();\n                    if (!existingUser) {\n                        // Create new user\n                        await _models_User__WEBPACK_IMPORTED_MODULE_4__.User.create({\n                            email: user.email,\n                            name: user.name,\n                            image: user.image,\n                            role: \"USER\",\n                            emailVerified: new Date()\n                        });\n                    }\n                    return true;\n                } catch (error) {\n                    console.error(\"Error in signIn callback:\", error);\n                    return false;\n                }\n            }\n            return true;\n        }\n    },\n    pages: {\n        signIn: \"/auth/signin\"\n    },\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBaUM7QUFHaUM7QUFDVjtBQUMxQjtBQUNjO0FBQ047QUFnQi9CLE1BQU1NLGNBQStCO0lBQzFDQyxXQUFXO1FBQ1RMLHNFQUFjQSxDQUFDO1lBQ2JNLFVBQVVDLFFBQVFDLEdBQUcsQ0FBQ0MsZ0JBQWdCO1lBQ3RDQyxjQUFjSCxRQUFRQyxHQUFHLENBQUNHLG9CQUFvQjtRQUNoRDtRQUNBWiwyRUFBbUJBLENBQUM7WUFDbEJhLE1BQU07WUFDTkMsYUFBYTtnQkFDWEMsT0FBTztvQkFBRUMsT0FBTztvQkFBU0MsTUFBTTtnQkFBTztnQkFDdENDLFVBQVU7b0JBQUVGLE9BQU87b0JBQVlDLE1BQU07Z0JBQVc7WUFDbEQ7WUFDQSxNQUFNRSxXQUFVTCxXQUFXO2dCQUN6QixJQUFJLENBQUNBLGFBQWFDLFNBQVMsQ0FBQ0QsYUFBYUksVUFBVTtvQkFDakQsTUFBTSxJQUFJRSxNQUFNO2dCQUNsQjtnQkFFQSxNQUFNaEIsd0RBQVNBO2dCQUVmLE1BQU1pQixPQUFPLE1BQU1sQiw4Q0FBSUEsQ0FBQ21CLE9BQU8sQ0FBQztvQkFBRVAsT0FBT0QsWUFBWUMsS0FBSztnQkFBQyxHQUFHUSxJQUFJO2dCQUVsRSxJQUFJLENBQUNGLFFBQVEsQ0FBQ0EsS0FBS0csY0FBYyxFQUFFO29CQUNqQyxNQUFNLElBQUlKLE1BQU07Z0JBQ2xCO2dCQUVBLE1BQU1LLG9CQUFvQixNQUFNdkIsdURBQWMsQ0FDNUNZLFlBQVlJLFFBQVEsRUFDcEJHLEtBQUtHLGNBQWM7Z0JBR3JCLElBQUksQ0FBQ0MsbUJBQW1CO29CQUN0QixNQUFNLElBQUlMLE1BQU07Z0JBQ2xCO2dCQUVBLE9BQU87b0JBQ0xPLElBQUlOLEtBQUtPLEdBQUcsQ0FBQ0MsUUFBUTtvQkFDckJkLE9BQU9NLEtBQUtOLEtBQUs7b0JBQ2pCRixNQUFNUSxLQUFLUixJQUFJO29CQUNmaUIsT0FBT1QsS0FBS1MsS0FBSztvQkFDakJDLE1BQU1WLEtBQUtVLElBQUk7Z0JBQ2pCO1lBQ0Y7UUFDRjtLQUNEO0lBQ0RDLFdBQVc7UUFDVCxNQUFNQyxLQUFJLEVBQUVDLEtBQUssRUFBRWIsSUFBSSxFQUFFYyxPQUFPLEVBQUU7WUFDaEMsSUFBSWQsTUFBTTtnQkFDUmEsTUFBTVAsRUFBRSxHQUFHTixLQUFLTSxFQUFFO2dCQUNsQk8sTUFBTUgsSUFBSSxHQUFHVixLQUFLVSxJQUFJO1lBQ3hCO1lBQ0EsT0FBT0c7UUFDVDtRQUNBLE1BQU1FLFNBQVEsRUFBRUEsT0FBTyxFQUFFRixLQUFLLEVBQUU7WUFDOUIsSUFBSUEsU0FBU0UsUUFBUWYsSUFBSSxFQUFFO2dCQUN6QmUsUUFBUWYsSUFBSSxDQUFDTSxFQUFFLEdBQUdPLE1BQU1QLEVBQUU7Z0JBQzFCUyxRQUFRZixJQUFJLENBQUNVLElBQUksR0FBR0csTUFBTUgsSUFBSTtZQUNoQztZQUNBLE9BQU9LO1FBQ1Q7UUFDQSxNQUFNQyxRQUFPLEVBQUVoQixJQUFJLEVBQUVjLE9BQU8sRUFBRTtZQUM1QixJQUFJQSxTQUFTRyxhQUFhLFVBQVU7Z0JBQ2xDLElBQUk7b0JBQ0YsTUFBTWxDLHdEQUFTQTtvQkFFZix1QkFBdUI7b0JBQ3ZCLE1BQU1tQyxlQUFlLE1BQU1wQyw4Q0FBSUEsQ0FBQ21CLE9BQU8sQ0FBQzt3QkFBRVAsT0FBT00sS0FBS04sS0FBSztvQkFBQyxHQUFHUSxJQUFJO29CQUVuRSxJQUFJLENBQUNnQixjQUFjO3dCQUNqQixrQkFBa0I7d0JBQ2xCLE1BQU1wQyw4Q0FBSUEsQ0FBQ3FDLE1BQU0sQ0FBQzs0QkFDaEJ6QixPQUFPTSxLQUFLTixLQUFLOzRCQUNqQkYsTUFBTVEsS0FBS1IsSUFBSTs0QkFDZmlCLE9BQU9ULEtBQUtTLEtBQUs7NEJBQ2pCQyxNQUFNOzRCQUNOVSxlQUFlLElBQUlDO3dCQUNyQjtvQkFDRjtvQkFFQSxPQUFPO2dCQUNULEVBQUUsT0FBT0MsT0FBTztvQkFDZEMsUUFBUUQsS0FBSyxDQUFDLDZCQUE2QkE7b0JBQzNDLE9BQU87Z0JBQ1Q7WUFDRjtZQUVBLE9BQU87UUFDVDtJQUNGO0lBQ0FFLE9BQU87UUFDTFIsUUFBUTtJQUNWO0lBQ0FELFNBQVM7UUFDUFUsVUFBVTtJQUNaO0lBQ0FDLFFBQVF2QyxRQUFRQyxHQUFHLENBQUN1QyxlQUFlO0FBQ3JDLEVBQUU7QUFFRixNQUFNQyxVQUFVbEQsZ0RBQVFBLENBQUNNO0FBQ2tCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3F1YXJlb25lcmVudGFsc3dlYi8uL3NyYy9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cz8wMDk4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXh0QXV0aCBmcm9tICduZXh0LWF1dGgnO1xuaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IERlZmF1bHRTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHMnO1xuaW1wb3J0IEdvb2dsZVByb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvZ29vZ2xlJztcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuaW1wb3J0IHsgVXNlciwgSVVzZXIgfSBmcm9tICdAL21vZGVscy9Vc2VyJztcbmltcG9ydCBjb25uZWN0REIgZnJvbSAnQC9saWIvbW9uZ29kYic7XG5cbmRlY2xhcmUgbW9kdWxlICduZXh0LWF1dGgnIHtcbiAgaW50ZXJmYWNlIFVzZXIge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgcm9sZT86IHN0cmluZztcbiAgfVxuICBcbiAgaW50ZXJmYWNlIFNlc3Npb24ge1xuICAgIHVzZXI6IHtcbiAgICAgIGlkOiBzdHJpbmc7XG4gICAgICByb2xlPzogc3RyaW5nO1xuICAgIH0gJiBEZWZhdWx0U2Vzc2lvblsndXNlciddO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xuICBwcm92aWRlcnM6IFtcbiAgICBHb29nbGVQcm92aWRlcih7XG4gICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCEsXG4gICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfU0VDUkVUISxcbiAgICB9KSxcbiAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcbiAgICAgIG5hbWU6ICdjcmVkZW50aWFscycsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogJ0VtYWlsJywgdHlwZTogJ3RleHQnIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiAnUGFzc3dvcmQnLCB0eXBlOiAncGFzc3dvcmQnIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY3JlZGVudGlhbHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGNvbm5lY3REQigpO1xuXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmZpbmRPbmUoeyBlbWFpbDogY3JlZGVudGlhbHMuZW1haWwgfSkubGVhbigpIGFzIElVc2VyIHwgbnVsbDtcblxuICAgICAgICBpZiAoIXVzZXIgfHwgIXVzZXIuaGFzaGVkUGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY3JlZGVudGlhbHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzQ29ycmVjdFBhc3N3b3JkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoXG4gICAgICAgICAgY3JlZGVudGlhbHMucGFzc3dvcmQsXG4gICAgICAgICAgdXNlci5oYXNoZWRQYXNzd29yZFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICghaXNDb3JyZWN0UGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY3JlZGVudGlhbHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IHVzZXIuX2lkLnRvU3RyaW5nKCksXG4gICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgIGltYWdlOiB1c2VyLmltYWdlLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyLCBhY2NvdW50IH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcbiAgICAgICAgdG9rZW4ucm9sZSA9IHVzZXIucm9sZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICBpZiAodG9rZW4gJiYgc2Vzc2lvbi51c2VyKSB7XG4gICAgICAgIHNlc3Npb24udXNlci5pZCA9IHRva2VuLmlkIGFzIHN0cmluZztcbiAgICAgICAgc2Vzc2lvbi51c2VyLnJvbGUgPSB0b2tlbi5yb2xlIGFzIHN0cmluZztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZXNzaW9uO1xuICAgIH0sXG4gICAgYXN5bmMgc2lnbkluKHsgdXNlciwgYWNjb3VudCB9KSB7XG4gICAgICBpZiAoYWNjb3VudD8ucHJvdmlkZXIgPT09ICdnb29nbGUnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgY29ubmVjdERCKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgdXNlciBleGlzdHNcbiAgICAgICAgICBjb25zdCBleGlzdGluZ1VzZXIgPSBhd2FpdCBVc2VyLmZpbmRPbmUoeyBlbWFpbDogdXNlci5lbWFpbCB9KS5sZWFuKCkgYXMgSVVzZXIgfCBudWxsO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmICghZXhpc3RpbmdVc2VyKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IHVzZXJcbiAgICAgICAgICAgIGF3YWl0IFVzZXIuY3JlYXRlKHtcbiAgICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgICAgICAgaW1hZ2U6IHVzZXIuaW1hZ2UsXG4gICAgICAgICAgICAgIHJvbGU6ICdVU0VSJyxcbiAgICAgICAgICAgICAgZW1haWxWZXJpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbiBzaWduSW4gY2FsbGJhY2s6JywgZXJyb3IpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogJy9hdXRoL3NpZ25pbicsXG4gIH0sXG4gIHNlc3Npb246IHtcbiAgICBzdHJhdGVneTogJ2p3dCcsXG4gIH0sXG4gIHNlY3JldDogcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVULFxufTtcblxuY29uc3QgaGFuZGxlciA9IE5leHRBdXRoKGF1dGhPcHRpb25zKTtcbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfTsiXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJDcmVkZW50aWFsc1Byb3ZpZGVyIiwiR29vZ2xlUHJvdmlkZXIiLCJiY3J5cHQiLCJVc2VyIiwiY29ubmVjdERCIiwiYXV0aE9wdGlvbnMiLCJwcm92aWRlcnMiLCJjbGllbnRJZCIsInByb2Nlc3MiLCJlbnYiLCJHT09HTEVfQ0xJRU5UX0lEIiwiY2xpZW50U2VjcmV0IiwiR09PR0xFX0NMSUVOVF9TRUNSRVQiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwiRXJyb3IiLCJ1c2VyIiwiZmluZE9uZSIsImxlYW4iLCJoYXNoZWRQYXNzd29yZCIsImlzQ29ycmVjdFBhc3N3b3JkIiwiY29tcGFyZSIsImlkIiwiX2lkIiwidG9TdHJpbmciLCJpbWFnZSIsInJvbGUiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsImFjY291bnQiLCJzZXNzaW9uIiwic2lnbkluIiwicHJvdmlkZXIiLCJleGlzdGluZ1VzZXIiLCJjcmVhdGUiLCJlbWFpbFZlcmlmaWVkIiwiRGF0ZSIsImVycm9yIiwiY29uc29sZSIsInBhZ2VzIiwic3RyYXRlZ3kiLCJzZWNyZXQiLCJORVhUQVVUSF9TRUNSRVQiLCJoYW5kbGVyIiwiR0VUIiwiUE9TVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/mongodb.ts":
/*!****************************!*\
  !*** ./src/lib/mongodb.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ connectDB)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nif (!process.env.MONGODB_URI) {\n    throw new Error(\"Please add your Mongo URI to .env.local\");\n}\nconst uri = process.env.MONGODB_URI;\nlet isConnected = false;\nasync function connectDB() {\n    if (isConnected) {\n        console.log(\"Using existing MongoDB connection\");\n        return;\n    }\n    try {\n        const options = {\n            maxPoolSize: 10,\n            serverSelectionTimeoutMS: 5000,\n            socketTimeoutMS: 45000,\n            family: 4\n        };\n        await mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(uri, options);\n        isConnected = true;\n        console.log(\"New MongoDB connection established\");\n    } catch (error) {\n        console.error(\"MongoDB connection error:\", error);\n        throw error;\n    }\n}\n// Handle connection errors\nmongoose__WEBPACK_IMPORTED_MODULE_0___default().connection.on(\"error\", (err)=>{\n    console.error(\"MongoDB connection error:\", err);\n    isConnected = false;\n});\nmongoose__WEBPACK_IMPORTED_MODULE_0___default().connection.on(\"disconnected\", ()=>{\n    console.log(\"MongoDB disconnected\");\n    isConnected = false;\n});\n// Handle process termination\nprocess.on(\"SIGINT\", async ()=>{\n    await mongoose__WEBPACK_IMPORTED_MODULE_0___default().connection.close();\n    process.exit(0);\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL21vbmdvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWdDO0FBRWhDLElBQUksQ0FBQ0MsUUFBUUMsR0FBRyxDQUFDQyxXQUFXLEVBQUU7SUFDNUIsTUFBTSxJQUFJQyxNQUFNO0FBQ2xCO0FBRUEsTUFBTUMsTUFBTUosUUFBUUMsR0FBRyxDQUFDQyxXQUFXO0FBRW5DLElBQUlHLGNBQWM7QUFFSCxlQUFlQztJQUM1QixJQUFJRCxhQUFhO1FBQ2ZFLFFBQVFDLEdBQUcsQ0FBQztRQUNaO0lBQ0Y7SUFFQSxJQUFJO1FBQ0YsTUFBTUMsVUFBVTtZQUNkQyxhQUFhO1lBQ2JDLDBCQUEwQjtZQUMxQkMsaUJBQWlCO1lBQ2pCQyxRQUFRO1FBQ1Y7UUFFQSxNQUFNZCx1REFBZ0IsQ0FBQ0ssS0FBS0s7UUFDNUJKLGNBQWM7UUFDZEUsUUFBUUMsR0FBRyxDQUFDO0lBQ2QsRUFBRSxPQUFPTyxPQUFPO1FBQ2RSLFFBQVFRLEtBQUssQ0FBQyw2QkFBNkJBO1FBQzNDLE1BQU1BO0lBQ1I7QUFDRjtBQUVBLDJCQUEyQjtBQUMzQmhCLDBEQUFtQixDQUFDa0IsRUFBRSxDQUFDLFNBQVMsQ0FBQ0M7SUFDL0JYLFFBQVFRLEtBQUssQ0FBQyw2QkFBNkJHO0lBQzNDYixjQUFjO0FBQ2hCO0FBRUFOLDBEQUFtQixDQUFDa0IsRUFBRSxDQUFDLGdCQUFnQjtJQUNyQ1YsUUFBUUMsR0FBRyxDQUFDO0lBQ1pILGNBQWM7QUFDaEI7QUFFQSw2QkFBNkI7QUFDN0JMLFFBQVFpQixFQUFFLENBQUMsVUFBVTtJQUNuQixNQUFNbEIsMERBQW1CLENBQUNvQixLQUFLO0lBQy9CbkIsUUFBUW9CLElBQUksQ0FBQztBQUNmIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3F1YXJlb25lcmVudGFsc3dlYi8uL3NyYy9saWIvbW9uZ29kYi50cz81M2MyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmlmICghcHJvY2Vzcy5lbnYuTU9OR09EQl9VUkkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgYWRkIHlvdXIgTW9uZ28gVVJJIHRvIC5lbnYubG9jYWwnKTtcbn1cblxuY29uc3QgdXJpID0gcHJvY2Vzcy5lbnYuTU9OR09EQl9VUkk7XG5cbmxldCBpc0Nvbm5lY3RlZCA9IGZhbHNlO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjb25uZWN0REIoKSB7XG4gIGlmIChpc0Nvbm5lY3RlZCkge1xuICAgIGNvbnNvbGUubG9nKCdVc2luZyBleGlzdGluZyBNb25nb0RCIGNvbm5lY3Rpb24nKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBtYXhQb29sU2l6ZTogMTAsXG4gICAgICBzZXJ2ZXJTZWxlY3Rpb25UaW1lb3V0TVM6IDUwMDAsXG4gICAgICBzb2NrZXRUaW1lb3V0TVM6IDQ1MDAwLFxuICAgICAgZmFtaWx5OiA0XG4gICAgfTtcblxuICAgIGF3YWl0IG1vbmdvb3NlLmNvbm5lY3QodXJpLCBvcHRpb25zKTtcbiAgICBpc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgY29uc29sZS5sb2coJ05ldyBNb25nb0RCIGNvbm5lY3Rpb24gZXN0YWJsaXNoZWQnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdNb25nb0RCIGNvbm5lY3Rpb24gZXJyb3I6JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbi8vIEhhbmRsZSBjb25uZWN0aW9uIGVycm9yc1xubW9uZ29vc2UuY29ubmVjdGlvbi5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoJ01vbmdvREIgY29ubmVjdGlvbiBlcnJvcjonLCBlcnIpO1xuICBpc0Nvbm5lY3RlZCA9IGZhbHNlO1xufSk7XG5cbm1vbmdvb3NlLmNvbm5lY3Rpb24ub24oJ2Rpc2Nvbm5lY3RlZCcsICgpID0+IHtcbiAgY29uc29sZS5sb2coJ01vbmdvREIgZGlzY29ubmVjdGVkJyk7XG4gIGlzQ29ubmVjdGVkID0gZmFsc2U7XG59KTtcblxuLy8gSGFuZGxlIHByb2Nlc3MgdGVybWluYXRpb25cbnByb2Nlc3Mub24oJ1NJR0lOVCcsIGFzeW5jICgpID0+IHtcbiAgYXdhaXQgbW9uZ29vc2UuY29ubmVjdGlvbi5jbG9zZSgpO1xuICBwcm9jZXNzLmV4aXQoMCk7XG59KTtcbiJdLCJuYW1lcyI6WyJtb25nb29zZSIsInByb2Nlc3MiLCJlbnYiLCJNT05HT0RCX1VSSSIsIkVycm9yIiwidXJpIiwiaXNDb25uZWN0ZWQiLCJjb25uZWN0REIiLCJjb25zb2xlIiwibG9nIiwib3B0aW9ucyIsIm1heFBvb2xTaXplIiwic2VydmVyU2VsZWN0aW9uVGltZW91dE1TIiwic29ja2V0VGltZW91dE1TIiwiZmFtaWx5IiwiY29ubmVjdCIsImVycm9yIiwiY29ubmVjdGlvbiIsIm9uIiwiZXJyIiwiY2xvc2UiLCJleGl0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/mongodb.ts\n");

/***/ }),

/***/ "(rsc)/./src/models/User.ts":
/*!****************************!*\
  !*** ./src/models/User.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   User: () => (/* binding */ User)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst userSchema = new (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema)({\n    name: {\n        type: String,\n        required: true\n    },\n    email: {\n        type: String,\n        required: true,\n        unique: true\n    },\n    emailVerified: {\n        type: Date\n    },\n    image: {\n        type: String\n    },\n    password: {\n        type: String\n    },\n    role: {\n        type: String,\n        enum: [\n            \"USER\",\n            \"ADMIN\"\n        ],\n        default: \"USER\"\n    },\n    favorites: [\n        {\n            type: (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema).Types.ObjectId,\n            ref: \"Listing\"\n        }\n    ]\n}, {\n    timestamps: true\n});\nconst User = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().models).User || mongoose__WEBPACK_IMPORTED_MODULE_0___default().model(\"User\", userSchema);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbW9kZWxzL1VzZXIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWdDO0FBZWhDLE1BQU1DLGFBQWEsSUFBSUQsd0RBQWUsQ0FBUTtJQUM1Q0csTUFBTTtRQUFFQyxNQUFNQztRQUFRQyxVQUFVO0lBQUs7SUFDckNDLE9BQU87UUFBRUgsTUFBTUM7UUFBUUMsVUFBVTtRQUFNRSxRQUFRO0lBQUs7SUFDcERDLGVBQWU7UUFBRUwsTUFBTU07SUFBSztJQUM1QkMsT0FBTztRQUFFUCxNQUFNQztJQUFPO0lBQ3RCTyxVQUFVO1FBQUVSLE1BQU1DO0lBQU87SUFDekJRLE1BQU07UUFBRVQsTUFBTUM7UUFBUVMsTUFBTTtZQUFDO1lBQVE7U0FBUTtRQUFFQyxTQUFTO0lBQU87SUFDL0RDLFdBQVc7UUFBQztZQUFFWixNQUFNSix3REFBZSxDQUFDaUIsS0FBSyxDQUFDQyxRQUFRO1lBQUVDLEtBQUs7UUFBVTtLQUFFO0FBQ3ZFLEdBQUc7SUFDREMsWUFBWTtBQUNkO0FBRU8sTUFBTUMsT0FBT3JCLHdEQUFlLENBQUNxQixJQUFJLElBQUlyQixxREFBYyxDQUFRLFFBQVFDLFlBQVkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zcXVhcmVvbmVyZW50YWxzd2ViLy4vc3JjL21vZGVscy9Vc2VyLnRzPzA5NmQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcblxuZXhwb3J0IGludGVyZmFjZSBJVXNlciB7XG4gIF9pZDogbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQ7XG4gIG5hbWU6IHN0cmluZztcbiAgZW1haWw6IHN0cmluZztcbiAgZW1haWxWZXJpZmllZD86IERhdGU7XG4gIGltYWdlPzogc3RyaW5nO1xuICBwYXNzd29yZD86IHN0cmluZztcbiAgcm9sZTogJ1VTRVInIHwgJ0FETUlOJztcbiAgZmF2b3JpdGVzOiBtb25nb29zZS5UeXBlcy5PYmplY3RJZFtdO1xuICBjcmVhdGVkQXQ6IERhdGU7XG4gIHVwZGF0ZWRBdDogRGF0ZTtcbn1cblxuY29uc3QgdXNlclNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWE8SVVzZXI+KHtcbiAgbmFtZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gIGVtYWlsOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZSB9LFxuICBlbWFpbFZlcmlmaWVkOiB7IHR5cGU6IERhdGUgfSxcbiAgaW1hZ2U6IHsgdHlwZTogU3RyaW5nIH0sXG4gIHBhc3N3b3JkOiB7IHR5cGU6IFN0cmluZyB9LFxuICByb2xlOiB7IHR5cGU6IFN0cmluZywgZW51bTogWydVU0VSJywgJ0FETUlOJ10sIGRlZmF1bHQ6ICdVU0VSJyB9LFxuICBmYXZvcml0ZXM6IFt7IHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnTGlzdGluZycgfV0sXG59LCB7XG4gIHRpbWVzdGFtcHM6IHRydWUsXG59KTtcblxuZXhwb3J0IGNvbnN0IFVzZXIgPSBtb25nb29zZS5tb2RlbHMuVXNlciB8fCBtb25nb29zZS5tb2RlbDxJVXNlcj4oJ1VzZXInLCB1c2VyU2NoZW1hKTtcbiJdLCJuYW1lcyI6WyJtb25nb29zZSIsInVzZXJTY2hlbWEiLCJTY2hlbWEiLCJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwiZW1haWwiLCJ1bmlxdWUiLCJlbWFpbFZlcmlmaWVkIiwiRGF0ZSIsImltYWdlIiwicGFzc3dvcmQiLCJyb2xlIiwiZW51bSIsImRlZmF1bHQiLCJmYXZvcml0ZXMiLCJUeXBlcyIsIk9iamVjdElkIiwicmVmIiwidGltZXN0YW1wcyIsIlVzZXIiLCJtb2RlbHMiLCJtb2RlbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/models/User.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva","vendor-chunks/bcryptjs"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cmikae%5CDownloads%5Csquareonerentalswebsite%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmikae%5CDownloads%5Csquareonerentalswebsite&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();