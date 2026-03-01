"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromFile = void 0;
const pdfParse = require('pdf-parse');
const mammoth_1 = __importDefault(require("mammoth"));
async function extractTextFromFile(buffer, mimetype, originalname) {
    const ext = originalname.split('.').pop()?.toLowerCase();
    // Plain text
    if (ext === 'txt' || mimetype === 'text/plain') {
        return buffer.toString('utf-8');
    }
    // DOCX
    if (ext === 'docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth_1.default.extractRawText({ buffer });
        return result.value;
    }
    // PDF
    if (ext === 'pdf' || mimetype === 'application/pdf') {
        const result = await pdfParse(buffer);
        return result.text;
    }
    throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT.');
}
exports.extractTextFromFile = extractTextFromFile;
//# sourceMappingURL=extractText.js.map