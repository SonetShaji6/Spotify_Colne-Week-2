const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'your_jwt_secret'; 

const signup = async (req, res) => {
  try {
    const { email, phone, password } = req.body;


    if (!email || !phone || !password) {
      return res.status(400).json({ message: 'Email, phone, and password are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, phone, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const signin = async (req, res) => {
  try {
    const { identifier, password } = req.body; 

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier (email or phone) and password are required' });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    // Log the type of identifier being used
    console.log(`Attempting to sign in with ${isEmail ? 'email' : 'phone'}: ${identifier}`);

    // Find the user
    const user = await User.findOne(isEmail ? { email: identifier } : { phone: identifier });

    if (!user) {
      console.log('No user found for identifier:', identifier); // Log for debugging
      return res.status(400).json({ message: 'User not found' });
    }

 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Sign-in successful' });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { signup, signin };
