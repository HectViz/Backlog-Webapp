import { useEffect } from 'react';

export function useTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Backlog - ${title}`;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

export default useTitle;
