
    // controllers/authController.js
const db = require('../config/database');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
//const transporter = require('../config/email');

// 1. Demande reset
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requis" });

  try {
    const [rows] = await db.query("SELECT id FROM glpi_users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ error: "Utilisateur introuvable" });

    const userId = rows[0].id;
    const token = crypto.randomBytes(32).toString("hex");

    await db.query(
      "INSERT INTO glpi_password_resets (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
      [userId, token]
    );

    const resetLink = `myapp://reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
      html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Lien de réinitialisation envoyé par email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
};

// 2. Reset avec nouveau mot de passe
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: "Données manquantes" });

  try {
    const [rows] = await db.query(
      "SELECT user_id FROM glpi_password_resets WHERE token = ? AND expires_at > NOW()",
      [token]
    );
    if (rows.length === 0) return res.status(400).json({ error: "Token invalide ou expiré" });

    const userId = rows[0].user_id;
    const hash = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE glpi_users SET password = ? WHERE id = ?", [hash, userId]);
    await db.query("DELETE FROM glpi_password_resets WHERE token = ?", [token]);

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
};

/**:
 * // controllers/authController.js
const db = require('../config/database');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const transporter = require('../config/email');

// 1. Demande reset
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requis" });

  try {
    const [rows] = await db.query("SELECT id FROM glpi_users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ error: "Utilisateur introuvable" });

    const userId = rows[0].id;
    const token = crypto.randomBytes(32).toString("hex");

    await db.query(
      "INSERT INTO glpi_password_resets (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
      [userId, token]
    );

    const resetLink = `myapp://reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
      html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Lien de réinitialisation envoyé par email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
};

// 2. Reset avec nouveau mot de passe
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: "Données manquantes" });

  try {
    const [rows] = await db.query(
      "SELECT user_id FROM glpi_password_resets WHERE token = ? AND expires_at > NOW()",
      [token]
    );
    if (rows.length === 0) return res.status(400).json({ error: "Token invalide ou expiré" });

    const userId = rows[0].user_id;
    const hash = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE glpi_users SET password = ? WHERE id = ?", [hash, userId]);
    await db.query("DELETE FROM glpi_password_resets WHERE token = ?", [token]);

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
};
 */