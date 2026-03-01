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
exports.extractTextFromFile = void 0;
const pdfParse = require('pdf-parse');
const mammoth_1 = __importDefault(require("mammoth"));
function extractTextFromFile(buffer, mimetype, originalname) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const ext = (_a = originalname.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        // Plain text
        if (ext === 'txt' || mimetype === 'text/plain') {
            return buffer.toString('utf-8');
        }
        // DOCX
        if (ext === 'docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = yield mammoth_1.default.extractRawText({ buffer });
            return result.value;
        }
        // PDF
        if (ext === 'pdf' || mimetype === 'application/pdf') {
            const result = yield pdfParse(buffer);
            return result.text;
        }
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT.');
    });
}
exports.extractTextFromFile = extractTextFromFile;
