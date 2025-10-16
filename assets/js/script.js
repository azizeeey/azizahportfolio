document.querySelectorAll('.skill-icon').forEach(icon => {
  const randomX = (Math.random() - 0.5) * 4;
  const randomY = (Math.random() - 0.5) * 4;
  icon.animate(
    [
      { transform: `translate(0, 0)` },
      { transform: `translate(${randomX}px, ${randomY}px)` },
      { transform: `translate(0, 0)` }
    ],
    {
      duration: 5000 + Math.random() * 3000,
      iterations: Infinity,
      direction: 'alternate',
      easing: 'ease-in-out'
    }
  );
});
