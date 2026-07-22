"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";
import { toast } from "sonner";

type User = {
  
  id?: string;
  username: string;
  email: string;
};

export default function UsersTable({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // ✅ SAFE ID (IMPORTANT FIX)
  const getId = (user: User) =>
    String(user.id ?? user.id ?? "");

  // ================= INIT FROM PROPS =================
  useEffect(() => {
    if (initialUsers?.length) {
      setUsers(
        initialUsers.map((u) => ({
          ...u,
          id: String(u.id ?? u.id),
        }))
      );
      setLoading(false);
    }
  }, [initialUsers]);

  // ================= FETCH USERS =================
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://localhost:3001/users");

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        setUsers(
          list.map((u: any) => ({
            id: String(u.id ?? u.id),
            username: u.username,
            email: u.email,
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // ================= DELETE =================
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    const id = getId(userToDelete);

    try {
      await fetch(`http://localhost:3001/users/${id}`, {
        method: "DELETE",
      });

      setUsers((prev) =>
        prev.filter((u) => getId(u) !== id)
      );

      toast.success("User deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  // ================= EDIT =================
  const handleEditClick = (user: User) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const handleEditSave = async (updatedUser: User) => {
    const id = getId(updatedUser);

    try {
      await fetch(`http://localhost:3001/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      setUsers((prev) =>
        prev.map((u) =>
          getId(u) === id
            ? { ...updatedUser, id }
            : u
        )
      );

      toast.success("User updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setShowEditModal(false);
      setUserToEdit(null);
    }
  };

  // ================= UI =================
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        User Management
      </h2>

      {loading ? (
        <div className="text-center text-gray-500">
          Loading users...
        </div>
      ) : (
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={getId(u)} className="border-t">
                <td className="p-2">{getId(u)}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.email}</td>

                <td className="p-2 flex gap-2">
                  <Button
                    className="bg-blue-600 text-white"
                    onClick={() => handleEditClick(u)}
                  >
                    Edit
                  </Button>

                  <Button
                    className="bg-red-600 text-white"
                    onClick={() => handleDeleteClick(u)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* DELETE MODAL */}
      <DeleteDialog
        userName={userToDelete?.username || ""}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* EDIT MODAL */}
      <EditDialog
        user={userToEdit}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditSave}
      />
    </div>
  );
}