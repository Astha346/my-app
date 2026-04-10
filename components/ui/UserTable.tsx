"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";
import { toast } from "sonner";

type User = { id: number; username: string; email: string };

export default function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;

    setUsers(users.filter((u) => u.id !== userToDelete.id));
    setShowDeleteModal(false);
    setUserToDelete(null);

    toast.success("User deleted successfully!");
  };

  const handleEditClick = (user: User) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const handleEditSave = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setShowEditModal(false);
    setUserToEdit(null);

    toast.success("User updated successfully!");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {loading ? (
        <div className="py-4 text-center text-gray-500">Loading users...</div>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="py-2 px-4">{u.id}</td>
                <td className="py-2 px-4">{u.username}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4 flex gap-2">
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleEditClick(u)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
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

      <DeleteDialog
        userName={userToDelete?.username || ""}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />

      <EditDialog
        user={userToEdit}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditSave}
      />
    </div>
  );
}