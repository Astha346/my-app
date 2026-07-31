"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Role {
  _id: string;
  name: string;
  description: string;
}

interface Permission {
  _id: string;
  name: string;
  module: string;
  description: string;
}

interface RolePermission {
  _id: string;
  role: string;
  permission: Permission;
}

export default function PermissionMatrix() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<
    Record<string, RolePermission[]>
  >({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  async function loadPermissions() {
    try {
      setLoading(true);

      const [rolesRes, permissionsRes] = await Promise.all([
        api.get("/roles"),
        api.get("/permissions"),
      ]);

      const rolesData = rolesRes.data;
      const permissionsData = permissionsRes.data;

      setRoles(rolesData);
      setPermissions(permissionsData);

      const rolePermissionData: Record<string, RolePermission[]> = {};

      await Promise.all(
        rolesData.map(async (role: Role) => {
          const res = await api.get(
            `/role-permissions/${role._id}`
          );

          rolePermissionData[role._id] = res.data;
        })
      );

      setRolePermissions(rolePermissionData);
    } catch (error) {
      console.error(
        "Failed to load permissions:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function hasPermission(
    roleId: string,
    permissionId: string
  ) {
    const permissionsForRole =
      rolePermissions[roleId] || [];

    return permissionsForRole.some(
      (item) =>
        item.permission?._id === permissionId
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        Loading permissions...
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden">

      <div className="border-b p-6">
        <h2 className="text-2xl font-bold">
          Role Permissions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage permissions for each role.
        </p>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-100">

              <th className="border px-5 py-4 text-left">
                Permission
              </th>

              {roles.map((role) => (
                <th
                  key={role._id}
                  className="border px-5 py-4 text-center capitalize"
                >
                  {role.name}
                </th>
              ))}

            </tr>
          </thead>

          <tbody>

            {permissions.map((permission) => (
              <tr
                key={permission._id}
                className="hover:bg-gray-50"
              >

                <td className="border px-5 py-4">

                  <div className="font-medium">
                    {permission.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {permission.description}
                  </div>

                </td>

                {roles.map((role) => {

                  const allowed = hasPermission(
                    role._id,
                    permission._id
                  );

                  return (
                    <td
                      key={role._id}
                      className="border px-5 py-4 text-center"
                    >
                      {allowed ? (
                        <span className="text-2xl text-green-500">
                          ✓
                        </span>
                      ) : (
                        <span className="text-2xl text-red-500">
                          ✕
                        </span>
                      )}
                    </td>
                  );

                })}

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}