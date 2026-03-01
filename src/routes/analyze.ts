import express from 'express';
import multer from 'multer';
import { extractTextFromFile } from '../utils/extractText';
import { analyzeResumeWithAI } from '../utils/analyzeResume';
import { getSupabase } from '../../lib/supabase';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ 
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
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, TXT allowed.'));
    }
  }
});

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { jobDescription, userId } = req.body;

    const resumeText = await extractTextFromFile(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract text from file.' });
    }

    const analysis = await analyzeResumeWithAI(resumeText, jobDescription);

    let savedId = null;

    if (userId) {
      const supabase = getSupabase();

      const { data, error } = await supabase
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

    return res.json({
      success: true,
      analysisId: savedId,
      filename: req.file.originalname,
      ...analysis
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;