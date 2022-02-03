export const isTestingEnvironment = () => {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === 'dev.engineerdao.com' ||
    window.location.hostname.includes('vercel.app')
  );
};
