export const enforceFranchiseScope = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role === 'super_admin') return next();

  const targetFranchiseId =
    req.body.franchiseId || req.query.franchiseId || req.params.franchiseId || req.user.franchiseId?.toString();

  if (!targetFranchiseId || req.user.franchiseId?.toString() !== targetFranchiseId.toString()) {
    return res.status(403).json({ message: 'Cross-franchise access denied' });
  }

  next();
};
