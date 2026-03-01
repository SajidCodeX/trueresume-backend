"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../lib/supabase");
const router = express_1.default.Router();
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supabase = (0, supabase_1.getSupabase)();
        const { userId } = req.params;
        const { data, error } = yield supabase
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
}));
router.get('/single/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supabase = (0, supabase_1.getSupabase)();
        const { id } = req.params;
        const { data, error } = yield supabase
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
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supabase = (0, supabase_1.getSupabase)();
        const { id } = req.params;
        const { error } = yield supabase
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
}));
exports.default = router;
