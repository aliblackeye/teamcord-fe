import { createContext, useContext, useState } from "react";

type States = {
  username: string;
};

type Actions = {
  setUsername: (username: string) => void;
};

interface IUserContext extends States, Actions {}

export const UserContext = createContext<IUserContext | null>(null);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [username, setUsername] = useState("");

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUser must be used within a UserContextProvider");
  return context;
};
