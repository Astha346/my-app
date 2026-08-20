"use client";

import { Fragment, useEffect, useState } from "react";
import axios from "axios";

type Role = {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
};

type Permission = {
  _id: string;
  name: string;
  module: string;
  description: string;
};

type RolePermission = {
  _id: string;
  role: string;
  permission: Permission;
};

export default function PermissionMatrix() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>(
    []
  );

  /*
   * Example:
   *
   * {
   *   "managerId": [
   *      "products.view",
   *      "products.create"
   *   ]
   * }
   *
   * Actually we store permission IDs here.
   */
  const [rolePermissions, setRolePermissions] =
    useState<Record<string, string[]>>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // LOAD ROLES + PERMISSIONS + EXISTING ROLE PERMISSIONS
  // =====================================================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get roles and permissions
      const [
        rolesResponse,
        permissionsResponse,
      ] = await Promise.all([
        axios.get("http://localhost:3001/roles"),
        axios.get("http://localhost:3001/permissions"),
      ]);

      const rolesData: Role[] = rolesResponse.data;

      const permissionsData: Permission[] =
        permissionsResponse.data;

      setRoles(rolesData);
      setPermissions(permissionsData);

      // =================================================
      // GET PERMISSIONS FOR EACH ROLE
      // =================================================

      const rolePermissionData: Record<
        string,
        string[]
      > = {};

      for (const role of rolesData) {
        try {
          const response = await axios.get(
            `http://localhost:3001/role-permissions/${role._id}`
          );

          const data: RolePermission[] =
            response.data;

          rolePermissionData[role._id] =
            data
              .filter(
                (item) =>
                  item.permission &&
                  item.permission._id
              )
              .map(
                (item) =>
                  item.permission._id
              );
        } catch (error) {
          console.error(
            `Failed to load permissions for role ${role.name}:`,
            error
          );

          rolePermissionData[role._id] = [];
        }
      }

      setRolePermissions(rolePermissionData);

      console.log(
        "Roles:",
        rolesData
      );

      console.log(
        "Permissions:",
        permissionsData
      );

      console.log(
        "Role Permissions:",
        rolePermissionData
      );
    } catch (error) {
      console.error(
        "Failed to fetch roles and permissions:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHECKBOX CHANGE
  // =====================================================

  const handlePermissionChange = (
    roleId: string,
    permissionId: string
  ) => {
    setRolePermissions((current) => {
      const currentPermissions =
        current[roleId] || [];

      const hasPermission =
        currentPermissions.includes(
          permissionId
        );

      // REMOVE PERMISSION
      if (hasPermission) {
        return {
          ...current,

          [roleId]:
            currentPermissions.filter(
              (id) =>
                id !== permissionId
            ),
        };
      }

      // ADD PERMISSION
      return {
        ...current,

        [roleId]: [
          ...currentPermissions,
          permissionId,
        ],
      };
    });
  };

  // =====================================================
  // SAVE PERMISSIONS
  // =====================================================

  const handleSave = async () => {
    try {
      setSaving(true);

      /*
       * Loop through every role.
       */
      for (const role of roles) {
        // -----------------------------------------------
        // 1. DELETE OLD ROLE PERMISSIONS
        // -----------------------------------------------

        await axios.delete(
          `http://localhost:3001/role-permissions/${role._id}`
        );

        // -----------------------------------------------
        // 2. GET CURRENTLY SELECTED PERMISSIONS
        // -----------------------------------------------

        const selectedPermissions =
          rolePermissions[role._id] || [];

        // -----------------------------------------------
        // 3. SAVE NEW PERMISSIONS
        // -----------------------------------------------

        for (const permissionId of selectedPermissions) {
          await axios.post(
            "http://localhost:3001/role-permissions",
            {
              role: role._id,
              permission: permissionId,
            }
          );
        }
      }

      alert(
        "Permissions saved successfully"
      );

      // -----------------------------------------------
      // 4. LOAD DATA AGAIN FROM MONGODB
      // -----------------------------------------------

      await fetchData();
    } catch (error) {
      console.error(
        "Failed to save permissions:",
        error
      );

      alert(
        "Failed to save permissions"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8">
        <p className="text-gray-500">
          Loading permissions...
        </p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Permission Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Control what each role can access and manage.
        </p>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {roles.length === 0 ||
      permissions.length === 0 ? (
        <div className="rounded-xl border bg-white p-8">
          <p className="text-gray-500">
            No roles or permissions found.
          </p>
        </div>
      ) : (
        <>
          {/* =============================================
              PERMISSION TABLE
          ============================================= */}

          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] border-collapse">

                {/* =======================================
                    TABLE HEADER
                ======================================= */}

                <thead>
                  <tr className="border-b bg-gray-50">

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Permission
                    </th>

                    {roles.map((role) => (
                      <th
                        key={role._id}
                        className="px-6 py-4 text-center text-sm font-semibold capitalize text-gray-900"
                      >
                        {role.name}
                      </th>
                    ))}

                  </tr>
                </thead>

                {/* =======================================
                    TABLE BODY
                ======================================= */}

                <tbody>

                  {permissions.map(
                    (
                      permission,
                      index
                    ) => {

                      const previousPermission =
                        permissions[
                          index - 1
                        ];

                      /*
                       * Show module header when
                       * module changes.
                       */
                      const showModule =
                        !previousPermission ||
                        previousPermission.module !==
                          permission.module;

                      return (
                        <Fragment
                          key={
                            permission._id
                          }
                        >

                          {/* =================================
                              MODULE HEADER
                          ================================= */}

                          {showModule && (
                            <tr className="bg-gray-100">

                              <td
                                colSpan={
                                  roles.length +
                                  1
                                }
                                className="px-6 py-3 text-sm font-semibold capitalize text-gray-700"
                              >
                                {permission.module}
                              </td>

                            </tr>
                          )}

                          {/* =================================
                              PERMISSION ROW
                          ================================= */}

                          <tr className="border-b hover:bg-gray-50">

                            {/* Permission information */}

                            <td className="px-6 py-4">

                              <p className="text-sm font-medium text-gray-900">
                                {
                                  permission.description
                                }
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {
                                  permission.name
                                }
                              </p>

                            </td>

                            {/* =================================
                                ROLE CHECKBOXES
                            ================================= */}

                            {roles.map(
                              (role) => {

                                const checked =
                                  rolePermissions[
                                    role._id
                                  ]?.includes(
                                    permission._id
                                  ) ??
                                  false;

                                return (
                                  <td
                                    key={`${role._id}-${permission._id}`}
                                    className="px-6 py-4 text-center"
                                  >

                                    <input
                                      type="checkbox"
                                      checked={
                                        checked
                                      }
                                      onChange={() =>
                                        handlePermissionChange(
                                          role._id,
                                          permission._id
                                        )
                                      }
                                      className="h-5 w-5 cursor-pointer rounded border-gray-300"
                                    />

                                  </td>
                                );
                              }
                            )}

                          </tr>

                        </Fragment>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* =============================================
              SAVE BUTTON
          ============================================= */}

          <div className="flex justify-end">

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Permissions"}
            </button>

          </div>
        </>
      )}

    </div>
  );
}