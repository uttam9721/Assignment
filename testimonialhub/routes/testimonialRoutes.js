import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/submit');
});

// Submit form page
router.get('/submit', (req, res) => {
  res.render('form', { error: null });
});

// Handle form POST
router.post('/submit', async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.render('form', { error: 'Both fields are required!' });
  }

  try {
    const newTestimonial = await Testimonial.create({ name, message });
    res.redirect(`/testimonial/${newTestimonial._id}`);
  } catch (err) {
    res.render('form', { error: 'Error saving testimonial.' });
  }
});

// All testimonials
router.get('/testimonials', async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.render('all', { testimonials });
});

// Individual testimonial
router.get('/testimonial/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.send('Not found!');
    res.render('individual', { testimonial });
  } catch {
    res.send('Invalid link');
  }
});

export default router;
