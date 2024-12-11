import { useCallback, useEffect, useState } from "react";
import { fetchUsers } from "./api/api";
import { Select } from "./components/select";
import { User } from "./types";

const renderUser = (user: User) => <span>{`${user.last_name} ${user.first_name}, ${user.job}`}</span>;
const getUserKey = (user: User) => user.id;
const getUserIconLabel = (user: User) => user.last_name;

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMoreUsers = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      const newUsers = await fetchUsers(page);
      setUsers((prevUsers) => [
        ...prevUsers,
        ...newUsers.filter((newUser) => !prevUsers.some((user) => user.id === newUser.id)),
      ]);
      setPage((prevPage) => prevPage + 1);

      if (newUsers.length < 50) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error load users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    loadMoreUsers();
  }, []);

  return (
    <Select
      items={users}
      loadMoreItems={loadMoreUsers}
      hasMore={hasMore}
      renderItem={renderUser}
      getKey={getUserKey}
      placeholder="Select user"
      getIconLabel={getUserIconLabel}
    />
  );
};
