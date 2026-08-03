"use client";

import { Fragment, useState } from "react";

type Permission = {
  id: string;
  name: string;
  category: string;
};

const permissions: Permission[] = [
  // Dashboard
  {
    id: "dashboard.view",
    name: "View Dashboard",
    category: "Dashboard",
  },

  // Products
  {
    id: "products.view",
    name: "View Products",
    category: "Products",
  },
  {
    id: "products.create",
    name: "Add Product",
    category: "Products",
  },
  {
    id: "products.update",
    name: "Edit Product",
    category: "Products",
  },
  {
    id: "products.delete",
    name: "Delete Product",
    category: "Products",
  },

  // Categories
  {
    id: "categories.view",
    name: "View Categories",
    category: "Categories",
  },
  {
    id: "categories.create",
    name: "Add Category",
    category: "Categories",
  },
  {
    id: "categories.update",
    name: "Edit Category",
    category: "Categories",
  },
  {
    id: "categories.delete",
    name: "Delete Category",
    category: "Categories",
  },

  // Orders
  {
    id: "orders.view",
    name: "View Orders",
    category: "Orders",
  },
  {
    id: "orders.update",
    name: "Update Order",
    category: "Orders",
  },
  {
    id: "orders.delete",
    name: "Delete Order",
    category: "Orders",
  },

  // Customers
  {
    id: "customers.view",
    name: "View Customers",
    category: "Customers",
  },
  {
    id: "customers.create",
    name: "Add Customer",
    category: "Customers",
  },
  {
    id: "customers.update",
    name: "Edit Customer",
    category: "Customers",
  },
  {
    id: "customers.delete",
    name: "Delete Customer",
    category: "Customers",
  },

  // Analytics
  {
    id: "analytics.view",
    name: "View Analytics",
    category: "Analytics",
  },
  {
    id: "analytics.sales",
    name: "View Sales Reports",
    category: "Analytics",
  },
  {
    id: "analytics.revenue",
    name: "View Revenue Reports",
    category: "Analytics",
  },

  // Settings
  {
    id: "settings.view",
    name: "View Settings",
    category: "Settings",
  },
  {
    id: "settings.update",
    name: "Edit Settings",
    category: "Settings",
  },

  // User Management
  {
    id: "users.view",
    name: "View Users",
    category: "User Management",
  },
  {
    id: "users.create",
    name: "Add User",
    category: "User Management",
  },
  {
    id: "users.update",
    name: "Edit User",
    category: "User Management",
  },
  {
    id: "users.delete",
    name: "Delete User",
    category: "User Management",
  },

  // Role Management
  {
    id: "roles.view",
    name: "View Roles",
    category: "Role Management",
  },
  {
    id: "roles.create",
    name: "Add Role",
    category: "Role Management",
  },
  {
    id: "roles.update",
    name: "Edit Role",
    category: "Role Management",
  },
  {
    id: "roles.delete",
    name: "Delete Role",
    category: "Role Management",
  },

  // Permission Management
  {
    id: "permissions.view",
    name: "View Permissions",
    category: "Permission Management",
  },
  {
    id: "permissions.update",
    name: "Manage Permissions",
    category: "Permission Management",
  },
];

const roles = ["admin", "manager", "staff", "customer"];

const initialPermissions: Record<string, string[]> = {
  // Admin has everything for now
  admin: permissions.map((permission) => permission.id),

  // Manager permissions
  manager: [
    "dashboard.view",

    "products.view",
    "products.create",
    "products.update",

    "categories.view",
    "categories.create",
    "categories.update",

    "orders.view",
    "orders.update",

    "customers.view",
    "customers.create",
    "customers.update",

    "analytics.view",
    "analytics.sales",
    "analytics.revenue",

    "settings.view",

    "users.view",
    "users.create",
    "users.update",

    "roles.view",
  ],

  // Staff permissions
  staff: [
    "dashboard.view",

    "products.view",

    "categories.view",

    "orders.view",
    "orders.update",

    "customers.view",

    "analytics.view",
  ],

  // Customer has no admin permissions
  customer: [],
};

export default function PermissionMatrix() {
  const [rolePermissions, setRolePermissions] =
    useState<Record<string, string[]>>(initialPermissions);

  const handlePermissionChange = (
    role: string,
    permissionId: string
  ) => {
    setRolePermissions((current) => {
      const currentPermissions = current[role] || [];

      const hasPermission =
        currentPermissions.includes(permissionId);

      if (hasPermission) {
        return {
          ...current,
          [role]: currentPermissions.filter(
            (id) => id !== permissionId
          ),
        };
      }

      return {
        ...current,
        [role]: [
          ...currentPermissions,
          permissionId,
        ],
      };
    });
  };

  const handleSave = () => {
    console.log("Role Permissions:", rolePermissions);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Permission Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Control what each role can access and manage.
        </p>
      </div>

      {/* Permission Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-225 border-collapse">

            {/* Table Header */}
            <thead>
              <tr className="border-b bg-gray-50">

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Permission
                </th>

                {roles.map((role) => (
                  <th
                    key={role}
                    className="px-6 py-4 text-center text-sm font-semibold capitalize text-gray-900"
                  >
                    {role}
                  </th>
                ))}

              </tr>
            </thead>

            {/* Table Body */}
            <tbody>

              {permissions.map(
                (permission, index) => {

                  const previousPermission =
                    permissions[index - 1];

                  const showCategory =
                    !previousPermission ||
                    previousPermission.category !==
                      permission.category;

                  return (
                    <Fragment key={permission.id}>

                      {/* Category Header */}
                      {showCategory && (
                        <tr className="bg-gray-100">

                          <td
                            colSpan={roles.length + 1}
                            className="px-6 py-3 text-sm font-semibold text-gray-700"
                          >
                            {permission.category}
                          </td>

                        </tr>
                      )}

                      {/* Permission Row */}
                      <tr className="border-b hover:bg-gray-50">

                        {/* Permission Name */}
                        <td className="px-6 py-4">

                          <p className="text-sm font-medium text-gray-900">
                            {permission.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {permission.id}
                          </p>

                        </td>

                        {/* Role Checkboxes */}
                        {roles.map((role) => {

                          const checked =
                            rolePermissions[role]?.includes(
                              permission.id
                            ) ?? false;

                          return (
                            <td
                              key={`${permission.id}-${role}`}
                              className="px-6 py-4 text-center"
                            >

                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  handlePermissionChange(
                                    role,
                                    permission.id
                                  )
                                }
                                className="h-5 w-5 cursor-pointer rounded border-gray-300"
                              />

                            </td>
                          );

                        })}

                      </tr>

                    </Fragment>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Save Button */}
      <div className="flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Save Permissions
        </button>

      </div>

    </div>
  );
}