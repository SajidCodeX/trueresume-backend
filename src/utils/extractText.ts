const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';

export async function extractTextFromFile(
  buffer: Buffer,
  mimetype: string,
  originalname: string
): Promise<string> {
  const ext = originalname.split('.').pop()?.toLowerCase();

  // Plain text
  if (ext === 'txt' || mimetype === 'text/plain') {
    return buffer.toString('utf-8');
  }

  // DOCX
  if (ext === 'docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // PDF
  if (ext === 'pdf' || mimetype === 'application/pdf') {
    const result = await pdfParse(buffer);
    return result.text;
  }

  throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT.');
}