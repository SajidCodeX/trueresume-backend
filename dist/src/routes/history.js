"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../../lib/supabase");
const router = express_1.default.Router();
router.get('/:userId', async (req, res) => {
    try {
        const supabase = (0, supabase_1.getSupabase)();
        const { userId } = req.params;
        const { data, error } = await supabase
            .from('analyses')
            .select('id, resume_filename, overall_score, pass_rate, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return res.json({ success: true, analyses: data });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get('/single/:id', async (req, res) => {
    try {
        const supabase = (0, supabase_1.getSupabase)();
        const { id } = req.params;
        const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!data)
            return res.status(404).json({ error: 'Not found' });
        return res.json({ success: true, analysis: data });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const supabase = (0, supabase_1.getSupabase)();
        const { id } = req.params;
        const { error } = await supabase
            .from('analyses')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return res.json({ success: true });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=history.js.map