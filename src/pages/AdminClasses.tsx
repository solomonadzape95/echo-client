import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import {
  useAdminClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
} from "../hooks/useAdmin";
import { useFaculties, useDepartmentsByFaculty } from "../hooks/useEnums";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSchool,
  MdClose,
  MdArrowBack,
} from "react-icons/md";

export function AdminClasses() {
  const navigate = useNavigate();
  const { data: classesResponse, isLoading } = useAdminClasses();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    level: "",
    faculty: "",
    department: "",
  });

  const { data: facultiesResponse } = useFaculties();
  const { data: departmentsResponse } = useDepartmentsByFaculty(
    formData.faculty || undefined
  );

  const classes = classesResponse?.success ? classesResponse.data : [];
  const faculties = facultiesResponse?.success ? Object.values(facultiesResponse.data) : [];
  const departments = departmentsResponse?.success ? departmentsResponse.data : [];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(classes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClasses = classes.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [classes.length]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClass.mutateAsync({
        level: formData.level,
        faculty: formData.faculty,
        department: formData.department,
      });
      setIsCreateModalOpen(false);
      setFormData({
        level: "",
        faculty: "",
        department: "",
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create class");
    }
  };

  const handleUpdate = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateClass.mutateAsync({
        id,
        data: {
          level: formData.level || undefined,
          faculty: formData.faculty || undefined,
          department: formData.department || undefined,
        },
      });
      setEditingClass(null);
      setFormData({
        level: "",
        faculty: "",
        department: "",
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update class");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteClass.mutateAsync(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to delete class");
      }
    }
  };

  const openEditModal = (cls: typeof classes[0]) => {
    setEditingClass(cls.id);
    setFormData({
      level: cls.level,
      faculty: cls.faculty,
      department: cls.department,
    });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Classes</h1>
            <p className="text-[#92c9c9]">Manage academic classes and their departments</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg flex items-center gap-2 transition-all"
          >
            <MdAdd className="w-5 h-5" />
            <span>New Class</span>
          </button>
        </div>

        {/* Classes List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-[#142828] border border-[#234848] rounded-lg p-12 text-center">
            <MdSchool className="w-16 h-16 text-[#568888] mx-auto mb-4" />
            <p className="text-[#92c9c9] text-lg mb-2">No classes found</p>
            <p className="text-[#568888] text-sm">Create your first class to get started</p>
          </div>
        ) : (
          <div className="bg-[#142828] border border-[#234848] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#234848] bg-[#102222]">
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Level
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Department
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Faculty
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
                  {paginatedClasses.map((cls) => (
                    <tr
                      key={cls.id}
                      className="border-b border-[#234848] hover:bg-[#1a3333] transition-colors"
                    >
                      <td className="py-4 px-6 text-white font-medium">{cls.level}</td>
                      <td className="py-4 px-6 text-[#92c9c9]">{cls.department}</td>
                      <td className="py-4 px-6 text-[#92c9c9]">{cls.faculty}</td>
                      <td className="py-4 px-6 text-[#92c9c9] text-sm">
                        {new Date(cls.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(cls)}
                            className="p-2 bg-[#234848] hover:bg-[#2a5555] text-white rounded transition-all"
                            title="Edit"
                          >
                            <MdEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cls.id)}
                            disabled={deleteClass.isPending}
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
        {classes.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-[#568888] text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, classes.length)} of {classes.length} classes
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
                <h2 className="text-2xl font-bold text-white">Create New Class</h2>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormData({ level: "", faculty: "", department: "" });
                  }}
                  className="p-2 text-[#92c9c9] hover:text-white hover:bg-[#1a3333] rounded-lg transition-all"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Level *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="e.g. 400 Level"
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Faculty *
                  </label>
                  <select
                    required
                    value={formData.faculty}
                    onChange={(e) => {
                      setFormData({ ...formData, faculty: e.target.value, department: "" });
                    }}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  >
                    <option value="">Select a faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Department *
                  </label>
                  <select
                    required
                    disabled={!formData.faculty}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{formData.faculty ? "Select a department" : "Select faculty first"}</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setFormData({ level: "", faculty: "", department: "" });
                    }}
                    className="flex-1 px-4 py-3 bg-[#234848] hover:bg-[#2a5555] text-white rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createClass.isPending}
                    className="flex-1 px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg disabled:opacity-50"
                  >
                    {createClass.isPending ? "Creating..." : "Create Class"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingClass && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#142828] border border-[#234848] rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Class</h2>
                <button
                  onClick={() => {
                    setEditingClass(null);
                    setFormData({ level: "", faculty: "", department: "" });
                  }}
                  className="p-2 text-[#92c9c9] hover:text-white hover:bg-[#1a3333] rounded-lg transition-all"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={(e) => handleUpdate(editingClass, e)} className="space-y-4">
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Level
                  </label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="e.g. 400 Level"
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Faculty
                  </label>
                  <select
                    value={formData.faculty}
                    onChange={(e) => {
                      setFormData({ ...formData, faculty: e.target.value, department: "" });
                    }}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
                  >
                    <option value="">Select a faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Department
                  </label>
                  <select
                    disabled={!formData.faculty}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{formData.faculty ? "Select a department" : "Select faculty first"}</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingClass(null);
                      setFormData({ level: "", faculty: "", department: "" });
                    }}
                    className="flex-1 px-4 py-3 bg-[#234848] hover:bg-[#2a5555] text-white rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateClass.isPending}
                    className="flex-1 px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg disabled:opacity-50"
                  >
                    {updateClass.isPending ? "Updating..." : "Update Class"}
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

