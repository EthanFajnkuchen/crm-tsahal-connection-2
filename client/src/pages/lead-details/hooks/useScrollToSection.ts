export const useScrollToSection = (
  sectionRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>
) => {
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const { offsetTop, offsetHeight } = element;
      const windowHeight = window.innerHeight;
      const sectionCenter = offsetTop + offsetHeight / 2;
      const targetScroll = sectionCenter - windowHeight / 2;

      const maxScroll = document.documentElement.scrollHeight - windowHeight;
      const finalScroll = Math.max(0, Math.min(targetScroll, maxScroll));

      window.scrollTo({
        top: finalScroll,
        behavior: "smooth",
      });
    }
  };

  return scrollToSection;
};
