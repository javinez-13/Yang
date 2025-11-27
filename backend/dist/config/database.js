"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
exports.pool = new pg_1.Pool({
    connectionString: env_1.env.databaseUrl,
    ssl: {
        rejectUnauthorized: false,
    },
});
const query = (text, params) => exports.pool.query(text, params);
exports.query = query;
//# sourceMappingURL=database.js.map