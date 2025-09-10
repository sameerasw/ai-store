const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../db');
const { authRequired, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Update user profile
router.put('/profile', authRequired, async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body || {};
  const userId = req.user.id;

  try {
    // Get current user data
    const currentUser = await get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if username is being changed and if it already exists
    if (username && username !== currentUser.username) {
      const existingUser = await get('SELECT * FROM users WHERE username = ? AND id != ?', [username, userId]);
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }
    }

    // Prepare update data
    const updateParams = [];
    let updateQuery = 'UPDATE users SET ';
    const updateFields = [];

    // Add username to update if provided
    if (username) {
      updateFields.push('username = ?');
      updateParams.push(username);
    }

    // Add email to update if provided
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateParams.push(email || null);
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }

      // Verify current password
      const passwordMatch = await bcrypt.compare(currentPassword, currentUser.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
      updateFields.push('password_hash = ?');
      updateParams.push(newPasswordHash);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Complete the query
    updateQuery += updateFields.join(', ') + ' WHERE id = ?';
    updateParams.push(userId);

    // Execute update
    await run(updateQuery, updateParams);

    // Get updated user data
    const updatedUser = await get('SELECT id, username, email, role FROM users WHERE id = ?', [userId]);

    // Generate new token with updated info
    const token = jwt.sign(
      { id: updatedUser.id, username: updatedUser.username, role: updatedUser.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Profile updated successfully',
      token,
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
