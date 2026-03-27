"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveStatic = serveStatic;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
function serveStatic(app) {
    const publicPath = path_1.default.resolve(process.cwd(), "public");
    app.use(express_1.default.static(publicPath));
}
