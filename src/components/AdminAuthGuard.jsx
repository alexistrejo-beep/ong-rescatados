export default function AdminAuthGuard({ isAdmin, children, fallback = null }) {
  return isAdmin ? children : fallback;
}
