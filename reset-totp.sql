-- Resetar TOTP para false
UPDATE admin_config SET value = 'false' WHERE key = 'totp_configured';
