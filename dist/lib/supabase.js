"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
let supabase = null;
function getSupabase() {
    if (!supabase) {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error("Supabase env missing");
        }
        supabase = (0, supabase_js_1.createClient)(url, key);
    }
    return supabase;
}
exports.getSupabase = getSupabase;
//# sourceMappingURL=supabase.js.map