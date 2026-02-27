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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeResumeWithAI = void 0;
var sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
var client = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY
});
function analyzeResumeWithAI(resumeText, jobDescription) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, message, responseText, cleaned;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompt = "You are an expert ATS (Applicant Tracking System) analyst with 10+ years of experience in HR tech.\n\nAnalyze this resume for ATS compatibility and return ONLY a valid JSON object with no extra text.\n\nRESUME TEXT:\n".concat(resumeText, "\n\n").concat(jobDescription ? "JOB DESCRIPTION:\n".concat(jobDescription) : '', "\n\nReturn this exact JSON structure:\n{\n  \"overall_score\": <0-100 integer>,\n  \"section_scores\": {\n    \"formatting\": <0-100>,\n    \"keywords\": <0-100>,\n    \"readability\": <0-100>,\n    \"contact_info\": <0-100>,\n    \"work_experience\": <0-100>,\n    \"education\": <0-100>,\n    \"skills\": <0-100>\n  },\n  \"issues\": [\n    {\n      \"severity\": \"high|medium|low\",\n      \"category\": \"formatting|keywords|structure|content\",\n      \"title\": \"<issue title>\",\n      \"description\": \"<what the issue is>\",\n      \"suggestion\": \"<how to fix it>\"\n    }\n  ],\n  \"keywords_found\": [\"<keyword1>\", \"<keyword2>\"],\n  \"keywords_missing\": [\"<keyword1>\", \"<keyword2>\"],\n  \"strengths\": [\"<strength1>\", \"<strength2>\"],\n  \"quick_wins\": [\"<quick win1>\", \"<quick win2>\"],\n  \"word_count\": <integer>,\n  \"pass_rate\": \"Low|Medium|High|Very High\"\n}");
                    return [4 /*yield*/, client.messages.create({
                            model: 'claude-sonnet-4-6',
                            max_tokens: 2000,
                            messages: [{ role: 'user', content: prompt }]
                        })];
                case 1:
                    message = _a.sent();
                    responseText = message.content[0].type === 'text'
                        ? message.content[0].text
                        : '';
                    cleaned = responseText
                        .replace(/```json/g, '')
                        .replace(/```/g, '')
                        .trim();
                    return [2 /*return*/, JSON.parse(cleaned)];
            }
        });
    });
}
exports.analyzeResumeWithAI = analyzeResumeWithAI;
//# sourceMappingURL=analyzeResume.js.map