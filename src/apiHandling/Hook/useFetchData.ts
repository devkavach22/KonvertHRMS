


import { useEffect, useState, useRef } from "react";
import { fetchUsers, searchUsers } from "../Service/userService";

export const useFetchData = (limit: number, skip: number, searchQuery: string = "") => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);

  useEffect(() => {
    const loadData = async () => {
      if (initialLoad.current) setLoading(true);

      let result;

      if (searchQuery.trim()) {
        // 👇 Always fetch full list (so we can filter manually)
        const fullResult = await fetchUsers(100, 0);
        const filtered = fullResult.data.filter((user: any) => {
          const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
          return fullName.includes(searchQuery.toLowerCase());
        });
        result = { data: filtered, total: filtered.length };
      } else {
        result = await fetchUsers(limit, skip);
      }

      setData(result.data);
      setTotal(result.total);

      if (initialLoad.current) {
        setLoading(false);
        initialLoad.current = false;
      }
    };

    loadData();
  }, [limit, skip, searchQuery]);

  return { data, total, loading };
};
