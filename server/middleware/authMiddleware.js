/**
 * Authentication and Role-Based Access Middleware (Prototype)
 */

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    // In prototype, allow passing role via headers or query for flexible testing
    const authHeader = req.headers['authorization'];
    const roleHeader = req.headers['x-user-role'] || 'Healthcare Worker';

    // If roles are specified, verify
    if (allowedRoles.length > 0 && !allowedRoles.includes(roleHeader)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] role. Current: ${roleHeader}`
      });
    }

    req.user = {
      role: roleHeader,
      name: req.headers['x-user-name'] || 'Sister Lakshmi (ANM)'
    };
    next();
  };
}
