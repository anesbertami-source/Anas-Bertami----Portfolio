const express  = require('express');
const nodemailer = require('nodemailer');
const cors     = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(cors({
  origin: [
    process.env.ALLOWED_ORIGIN || 'https:
    'http:
    'http:
  ],
  methods: ['POST'],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests. Please try again in 15 minutes.' },
});

app.use('/send', limiter);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.post('/send', async (req, res) => {
  const { name, email, subject, message } = req.body;

  
  if (!name || !email || !message) {
    return res.status(422).json({ error: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({ error: 'Please provide a valid email address.' });
  }

  const mailOptions = {
    from:     `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to:       'anesbertami@gmail.com',
    replyTo:  `"${name}" <${email}>`,
    subject:  `[Portfolio] ${subject || 'New message from ' + name}`,
    text: [
      'You have a new message from your portfolio contact form.',
      '─'.repeat(50),
      '',
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Subject: ${subject || '(none)'}`,
      '',
      'Message:',
      message,
      '',
      '─'.repeat(50),
      `Date: ${new Date().toISOString()}`,
    ].join('\n'),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[${new Date().toISOString()}] Email sent from: ${email}`);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('[Mail Error]', err.message);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`✅ Contact server running on http:
});