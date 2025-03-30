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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler),\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/providers/google */ \"(rsc)/./node_modules/next-auth/providers/google.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/models/User */ \"(rsc)/./src/models/User.ts\");\n/* harmony import */ var _lib_mongodb__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/lib/mongodb */ \"(rsc)/./src/lib/mongodb.ts\");\n\n\n\n\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2__[\"default\"])({\n            clientId: process.env.GOOGLE_CLIENT_ID,\n            clientSecret: process.env.GOOGLE_CLIENT_SECRET\n        }),\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"text\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_5__.connectDB)();\n                const user = await _models_User__WEBPACK_IMPORTED_MODULE_4__.User.findOne({\n                    email: credentials.email\n                });\n                if (!user || !user.password) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                const isCorrectPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_3___default().compare(credentials.password, user.password);\n                if (!isCorrectPassword) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                return {\n                    id: user._id.toString(),\n                    email: user.email,\n                    name: user.name,\n                    image: user.image,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user, account }) {\n            if (user) {\n                token.id = user.id;\n                token.role = user.role;\n                token.email = user.email;\n                // Set admin role for specific email\n                if (user.email === \"mikaelr112@gmail.com\") {\n                    token.role = \"admin\";\n                }\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token && session.user) {\n                session.user.id = token.id;\n                session.user.role = token.role;\n                session.user.email = token.email;\n            }\n            return session;\n        },\n        async signIn ({ user, account }) {\n            if (account?.provider === \"google\") {\n                try {\n                    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_5__.connectDB)();\n                    // Check if user exists\n                    const existingUser = await _models_User__WEBPACK_IMPORTED_MODULE_4__.User.findOne({\n                        email: user.email\n                    });\n                    if (!existingUser) {\n                        // Create new user\n                        await _models_User__WEBPACK_IMPORTED_MODULE_4__.User.create({\n                            email: user.email,\n                            name: user.name,\n                            image: user.image,\n                            role: \"USER\",\n                            emailVerified: new Date()\n                        });\n                    }\n                    return true;\n                } catch (error) {\n                    console.error(\"Error in signIn callback:\", error);\n                    return false;\n                }\n            }\n            return true;\n        },\n        async redirect ({ url, baseUrl }) {\n            // Fix redirect logic\n            if (url.startsWith(\"/\")) {\n                return `${baseUrl}${url}`;\n            }\n            if (url.startsWith(baseUrl)) {\n                return url;\n            }\n            return baseUrl;\n        }\n    },\n    pages: {\n        signIn: \"/auth/signin\",\n        error: \"/auth/error\"\n    },\n    session: {\n        strategy: \"jwt\"\n    },\n    debug: true,\n    secret: process.env.NEXTAUTH_SECRET\n};\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBaUM7QUFHaUM7QUFDVjtBQUMxQjtBQUNjO0FBQ0Y7QUFpQm5DLE1BQU1NLGNBQStCO0lBQzFDQyxXQUFXO1FBQ1RMLHNFQUFjQSxDQUFDO1lBQ2JNLFVBQVVDLFFBQVFDLEdBQUcsQ0FBQ0MsZ0JBQWdCO1lBQ3RDQyxjQUFjSCxRQUFRQyxHQUFHLENBQUNHLG9CQUFvQjtRQUNoRDtRQUNBWiwyRUFBbUJBLENBQUM7WUFDbEJhLE1BQU07WUFDTkMsYUFBYTtnQkFDWEMsT0FBTztvQkFBRUMsT0FBTztvQkFBU0MsTUFBTTtnQkFBTztnQkFDdENDLFVBQVU7b0JBQUVGLE9BQU87b0JBQVlDLE1BQU07Z0JBQVc7WUFDbEQ7WUFDQSxNQUFNRSxXQUFVTCxXQUFXO2dCQUN6QixJQUFJLENBQUNBLGFBQWFDLFNBQVMsQ0FBQ0QsYUFBYUksVUFBVTtvQkFDakQsTUFBTSxJQUFJRSxNQUFNO2dCQUNsQjtnQkFFQSxNQUFNaEIsdURBQVNBO2dCQUVmLE1BQU1pQixPQUFPLE1BQU1sQiw4Q0FBSUEsQ0FBQ21CLE9BQU8sQ0FBQztvQkFBRVAsT0FBT0QsWUFBWUMsS0FBSztnQkFBQztnQkFFM0QsSUFBSSxDQUFDTSxRQUFRLENBQUNBLEtBQUtILFFBQVEsRUFBRTtvQkFDM0IsTUFBTSxJQUFJRSxNQUFNO2dCQUNsQjtnQkFFQSxNQUFNRyxvQkFBb0IsTUFBTXJCLHVEQUFjLENBQzVDWSxZQUFZSSxRQUFRLEVBQ3BCRyxLQUFLSCxRQUFRO2dCQUdmLElBQUksQ0FBQ0ssbUJBQW1CO29CQUN0QixNQUFNLElBQUlILE1BQU07Z0JBQ2xCO2dCQUVBLE9BQU87b0JBQ0xLLElBQUlKLEtBQUtLLEdBQUcsQ0FBQ0MsUUFBUTtvQkFDckJaLE9BQU9NLEtBQUtOLEtBQUs7b0JBQ2pCRixNQUFNUSxLQUFLUixJQUFJO29CQUNmZSxPQUFPUCxLQUFLTyxLQUFLO29CQUNqQkMsTUFBTVIsS0FBS1EsSUFBSTtnQkFDakI7WUFDRjtRQUNGO0tBQ0Q7SUFDREMsV0FBVztRQUNULE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFWCxJQUFJLEVBQUVZLE9BQU8sRUFBRTtZQUNoQyxJQUFJWixNQUFNO2dCQUNSVyxNQUFNUCxFQUFFLEdBQUdKLEtBQUtJLEVBQUU7Z0JBQ2xCTyxNQUFNSCxJQUFJLEdBQUdSLEtBQUtRLElBQUk7Z0JBQ3RCRyxNQUFNakIsS0FBSyxHQUFHTSxLQUFLTixLQUFLO2dCQUN4QixvQ0FBb0M7Z0JBQ3BDLElBQUlNLEtBQUtOLEtBQUssS0FBSyx3QkFBd0I7b0JBQ3pDaUIsTUFBTUgsSUFBSSxHQUFHO2dCQUNmO1lBQ0Y7WUFDQSxPQUFPRztRQUNUO1FBQ0EsTUFBTUUsU0FBUSxFQUFFQSxPQUFPLEVBQUVGLEtBQUssRUFBRTtZQUM5QixJQUFJQSxTQUFTRSxRQUFRYixJQUFJLEVBQUU7Z0JBQ3pCYSxRQUFRYixJQUFJLENBQUNJLEVBQUUsR0FBR08sTUFBTVAsRUFBRTtnQkFDMUJTLFFBQVFiLElBQUksQ0FBQ1EsSUFBSSxHQUFHRyxNQUFNSCxJQUFJO2dCQUM5QkssUUFBUWIsSUFBSSxDQUFDTixLQUFLLEdBQUdpQixNQUFNakIsS0FBSztZQUNsQztZQUNBLE9BQU9tQjtRQUNUO1FBQ0EsTUFBTUMsUUFBTyxFQUFFZCxJQUFJLEVBQUVZLE9BQU8sRUFBRTtZQUM1QixJQUFJQSxTQUFTRyxhQUFhLFVBQVU7Z0JBQ2xDLElBQUk7b0JBQ0YsTUFBTWhDLHVEQUFTQTtvQkFFZix1QkFBdUI7b0JBQ3ZCLE1BQU1pQyxlQUFlLE1BQU1sQyw4Q0FBSUEsQ0FBQ21CLE9BQU8sQ0FBQzt3QkFBRVAsT0FBT00sS0FBS04sS0FBSztvQkFBQztvQkFFNUQsSUFBSSxDQUFDc0IsY0FBYzt3QkFDakIsa0JBQWtCO3dCQUNsQixNQUFNbEMsOENBQUlBLENBQUNtQyxNQUFNLENBQUM7NEJBQ2hCdkIsT0FBT00sS0FBS04sS0FBSzs0QkFDakJGLE1BQU1RLEtBQUtSLElBQUk7NEJBQ2ZlLE9BQU9QLEtBQUtPLEtBQUs7NEJBQ2pCQyxNQUFNOzRCQUNOVSxlQUFlLElBQUlDO3dCQUNyQjtvQkFDRjtvQkFFQSxPQUFPO2dCQUNULEVBQUUsT0FBT0MsT0FBTztvQkFDZEMsUUFBUUQsS0FBSyxDQUFDLDZCQUE2QkE7b0JBQzNDLE9BQU87Z0JBQ1Q7WUFDRjtZQUVBLE9BQU87UUFDVDtRQUNBLE1BQU1FLFVBQVMsRUFBRUMsR0FBRyxFQUFFQyxPQUFPLEVBQUU7WUFDN0IscUJBQXFCO1lBQ3JCLElBQUlELElBQUlFLFVBQVUsQ0FBQyxNQUFNO2dCQUN2QixPQUFPLENBQUMsRUFBRUQsUUFBUSxFQUFFRCxJQUFJLENBQUM7WUFDM0I7WUFDQSxJQUFJQSxJQUFJRSxVQUFVLENBQUNELFVBQVU7Z0JBQzNCLE9BQU9EO1lBQ1Q7WUFDQSxPQUFPQztRQUNUO0lBQ0Y7SUFDQUUsT0FBTztRQUNMWixRQUFRO1FBQ1JNLE9BQU87SUFDVDtJQUNBUCxTQUFTO1FBQ1BjLFVBQVU7SUFDWjtJQUNBQyxPQUFPO0lBQ1BDLFFBQVExQyxRQUFRQyxHQUFHLENBQUMwQyxlQUFlO0FBQ3JDLEVBQUU7QUFFRixNQUFNQyxVQUFVckQsZ0RBQVFBLENBQUNNO0FBQ2tCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3F1YXJlb25lcmVudGFsc3dlYi8uL3NyYy9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cz8wMDk4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXh0QXV0aCBmcm9tICduZXh0LWF1dGgnO1xuaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCB7IERlZmF1bHRTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHMnO1xuaW1wb3J0IEdvb2dsZVByb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvZ29vZ2xlJztcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuaW1wb3J0IHsgVXNlciwgSVVzZXIgfSBmcm9tICdAL21vZGVscy9Vc2VyJztcbmltcG9ydCB7IGNvbm5lY3REQiB9IGZyb20gJ0AvbGliL21vbmdvZGInO1xuXG5kZWNsYXJlIG1vZHVsZSAnbmV4dC1hdXRoJyB7XG4gIGludGVyZmFjZSBVc2VyIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHJvbGU/OiBzdHJpbmc7XG4gIH1cbiAgXG4gIGludGVyZmFjZSBTZXNzaW9uIHtcbiAgICB1c2VyOiB7XG4gICAgICBpZDogc3RyaW5nO1xuICAgICAgcm9sZT86IHN0cmluZztcbiAgICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgfSAmIERlZmF1bHRTZXNzaW9uWyd1c2VyJ107XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XG4gIHByb3ZpZGVyczogW1xuICAgIEdvb2dsZVByb3ZpZGVyKHtcbiAgICAgIGNsaWVudElkOiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lEISxcbiAgICAgIGNsaWVudFNlY3JldDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9TRUNSRVQhLFxuICAgIH0pLFxuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xuICAgICAgbmFtZTogJ2NyZWRlbnRpYWxzJyxcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIGVtYWlsOiB7IGxhYmVsOiAnRW1haWwnLCB0eXBlOiAndGV4dCcgfSxcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6ICdQYXNzd29yZCcsIHR5cGU6ICdwYXNzd29yZCcgfSxcbiAgICAgIH0sXG4gICAgICBhc3luYyBhdXRob3JpemUoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgaWYgKCFjcmVkZW50aWFscz8uZW1haWwgfHwgIWNyZWRlbnRpYWxzPy5wYXNzd29yZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjcmVkZW50aWFscycpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgY29ubmVjdERCKCk7XG5cbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIuZmluZE9uZSh7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9KTtcblxuICAgICAgICBpZiAoIXVzZXIgfHwgIXVzZXIucGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY3JlZGVudGlhbHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzQ29ycmVjdFBhc3N3b3JkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoXG4gICAgICAgICAgY3JlZGVudGlhbHMucGFzc3dvcmQsXG4gICAgICAgICAgdXNlci5wYXNzd29yZFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICghaXNDb3JyZWN0UGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY3JlZGVudGlhbHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IHVzZXIuX2lkLnRvU3RyaW5nKCksXG4gICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgIGltYWdlOiB1c2VyLmltYWdlLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyLCBhY2NvdW50IH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcbiAgICAgICAgdG9rZW4ucm9sZSA9IHVzZXIucm9sZTtcbiAgICAgICAgdG9rZW4uZW1haWwgPSB1c2VyLmVtYWlsO1xuICAgICAgICAvLyBTZXQgYWRtaW4gcm9sZSBmb3Igc3BlY2lmaWMgZW1haWxcbiAgICAgICAgaWYgKHVzZXIuZW1haWwgPT09ICdtaWthZWxyMTEyQGdtYWlsLmNvbScpIHtcbiAgICAgICAgICB0b2tlbi5yb2xlID0gJ2FkbWluJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH0sXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcbiAgICAgIGlmICh0b2tlbiAmJiBzZXNzaW9uLnVzZXIpIHtcbiAgICAgICAgc2Vzc2lvbi51c2VyLmlkID0gdG9rZW4uaWQgYXMgc3RyaW5nO1xuICAgICAgICBzZXNzaW9uLnVzZXIucm9sZSA9IHRva2VuLnJvbGUgYXMgc3RyaW5nO1xuICAgICAgICBzZXNzaW9uLnVzZXIuZW1haWwgPSB0b2tlbi5lbWFpbCBhcyBzdHJpbmc7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9LFxuICAgIGFzeW5jIHNpZ25Jbih7IHVzZXIsIGFjY291bnQgfSkge1xuICAgICAgaWYgKGFjY291bnQ/LnByb3ZpZGVyID09PSAnZ29vZ2xlJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGNvbm5lY3REQigpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIENoZWNrIGlmIHVzZXIgZXhpc3RzXG4gICAgICAgICAgY29uc3QgZXhpc3RpbmdVc2VyID0gYXdhaXQgVXNlci5maW5kT25lKHsgZW1haWw6IHVzZXIuZW1haWwgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKCFleGlzdGluZ1VzZXIpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgdXNlclxuICAgICAgICAgICAgYXdhaXQgVXNlci5jcmVhdGUoe1xuICAgICAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgICAgICBpbWFnZTogdXNlci5pbWFnZSxcbiAgICAgICAgICAgICAgcm9sZTogJ1VTRVInLFxuICAgICAgICAgICAgICBlbWFpbFZlcmlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIHNpZ25JbiBjYWxsYmFjazonLCBlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgYXN5bmMgcmVkaXJlY3QoeyB1cmwsIGJhc2VVcmwgfSkge1xuICAgICAgLy8gRml4IHJlZGlyZWN0IGxvZ2ljXG4gICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgICAgICByZXR1cm4gYCR7YmFzZVVybH0ke3VybH1gO1xuICAgICAgfVxuICAgICAgaWYgKHVybC5zdGFydHNXaXRoKGJhc2VVcmwpKSB7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZVVybDtcbiAgICB9LFxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogJy9hdXRoL3NpZ25pbicsXG4gICAgZXJyb3I6ICcvYXV0aC9lcnJvcicsXG4gIH0sXG4gIHNlc3Npb246IHtcbiAgICBzdHJhdGVneTogJ2p3dCcsXG4gIH0sXG4gIGRlYnVnOiB0cnVlLFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbn07XG5cbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aChhdXRoT3B0aW9ucyk7XG5leHBvcnQgeyBoYW5kbGVyIGFzIEdFVCwgaGFuZGxlciBhcyBQT1NUIH07Il0sIm5hbWVzIjpbIk5leHRBdXRoIiwiQ3JlZGVudGlhbHNQcm92aWRlciIsIkdvb2dsZVByb3ZpZGVyIiwiYmNyeXB0IiwiVXNlciIsImNvbm5lY3REQiIsImF1dGhPcHRpb25zIiwicHJvdmlkZXJzIiwiY2xpZW50SWQiLCJwcm9jZXNzIiwiZW52IiwiR09PR0xFX0NMSUVOVF9JRCIsImNsaWVudFNlY3JldCIsIkdPT0dMRV9DTElFTlRfU0VDUkVUIiwibmFtZSIsImNyZWRlbnRpYWxzIiwiZW1haWwiLCJsYWJlbCIsInR5cGUiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsIkVycm9yIiwidXNlciIsImZpbmRPbmUiLCJpc0NvcnJlY3RQYXNzd29yZCIsImNvbXBhcmUiLCJpZCIsIl9pZCIsInRvU3RyaW5nIiwiaW1hZ2UiLCJyb2xlIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJhY2NvdW50Iiwic2Vzc2lvbiIsInNpZ25JbiIsInByb3ZpZGVyIiwiZXhpc3RpbmdVc2VyIiwiY3JlYXRlIiwiZW1haWxWZXJpZmllZCIsIkRhdGUiLCJlcnJvciIsImNvbnNvbGUiLCJyZWRpcmVjdCIsInVybCIsImJhc2VVcmwiLCJzdGFydHNXaXRoIiwicGFnZXMiLCJzdHJhdGVneSIsImRlYnVnIiwic2VjcmV0IiwiTkVYVEFVVEhfU0VDUkVUIiwiaGFuZGxlciIsIkdFVCIsIlBPU1QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/mongodb.ts":
/*!****************************!*\
  !*** ./src/lib/mongodb.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectDB: () => (/* binding */ connectDB),\n/* harmony export */   disconnectDB: () => (/* binding */ disconnectDB)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nif (!process.env.MONGODB_URI) {\n    throw new Error(\"Please add your Mongo URI to .env.local\");\n}\nconst MONGODB_URI = process.env.MONGODB_URI;\nconst options = {\n    useNewUrlParser: true,\n    useUnifiedTopology: true,\n    maxPoolSize: 10,\n    serverSelectionTimeoutMS: 5000,\n    socketTimeoutMS: 45000,\n    retryWrites: true\n};\n// Create the default connection\nconst connectDB = async ()=>{\n    try {\n        if ((mongoose__WEBPACK_IMPORTED_MODULE_0___default().connection).readyState >= 1) {\n            console.log(\"Using existing MongoDB connection\");\n            return (mongoose__WEBPACK_IMPORTED_MODULE_0___default());\n        }\n        console.log(\"Connecting to MongoDB...\");\n        console.log(\"MongoDB URI:\", MONGODB_URI.replace(/:[^:@]+@/, \":****@\")); // Hide password in logs\n        const conn = await mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, options);\n        console.log(\"MongoDB connection successful\");\n        // Add error handlers\n        mongoose__WEBPACK_IMPORTED_MODULE_0___default().connection.on(\"error\", (err)=>{\n            console.error(\"MongoDB connection error:\", err);\n        });\n        mongoose__WEBPACK_IMPORTED_MODULE_0___default().connection.on(\"disconnected\", ()=>{\n            console.warn(\"MongoDB disconnected. Attempting to reconnect...\");\n        });\n        mongoose__WEBPACK_IMPORTED_MODULE_0___default().connection.on(\"reconnected\", ()=>{\n            console.log(\"MongoDB reconnected\");\n        });\n        return conn;\n    } catch (error) {\n        console.error(\"MongoDB connection error:\", error);\n        throw new Error(\"Failed to connect to MongoDB. Please check your connection string and make sure your IP is whitelisted.\");\n    }\n};\nconst disconnectDB = async ()=>{\n    try {\n        if ((mongoose__WEBPACK_IMPORTED_MODULE_0___default().connection).readyState === 0) {\n            console.log(\"MongoDB already disconnected\");\n            return;\n        }\n        await mongoose__WEBPACK_IMPORTED_MODULE_0___default().disconnect();\n        console.log(\"MongoDB disconnected successfully\");\n    } catch (error) {\n        console.error(\"Error disconnecting from MongoDB:\", error);\n        throw error;\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL21vbmdvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFnQztBQVNoQyxJQUFJLENBQUNDLFFBQVFDLEdBQUcsQ0FBQ0MsV0FBVyxFQUFFO0lBQzVCLE1BQU0sSUFBSUMsTUFBTTtBQUNsQjtBQUVBLE1BQU1ELGNBQWNGLFFBQVFDLEdBQUcsQ0FBQ0MsV0FBVztBQUUzQyxNQUFNRSxVQUFVO0lBQ2RDLGlCQUFpQjtJQUNqQkMsb0JBQW9CO0lBQ3BCQyxhQUFhO0lBQ2JDLDBCQUEwQjtJQUMxQkMsaUJBQWlCO0lBQ2pCQyxhQUFhO0FBQ2Y7QUFFQSxnQ0FBZ0M7QUFDekIsTUFBTUMsWUFBWTtJQUN2QixJQUFJO1FBQ0YsSUFBSVosNERBQW1CLENBQUNjLFVBQVUsSUFBSSxHQUFHO1lBQ3ZDQyxRQUFRQyxHQUFHLENBQUM7WUFDWixPQUFPaEIsaURBQVFBO1FBQ2pCO1FBRUFlLFFBQVFDLEdBQUcsQ0FBQztRQUNaRCxRQUFRQyxHQUFHLENBQUMsZ0JBQWdCYixZQUFZYyxPQUFPLENBQUMsWUFBWSxZQUFZLHdCQUF3QjtRQUVoRyxNQUFNQyxPQUFPLE1BQU1sQix1REFBZ0IsQ0FBQ0csYUFBYUU7UUFFakRVLFFBQVFDLEdBQUcsQ0FBQztRQUVaLHFCQUFxQjtRQUNyQmhCLDBEQUFtQixDQUFDb0IsRUFBRSxDQUFDLFNBQVMsQ0FBQ0M7WUFDL0JOLFFBQVFPLEtBQUssQ0FBQyw2QkFBNkJEO1FBQzdDO1FBRUFyQiwwREFBbUIsQ0FBQ29CLEVBQUUsQ0FBQyxnQkFBZ0I7WUFDckNMLFFBQVFRLElBQUksQ0FBQztRQUNmO1FBRUF2QiwwREFBbUIsQ0FBQ29CLEVBQUUsQ0FBQyxlQUFlO1lBQ3BDTCxRQUFRQyxHQUFHLENBQUM7UUFDZDtRQUVBLE9BQU9FO0lBQ1QsRUFBRSxPQUFPSSxPQUFPO1FBQ2RQLFFBQVFPLEtBQUssQ0FBQyw2QkFBNkJBO1FBQzNDLE1BQU0sSUFBSWxCLE1BQU07SUFDbEI7QUFDRixFQUFFO0FBRUssTUFBTW9CLGVBQWU7SUFDMUIsSUFBSTtRQUNGLElBQUl4Qiw0REFBbUIsQ0FBQ2MsVUFBVSxLQUFLLEdBQUc7WUFDeENDLFFBQVFDLEdBQUcsQ0FBQztZQUNaO1FBQ0Y7UUFDQSxNQUFNaEIsMERBQW1CO1FBQ3pCZSxRQUFRQyxHQUFHLENBQUM7SUFDZCxFQUFFLE9BQU9NLE9BQU87UUFDZFAsUUFBUU8sS0FBSyxDQUFDLHFDQUFxQ0E7UUFDbkQsTUFBTUE7SUFDUjtBQUNGLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zcXVhcmVvbmVyZW50YWxzd2ViLy4vc3JjL2xpYi9tb25nb2RiLnRzPzUzYzIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcblxuLy8gR2xvYmFsIGlzIHVzZWQgaGVyZSB0byBtYWludGFpbiBhIGNhY2hlZCBjb25uZWN0aW9uIGFjcm9zcyBob3QgcmVsb2Fkc1xuLy8gaW4gZGV2ZWxvcG1lbnQuIFRoaXMgcHJldmVudHMgY29ubmVjdGlvbnMgZ3Jvd2luZyBleHBvbmVudGlhbGx5XG4vLyBkdXJpbmcgQVBJIHJvdXRlIHVzYWdlLlxuZGVjbGFyZSBnbG9iYWwge1xuICB2YXIgbW9uZ29vc2U6IHR5cGVvZiBpbXBvcnQoJ21vbmdvb3NlJyk7XG59XG5cbmlmICghcHJvY2Vzcy5lbnYuTU9OR09EQl9VUkkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgYWRkIHlvdXIgTW9uZ28gVVJJIHRvIC5lbnYubG9jYWwnKTtcbn1cblxuY29uc3QgTU9OR09EQl9VUkkgPSBwcm9jZXNzLmVudi5NT05HT0RCX1VSSTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgdXNlTmV3VXJsUGFyc2VyOiB0cnVlLFxuICB1c2VVbmlmaWVkVG9wb2xvZ3k6IHRydWUsXG4gIG1heFBvb2xTaXplOiAxMCxcbiAgc2VydmVyU2VsZWN0aW9uVGltZW91dE1TOiA1MDAwLCAvLyBLZWVwIHRyeWluZyB0byBzZW5kIG9wZXJhdGlvbnMgZm9yIDUgc2Vjb25kc1xuICBzb2NrZXRUaW1lb3V0TVM6IDQ1MDAwLCAvLyBDbG9zZSBzb2NrZXRzIGFmdGVyIDQ1IHNlY29uZHMgb2YgaW5hY3Rpdml0eVxuICByZXRyeVdyaXRlczogdHJ1ZSxcbn07XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBjb25uZWN0aW9uXG5leHBvcnQgY29uc3QgY29ubmVjdERCID0gYXN5bmMgKCkgPT4ge1xuICB0cnkge1xuICAgIGlmIChtb25nb29zZS5jb25uZWN0aW9uLnJlYWR5U3RhdGUgPj0gMSkge1xuICAgICAgY29uc29sZS5sb2coJ1VzaW5nIGV4aXN0aW5nIE1vbmdvREIgY29ubmVjdGlvbicpO1xuICAgICAgcmV0dXJuIG1vbmdvb3NlO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdDb25uZWN0aW5nIHRvIE1vbmdvREIuLi4nKTtcbiAgICBjb25zb2xlLmxvZygnTW9uZ29EQiBVUkk6JywgTU9OR09EQl9VUkkucmVwbGFjZSgvOlteOkBdK0AvLCAnOioqKipAJykpOyAvLyBIaWRlIHBhc3N3b3JkIGluIGxvZ3NcblxuICAgIGNvbnN0IGNvbm4gPSBhd2FpdCBtb25nb29zZS5jb25uZWN0KE1PTkdPREJfVVJJLCBvcHRpb25zKTtcbiAgICBcbiAgICBjb25zb2xlLmxvZygnTW9uZ29EQiBjb25uZWN0aW9uIHN1Y2Nlc3NmdWwnKTtcbiAgICBcbiAgICAvLyBBZGQgZXJyb3IgaGFuZGxlcnNcbiAgICBtb25nb29zZS5jb25uZWN0aW9uLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ01vbmdvREIgY29ubmVjdGlvbiBlcnJvcjonLCBlcnIpO1xuICAgIH0pO1xuXG4gICAgbW9uZ29vc2UuY29ubmVjdGlvbi5vbignZGlzY29ubmVjdGVkJywgKCkgPT4ge1xuICAgICAgY29uc29sZS53YXJuKCdNb25nb0RCIGRpc2Nvbm5lY3RlZC4gQXR0ZW1wdGluZyB0byByZWNvbm5lY3QuLi4nKTtcbiAgICB9KTtcblxuICAgIG1vbmdvb3NlLmNvbm5lY3Rpb24ub24oJ3JlY29ubmVjdGVkJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ01vbmdvREIgcmVjb25uZWN0ZWQnKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb25uO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ01vbmdvREIgY29ubmVjdGlvbiBlcnJvcjonLCBlcnJvcik7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gY29ubmVjdCB0byBNb25nb0RCLiBQbGVhc2UgY2hlY2sgeW91ciBjb25uZWN0aW9uIHN0cmluZyBhbmQgbWFrZSBzdXJlIHlvdXIgSVAgaXMgd2hpdGVsaXN0ZWQuJyk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBkaXNjb25uZWN0REIgPSBhc3luYyAoKSA9PiB7XG4gIHRyeSB7XG4gICAgaWYgKG1vbmdvb3NlLmNvbm5lY3Rpb24ucmVhZHlTdGF0ZSA9PT0gMCkge1xuICAgICAgY29uc29sZS5sb2coJ01vbmdvREIgYWxyZWFkeSBkaXNjb25uZWN0ZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXdhaXQgbW9uZ29vc2UuZGlzY29ubmVjdCgpO1xuICAgIGNvbnNvbGUubG9nKCdNb25nb0RCIGRpc2Nvbm5lY3RlZCBzdWNjZXNzZnVsbHknKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkaXNjb25uZWN0aW5nIGZyb20gTW9uZ29EQjonLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG4iXSwibmFtZXMiOlsibW9uZ29vc2UiLCJwcm9jZXNzIiwiZW52IiwiTU9OR09EQl9VUkkiLCJFcnJvciIsIm9wdGlvbnMiLCJ1c2VOZXdVcmxQYXJzZXIiLCJ1c2VVbmlmaWVkVG9wb2xvZ3kiLCJtYXhQb29sU2l6ZSIsInNlcnZlclNlbGVjdGlvblRpbWVvdXRNUyIsInNvY2tldFRpbWVvdXRNUyIsInJldHJ5V3JpdGVzIiwiY29ubmVjdERCIiwiY29ubmVjdGlvbiIsInJlYWR5U3RhdGUiLCJjb25zb2xlIiwibG9nIiwicmVwbGFjZSIsImNvbm4iLCJjb25uZWN0Iiwib24iLCJlcnIiLCJlcnJvciIsIndhcm4iLCJkaXNjb25uZWN0REIiLCJkaXNjb25uZWN0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/mongodb.ts\n");

/***/ }),

