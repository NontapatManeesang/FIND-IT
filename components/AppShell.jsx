import TopBar from './TopBar';
import BottomNav, { SideNav } from './BottomNav';

/**
 * AppShell — ONE template for all pages in FindIt.
 * Responsive: Desktop gets sidebar, mobile gets bottom nav.
 */
export default function AppShell({
  title,
  subtitle,
  backHref,
  showTopBar = true,
  showNav = true,
  children,
  userName,
  unreadCount = 0,
  rightAction,
}) {
  return (
    <div className="app-stage">
      {/* Desktop Sidebar */}
      {showNav && <SideNav userName={userName} unreadCount={unreadCount} />}

      {/* Main Viewport */}
      <div className="app-viewport">
        {showTopBar && (
          <TopBar
            title={title}
            subtitle={subtitle}
            backHref={backHref}
            rightAction={rightAction}
          />
        )}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 pt-4">
          {children}
        </main>
        {/* Mobile Bottom Nav */}
        {showNav && <BottomNav unreadCount={unreadCount} />}
      </div>
    </div>
  );
}
