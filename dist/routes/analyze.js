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
const multer_1 = __importDefault(require("multer"));
const extractText_1 = require("../utils/extractText");
const analyzeResume_1 = require("../utils/analyzeResume");
const supabase_1 = require("../lib/supabase");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PDF, DOCX, TXT allowed.'));
        }
    }
});
router.post('/', upload.single('resume'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { jobDescription, userId } = req.body;
        const resumeText = yield (0, extractText_1.extractTextFromFile)(req.file.buffer, req.file.mimetype, req.file.originalname);
        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ error: 'Could not extract text from file.' });
        }
        const analysis = yield (0, analyzeResume_1.analyzeResumeWithAI)(resumeText, jobDescription);
        let savedId = null;
        if (userId) {
            const supabase = (0, supabase_1.getSupabase)();
            const { data, error } = yield supabase
                .from('analyses')
                .insert({
                user_id: userId,
                resume_filename: req.file.originalname,
                resume_text: resumeText,
                job_description: jobDescription || null,
                overall_score: analysis.overall_score,
                section_scores: analysis.section_scores,
                issues: analysis.issues,
                keywords_found: analysis.keywords_found,
                keywords_missing: analysis.keywords_missing,
                strengths: analysis.strengths,
                quick_wins: analysis.quick_wins,
                word_count: analysis.word_count,
                pass_rate: analysis.pass_rate
            })
                .select('id')
                .single();
            if (!error && data) {
                savedId = data.id;
            }
        }
        return res.json(Object.assign({ success: true, analysisId: savedId, filename: req.file.originalname }, analysis));
    }
    catch (error) {
        console.error('Analysis error:', error);
        return res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
