import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// Get all analyses for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('analyses')
      .select('id, resume_filename, overall_score, pass_rate, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({ success: true, analyses: data });

  } catch (error: any) {
    console.error('History error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Get single analysis by ID
router.get('/single/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Analysis not found' });

    return res.json({ success: true, analysis: data });

  } catch (error: any) {
    console.error('Single analysis error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete analysis
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.json({ success: true, message: 'Analysis deleted' });

  } catch (error: any) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;