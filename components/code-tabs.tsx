"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TabInfo {
  label: string;
  panelElement: HTMLElement;
}

interface TabGroupMount {
  container: HTMLElement;
  listPlaceholder: HTMLElement;
  tabs: TabInfo[];
  groupId: string;
}

interface TabsListProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function TabsList({ tabs, activeTab, onTabChange }: TabsListProps) {
  return (
    <div className="code-tabs-list" role="tablist">
      {tabs.map((tab) => (
        <button
          aria-selected={tab === activeTab}
          className={cn("code-tab", tab === activeTab && "code-tab-active")}
          key={tab}
          onClick={() => onTabChange(tab)}
          role="tab"
          type="button"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

interface TabsPortalProps {
  mount: TabGroupMount;
}

function TabsPortal({ mount }: TabsPortalProps) {
  const { listPlaceholder, tabs, groupId } = mount;

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined" && groupId) {
      const stored = localStorage.getItem(`code-tabs-${groupId}`);
      if (stored && tabs.some((t) => t.label === stored)) {
        return stored;
      }
    }
    return tabs[0]?.label || "";
  });

  useEffect(() => {
    for (const tab of tabs) {
      const isActive = tab.label === activeTab;
      tab.panelElement.dataset.active = String(isActive);
      tab.panelElement.style.display = isActive ? "block" : "none";
    }
  }, [activeTab, tabs]);

  const handleTabChange = useCallback(
    (tabLabel: string) => {
      setActiveTab(tabLabel);
      if (groupId) {
        localStorage.setItem(`code-tabs-${groupId}`, tabLabel);

        window.dispatchEvent(
          new CustomEvent("code-tabs-sync", {
            detail: { groupId, activeTab: tabLabel },
          })
        );
      }
    },
    [groupId]
  );

  useEffect(() => {
    if (!groupId) {
      return;
    }

    const handleSync = (event: Event) => {
      const customEvent = event as CustomEvent<{
        groupId: string;
        activeTab: string;
      }>;
      if (
        customEvent.detail.groupId === groupId &&
        customEvent.detail.activeTab !== activeTab
      ) {
        setActiveTab(customEvent.detail.activeTab);
      }
    };

    window.addEventListener("code-tabs-sync", handleSync);
    return () => {
      window.removeEventListener("code-tabs-sync", handleSync);
    };
  }, [groupId, activeTab]);

  return createPortal(
    <TabsList
      activeTab={activeTab}
      onTabChange={handleTabChange}
      tabs={tabs.map((t) => t.label)}
    />,
    listPlaceholder
  );
}

export function CodeTabsEnhancer() {
  const [mounts, setMounts] = useState<TabGroupMount[]>([]);

  useEffect(() => {
    const containers = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".code-tabs-container:not([data-mounted])"
      )
    );

    const newMounts: TabGroupMount[] = [];

    for (const container of containers) {
      container.setAttribute("data-mounted", "true");

      const listPlaceholder = container.querySelector<HTMLElement>(
        ".code-tabs-list-placeholder"
      );
      const panels = Array.from(
        container.querySelectorAll<HTMLElement>(".code-tab-panel")
      );

      if (!listPlaceholder || panels.length === 0) {
        continue;
      }

      const tabs: TabInfo[] = panels.map((panel) => ({
        label: panel.dataset.tab || "",
        panelElement: panel,
      }));

      newMounts.push({
        container,
        listPlaceholder,
        tabs,
        groupId: container.dataset.groupId || "",
      });
    }

    if (newMounts.length > 0) {
      setMounts((prev) => [...prev, ...newMounts]);
    }
  }, []);

  return (
    <>
      {mounts.map((mount) => (
        <TabsPortal key={mount.groupId} mount={mount} />
      ))}
    </>
  );
}
