import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import Wishlist from '../models/Wishlist.js';
import Event from '../models/Event.js';

const router = Router();

// Add to wishlist
router.post('/:eventId', authenticate, async (req, res) => {
  try {
    const wishlist = await Wishlist.create({ user: req.user.id, event: req.params.eventId });
    await Event.findByIdAndUpdate(req.params.eventId, { $inc: { wishlistCount: 1 } });
    res.status(201).json({ wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove from wishlist
router.delete('/:eventId', authenticate, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.user.id, event: req.params.eventId });
    await Event.findByIdAndUpdate(req.params.eventId, { $inc: { wishlistCount: -1 } });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's wishlist
router.get('/', authenticate, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id }).populate('event');
    res.json({ wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if event is in wishlist
router.get('/:eventId/check', authenticate, async (req, res) => {
  try {
    const exists = await Wishlist.findOne({ user: req.user.id, event: req.params.eventId });
    res.json({ isInWishlist: !!exists });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
