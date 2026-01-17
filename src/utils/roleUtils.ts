export const filterMenuByRole = (menuItems: any[], userRole: string) => {
  return menuItems.reduce((acc: any[], item) => {
    // 1. If item has specific roles and user doesn't have it, SKIP.
    if (item.roles && !item.roles.includes(userRole)) {
      return acc;
    }

    const newItem = { ...item };

    // 2. Filter children recursively
    if (newItem.submenuItems && newItem.submenuItems.length > 0) {
      newItem.submenuItems = filterMenuByRole(newItem.submenuItems, userRole);

      // 3. If parent becomes empty after filtering children, SKIP parent.
      if (newItem.submenuItems.length === 0 && newItem.submenu) {
        return acc;
      }
      // 4. If it's a section title with no children left, SKIP.
      if (newItem.tittle && newItem.submenuItems.length === 0) {
        return acc;
      }
    }

    acc.push(newItem);
    return acc;
  }, []);
};
