import TopBar from './TopBar';
import BottomNav from './BottomNav';

/**
 * AppShell — the ONE template shared by every screen in FindIt.
 * Each of the 7 pages only changes: title / backHref / showNav / children.
 */
export default function AppShell({
  title,
  subtitle,
  backHref,
  showTopBar = true,
  showNav = true,
  children,
}) {
  return (
    <div className="app-stage">
      <div className="app-viewport">
        {showTopBar && <TopBar title={title} subtitle={subtitle} backHref={backHref} />}
        <main className="flex-1 overflow-y-auto px-5 pb-6 pt-4">{children}</main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
