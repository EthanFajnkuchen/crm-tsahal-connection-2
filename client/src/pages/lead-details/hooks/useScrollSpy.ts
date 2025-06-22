import { useState, useEffect } from "react";
import { Tab } from "../constants/tabs";

export const useScrollSpy = (
  tabs: Tab[],
  sectionRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>
) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportCenter = scrollPosition + windowHeight / 2;

      const allElementsLoaded = tabs.every(
        (tab) => sectionRefs.current[tab.id]
      );
      if (!allElementsLoaded) {
        return;
      }

      if (scrollPosition + windowHeight >= documentHeight - 10) {
        setActiveTab(tabs[tabs.length - 1].id);
        return;
      }

      let closestSection = tabs[0].id;
      let closestDistance = Infinity;

      for (const tab of tabs) {
        const element = sectionRefs.current[tab.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          const sectionCenter = offsetTop + offsetHeight / 2;
          const distance = Math.abs(viewportCenter - sectionCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = tab.id;
          }
        }
      }

      setActiveTab(closestSection);
    };

    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [tabs, sectionRefs]);

  return activeTab;
};
