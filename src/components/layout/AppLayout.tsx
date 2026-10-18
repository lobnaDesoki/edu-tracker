import { useState } from "react";
import { Outlet } from "react-router";
import { Tour } from "../../features/tour/Tour";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../store/AuthContext";
import { Notice } from "../ui/Notice";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import styles from "./layout.module.css";

export function AppLayout() {
  const { t } = useI18n();
  const { tourOpen } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  // The tour highlights sidebar links, so the sidebar stays visible on mobile while it runs.
  const sidebarOpen = menuOpen || tourOpen;

  return (
    <div className={styles.shell}>
      <Sidebar open={sidebarOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <div className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <div className={styles.main}>
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className={styles.content}>
          <Notice>{t.common.demoBanner}</Notice>
          <Outlet />
        </main>
      </div>
      {tourOpen && <Tour />}
    </div>
  );
}
