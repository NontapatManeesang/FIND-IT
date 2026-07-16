import TopBar from './TopBar';
import BottomNav, { SideNav } from './BottomNav';

/**
 * AppShell — Fixed-height layout, no page scroll bar.
 * Desktop: sidebar + scrollable main. Mobile: bottom nav + scrollable main.
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
        {/* Scrollable content — only this region scrolls */}
        <main className="app-main px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
          {children}
        </main>
        {/* Mobile Bottom Nav */}
        {showNav && <BottomNav unreadCount={unreadCount} />}
      </div>
    </div>
  );
}