/***/ "(rsc)/./src/models/User.ts":
/*!****************************!*\
  !*** ./src/models/User.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   User: () => (/* binding */ User)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst userSchema = new (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema)({\n    name: {\n        type: String,\n        required: true\n    },\n    email: {\n        type: String,\n        required: true,\n        unique: true\n    },\n    emailVerified: {\n        type: Date\n    },\n    image: {\n        type: String\n    },\n    password: {\n        type: String\n    },\n    role: {\n        type: String,\n        enum: [\n            \"USER\",\n            \"ADMIN\"\n        ],\n        default: \"USER\"\n    },\n    favorites: [\n        {\n            type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,\n            ref: \"Listing\"\n        }\n    ]\n}, {\n    timestamps: true\n});\nconst User = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().models).User || mongoose__WEBPACK_IMPORTED_MODULE_0___default().model(\"User\", userSchema);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbW9kZWxzL1VzZXIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXNEO0FBZXRELE1BQU1FLGFBQXFCLElBQUlGLHdEQUFlLENBQUM7SUFDN0NHLE1BQU07UUFBRUMsTUFBTUM7UUFBUUMsVUFBVTtJQUFLO0lBQ3JDQyxPQUFPO1FBQUVILE1BQU1DO1FBQVFDLFVBQVU7UUFBTUUsUUFBUTtJQUFLO0lBQ3BEQyxlQUFlO1FBQUVMLE1BQU1NO0lBQUs7SUFDNUJDLE9BQU87UUFBRVAsTUFBTUM7SUFBTztJQUN0Qk8sVUFBVTtRQUFFUixNQUFNQztJQUFPO0lBQ3pCUSxNQUFNO1FBQUVULE1BQU1DO1FBQVFTLE1BQU07WUFBQztZQUFRO1NBQVE7UUFBRUMsU0FBUztJQUFPO0lBQy9EQyxXQUFXO1FBQUM7WUFBRVosTUFBTUgsNENBQU1BLENBQUNnQixLQUFLLENBQUNDLFFBQVE7WUFBRUMsS0FBSztRQUFVO0tBQUU7QUFDOUQsR0FBRztJQUNEQyxZQUFZO0FBQ2Q7QUFFTyxNQUFNQyxPQUFPckIsd0RBQWUsQ0FBQ3FCLElBQUksSUFBSXJCLHFEQUFjLENBQVEsUUFBUUUsWUFBWSIsInNvdXJjZXMiOlsid2VicGFjazovL3NxdWFyZW9uZXJlbnRhbHN3ZWIvLi9zcmMvbW9kZWxzL1VzZXIudHM/MDk2ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9uZ29vc2UsIHsgRG9jdW1lbnQsIFNjaGVtYSB9IGZyb20gJ21vbmdvb3NlJztcblxuZXhwb3J0IGludGVyZmFjZSBJVXNlciBleHRlbmRzIERvY3VtZW50IHtcbiAgX2lkOiBtb25nb29zZS5UeXBlcy5PYmplY3RJZDtcbiAgbmFtZTogc3RyaW5nO1xuICBlbWFpbDogc3RyaW5nO1xuICBlbWFpbFZlcmlmaWVkPzogRGF0ZTtcbiAgaW1hZ2U/OiBzdHJpbmc7XG4gIHBhc3N3b3JkPzogc3RyaW5nO1xuICByb2xlOiAnVVNFUicgfCAnQURNSU4nO1xuICBmYXZvcml0ZXM6IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkW107XG4gIGNyZWF0ZWRBdDogRGF0ZTtcbiAgdXBkYXRlZEF0OiBEYXRlO1xufVxuXG5jb25zdCB1c2VyU2NoZW1hOiBTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgbmFtZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gIGVtYWlsOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZSB9LFxuICBlbWFpbFZlcmlmaWVkOiB7IHR5cGU6IERhdGUgfSxcbiAgaW1hZ2U6IHsgdHlwZTogU3RyaW5nIH0sXG4gIHBhc3N3b3JkOiB7IHR5cGU6IFN0cmluZyB9LFxuICByb2xlOiB7IHR5cGU6IFN0cmluZywgZW51bTogWydVU0VSJywgJ0FETUlOJ10sIGRlZmF1bHQ6ICdVU0VSJyB9LFxuICBmYXZvcml0ZXM6IFt7IHR5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnTGlzdGluZycgfV0sXG59LCB7XG4gIHRpbWVzdGFtcHM6IHRydWUsXG59KTtcblxuZXhwb3J0IGNvbnN0IFVzZXIgPSBtb25nb29zZS5tb2RlbHMuVXNlciB8fCBtb25nb29zZS5tb2RlbDxJVXNlcj4oJ1VzZXInLCB1c2VyU2NoZW1hKTtcbiJdLCJuYW1lcyI6WyJtb25nb29zZSIsIlNjaGVtYSIsInVzZXJTY2hlbWEiLCJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwiZW1haWwiLCJ1bmlxdWUiLCJlbWFpbFZlcmlmaWVkIiwiRGF0ZSIsImltYWdlIiwicGFzc3dvcmQiLCJyb2xlIiwiZW51bSIsImRlZmF1bHQiLCJmYXZvcml0ZXMiLCJUeXBlcyIsIk9iamVjdElkIiwicmVmIiwidGltZXN0YW1wcyIsIlVzZXIiLCJtb2RlbHMiLCJtb2RlbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/models/User.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/uuid","vendor-chunks/oauth","vendor-chunks/@panva","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/oidc-token-hash","vendor-chunks/bcryptjs","vendor-chunks/preact","vendor-chunks/object-hash","vendor-chunks/lru-cache","vendor-chunks/cookie"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cmikae%5CDownloads%5Csquareonerentalswebsite%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmikae%5CDownloads%5Csquareonerentalswebsite&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();