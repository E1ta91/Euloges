import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Users = ({ setChatWith }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Select a user to chat with:</h2>
      {users.map((user) =>
        user.id !== auth.currentUser?.uid ? (
          <div key={user.id} onClick={() => setChatWith(user.id)}>
            {user.email}
          </div>
        ) : null
      )}
    </div>
  );
};

export default Users;
