const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Función helper para generar JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// ── POST /api/auth/register ─────────────────────────────────────────────────
// ── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        console.log('DEBUG: Register payload received:', req.body);
        const { name, lastName, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verificar si el email ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Ya existe una cuenta con ese correo' });
        }

        const user = await User.create({ name, lastName, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages[0] });
        }
        console.error('Register error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// ── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
// Verifica el token y devuelve los datos del usuario
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                avatarUrl: user.avatarUrl // Si agregamos avatarUrl al modelo en el futuro
            },
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        console.error('Me error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// ── PUT /api/auth/profile ────────────────────────────────────────────────────
// Actualizar datos del usuario
router.put('/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { name, lastName, avatarUrl } = req.body;

        // Buscamos y actualizamos
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizamos campos permitidos
        if (name !== undefined) user.name = name;
        if (lastName !== undefined) user.lastName = lastName;
        // Si tuviéramos avatarUrl en el modelo, lo actualizaríamos aquí
        // user.avatarUrl = avatarUrl; 

        await user.save();

        res.json({
            message: 'Perfil actualizado',
            user: {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                avatarUrl: user.avatarUrl
            }
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        console.error('Update Profile error:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

module.exports = router;
