export const fetchUsers = async (limit: number = 10, skip: number = 0) => {
  try {
    const response = await fetch(
      `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
    );
    if (!response.ok) throw new Error("Failed to fetch users");
    const result = await response.json();
    return { data: result.users, total: result.total };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: [], total: 0 };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const response = await fetch(
      `https://dummyjson.com/users/search?q=${query}`
    );
    if (!response.ok) throw new Error("Failed to search users");
    const result = await response.json();
    return { data: result.users, total: result.total };
  } catch (error) {
    console.error("Error searching users:", error);
    return { data: [], total: 0 };
  }
};
