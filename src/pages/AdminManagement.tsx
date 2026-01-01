import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import {
  useAdminAdmins,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
} from "../hooks/useAdmin";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdPerson,
  MdEmail,
  MdShield,
  MdClose,
} from "react-icons/md";

export function AdminManagement() {
  const navigate = useNavigate();
  const { data: adminsResponse, isLoading } = useAdminAdmins();
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin" as "super_admin" | "admin" | "moderator",
    fullName: "",
  });

  const admins = adminsResponse?.success ? adminsResponse.data : [];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(admins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAdmins = admins.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [admins.length]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdmin.mutateAsync({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        fullName: formData.fullName || undefined,
      });
      setIsCreateModalOpen(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "admin",
        fullName: "",
      });
    } catch (error) {
      alert("Failed to create admin");
    }
  };

  const handleUpdate = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdmin.mutateAsync({
        id,
        data: {
          email: formData.email || undefined,
          password: formData.password || undefined,
          role: formData.role,
          fullName: formData.fullName || undefined,
        },
      });
      setEditingAdmin(null);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "admin",
        fullName: "",
      });
    } catch (error) {
      alert("Failed to update admin");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      try {
        await deleteAdmin.mutateAsync(id);
      } catch (error) {
        alert("Failed to delete admin");
      }
    }
  };

  const openEditModal = (admin: typeof admins[0]) => {
    setEditingAdmin(admin.id);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: "",
      role: admin.role,
      fullName: admin.fullName || "",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-500/20 text-purple-400";
      case "admin":
        return "bg-[#13ecec]/20 text-[#13ecec]";
      case "moderator":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-[#234848] text-[#92c9c9]";
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Management</h1>
            <p className="text-[#92c9c9]">Manage system administrators and their roles</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg flex items-center gap-2 transition-all"
          >
            <MdAdd className="w-5 h-5" />
            <span>New Admin</span>
          </button>
        </div>

        {/* Admins List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : admins.length === 0 ? (
          <div className="bg-[#142828] border border-[#234848] rounded-lg p-12 text-center">
            <MdPerson className="w-16 h-16 text-[#568888] mx-auto mb-4" />
            <p className="text-[#92c9c9] text-lg mb-2">No admins found</p>
            <p className="text-[#568888] text-sm">Create your first admin account</p>
          </div>
        ) : (
          <div className="bg-[#142828] border border-[#234848] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#234848] bg-[#102222]">
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Admin
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Role
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Created
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAdmins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-b border-[#234848] hover:bg-[#1a3333] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#13ecec] rounded-full flex items-center justify-center text-[#112222] font-bold">
                            {admin.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{admin.username}</div>
                            {admin.fullName && (
                              <div className="text-[#568888] text-xs">{admin.fullName}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#92c9c9]">{admin.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(admin.role)}`}
                        >
                          {admin.role.toUpperCase().replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#92c9c9] text-sm">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(admin)}
                            className="p-2 bg-[#234848] hover:bg-[#2a5555] text-white rounded transition-all"
                            title="Edit"
                          >
                            <MdEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(admin.id)}
                            disabled={deleteAdmin.isPending}
                            className="p-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500/50 rounded transition-all disabled:opacity-50"
                            title="Delete"
                          >
                            <MdDelete className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {admins.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-[#568888] text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, admins.length)} of {admins.length} admins
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#142828] border border-[#234848] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#13ecec] transition-all"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page
                        ? "bg-[#13ecec] text-[#112222] font-bold"
                        : "bg-[#142828] border border-[#234848] text-white hover:border-[#13ecec]"
                    } transition-all`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#142828] border border-[#234848] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#13ecec] transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#142828] border border-[#234848] rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Admin</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-[#92c9c9] hover:text-white hover:bg-[#1a3333] rounded-lg transition-all"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Password * (min 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "super_admin" | "admin" | "moderator",
                      })
                    }
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Full Name (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-[#234848] hover:bg-[#2a5555] text-white rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createAdmin.isPending}
                    className="flex-1 px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg disabled:opacity-50"
                  >
                    {createAdmin.isPending ? "Creating..." : "Create Admin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingAdmin && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#142828] border border-[#234848] rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Admin</h2>
                <button
                  onClick={() => {
                    setEditingAdmin(null);
                    setFormData({
                      username: "",
                      email: "",
                      password: "",
                      role: "admin",
                      fullName: "",
                    });
                  }}
                  className="p-2 text-[#92c9c9] hover:text-white hover:bg-[#1a3333] rounded-lg transition-all"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={(e) => handleUpdate(editingAdmin, e)} className="space-y-4">
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "super_admin" | "admin" | "moderator",
                      })
                    }
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAdmin(null);
                      setFormData({
                        username: "",
                        email: "",
                        password: "",
                        role: "admin",
                        fullName: "",
                      });
                    }}
                    className="flex-1 px-4 py-3 bg-[#234848] hover:bg-[#2a5555] text-white rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateAdmin.isPending}
                    className="flex-1 px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg disabled:opacity-50"
                  >
                    {updateAdmin.isPending ? "Updating..." : "Update Admin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

