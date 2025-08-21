function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

    const { is_active } = req.session.user;
    if (!is_active) {
      return res.status(403).json({ message: 'Acesso não liberado' });
    }

  next();
}

function requireRole(role) {
  return (req, res, next) => {
    requireAuth(req, res, () => {
      if (req.session.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    });
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
