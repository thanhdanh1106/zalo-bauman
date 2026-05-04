import { useCallback, useState } from 'react';

export function useToggleSelection<T extends number | string>(initialSelected: T[] = []) {
  const [selected, setSelected] = useState<T[]>(initialSelected);

  const toggle = useCallback((id: T) => {
    setSelected((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) {
        return [...prev, id];
      }
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  }, []);

  const selectAll = useCallback((allIds: T[]) => {
    setSelected(allIds);
  }, []);

  const clearAll = useCallback(() => {
    setSelected([]);
  }, []);

  return { selected, setSelected, toggle, selectAll, clearAll };
}
