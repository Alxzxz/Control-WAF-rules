const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Rule = require('./models/Rule');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/waf_rules', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Routes
// Get all rules
app.get('/api/rules', async (req, res) => {
    try {
        const rules = await Rule.find();
        res.json(rules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new rule
app.post('/api/rules', async (req, res) => {
    const rule = new Rule({
        name: req.body.name,
        id: req.body.id,
        description: req.body.description,
        status: req.body.status,
        severity: req.body.severity
    });

    try {
        const newRule = await rule.save();
        res.status(201).json(newRule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update rule status
app.patch('/api/rules/:id/status', async (req, res) => {
    try {
        const rule = await Rule.findOne({ id: req.params.id });
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        rule.status = rule.status === 'active' ? 'inactive' : 'active';
        const updatedRule = await rule.save();
        res.json(updatedRule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add comment to rule
app.post('/api/rules/:id/comments', async (req, res) => {
    try {
        const rule = await Rule.findOne({ id: req.params.id });
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        rule.comments.push({ text: req.body.text });
        const updatedRule = await rule.save();
        res.json(updatedRule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update rule
app.put('/api/rules/:id', async (req, res) => {
    try {
        const rule = await Rule.findOne({ id: req.params.id });
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        
        rule.name = req.body.name;
        rule.description = req.body.description;
        rule.status = req.body.status;
        rule.severity = req.body.severity;
        
        const updatedRule = await rule.save();
        res.json(updatedRule)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete rule
app.delete('/api/rules/:id', async (req, res) => {
    try {
        const rule = await Rule.findOneAndDelete({ id: req.params.id });
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        res.json({ message: 'Rule deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
