"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const start = async () => {
    try {
        const client = await database_1.pool.connect();
        client.release();
        app_1.default.listen(env_1.env.port, () => {
            console.log(`API listening on port ${env_1.env.port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map