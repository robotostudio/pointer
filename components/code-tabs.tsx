"use client";

import { useEffect } from "react";

function setupTabGroup(container: HTMLElement): (() => void) | null {
  const buttons = Array.from(
    container.querySelectorAll<HTMLButtonElement>(".code-tabs-list .code-tab")
  );
  const panels = Array.from(
    container.querySelectorAll<HTMLElement>(".code-tab-panel")
  );

  if (buttons.length === 0 || panels.length === 0) {
    return null;
  }

  const groupId = container.dataset.groupId || "";
  let activeTab = getInitialTab(buttons, groupId);

  const updateActiveTab = (tabLabel: string) => {
    activeTab = tabLabel;
    updateButtonStates(buttons, tabLabel);
    updatePanelStates(panels, tabLabel);
    if (groupId) {
      localStorage.setItem(`code-tabs-${groupId}`, tabLabel);
    }
  };

  if (activeTab !== buttons[0]?.dataset.tab) {
    updateActiveTab(activeTab);
  }

  const handleClick = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement;
    const tabLabel = button.dataset.tab;
    if (tabLabel && tabLabel !== activeTab) {
      updateActiveTab(tabLabel);
      if (groupId) {
        window.dispatchEvent(
          new CustomEvent("code-tabs-sync", {
            detail: { groupId, activeTab: tabLabel },
          })
        );
      }
    }
  };

  const handleSync = (event: Event) => {
    const customEvent = event as CustomEvent<{
      groupId: string;
      activeTab: string;
    }>;
    if (
      customEvent.detail.groupId === groupId &&
      customEvent.detail.activeTab !== activeTab
    ) {
      updateActiveTab(customEvent.detail.activeTab);
    }
  };

  for (const button of buttons) {
    button.addEventListener("click", handleClick);
  }

  if (groupId) {
    window.addEventListener("code-tabs-sync", handleSync);
  }

  return () => {
    for (const button of buttons) {
      button.removeEventListener("click", handleClick);
    }
    if (groupId) {
      window.removeEventListener("code-tabs-sync", handleSync);
    }
  };
}

function getInitialTab(buttons: HTMLButtonElement[], groupId: string): string {
  if (groupId) {
    const stored = localStorage.getItem(`code-tabs-${groupId}`);
    const validTabs = buttons.map((b) => b.dataset.tab);
    if (stored && validTabs.includes(stored)) {
      return stored;
    }
  }
  return buttons[0]?.dataset.tab || "";
}

function updateButtonStates(buttons: HTMLButtonElement[], activeTab: string) {
  for (const button of buttons) {
    const isActive = button.dataset.tab === activeTab;
    button.classList.toggle("code-tab-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  }
}

function updatePanelStates(panels: HTMLElement[], activeTab: string) {
  for (const panel of panels) {
    const isActive = panel.dataset.tab === activeTab;
    panel.dataset.active = String(isActive);
    panel.style.display = isActive ? "block" : "none";
  }
}

export function CodeTabsEnhancer() {
  useEffect(() => {
    const containers = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".code-tabs-container:not([data-mounted])"
      )
    );

    const cleanups: (() => void)[] = [];

    for (const container of containers) {
      container.setAttribute("data-mounted", "true");
      const cleanup = setupTabGroup(container);
      if (cleanup) {
        cleanups.push(cleanup);
      }
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, []);

  return null;
}
