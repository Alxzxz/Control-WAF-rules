const express = require('express');
const router = express.Router();
const Rule = require('../models/Rule');

router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.status && req.query.status !== 'all') {
      query.active = req.query.status;
    }
    if (req.query.group) {
      query.group = { $regex: req.query.group, $options: 'i' };
    }

    const rules = await Rule.find(query).sort({ createdAt: -1 });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const rule = new Rule(req.body);
  try {
    const newRule = await rule.save();
    res.status(201).json(newRule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/comments', async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    rule.comments.push({ text: req.body.text });
    await rule.save();
    res.json(rule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Rule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rule deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
