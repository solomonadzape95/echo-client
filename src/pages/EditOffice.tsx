import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { useAdminOffice, useAdminOffices, useUpdateOffice } from "../hooks/useAdmin";
import { MdArrowBack, MdSave } from "react-icons/md";
import { useToast } from "../hooks/useToast";

export function EditOffice() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { id: electionId, officeId } = useParams<{ id: string; officeId: string }>();
  const { data: officeResponse, isLoading } = useAdminOffice(officeId);
  const { data: officesResponse } = useAdminOffices(electionId);
  const updateOffice = useUpdateOffice();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dependsOn: "",
  });

  const office = officeResponse?.success ? officeResponse.data : null;
  const offices = officesResponse?.success ? officesResponse.data : [];

  // Filter out current office from dependsOn options
  const availableOffices = offices.filter((o) => o.id !== officeId);

  // Populate form when office data loads
  useEffect(() => {
    if (office) {
      setFormData({
        name: office.name || "",
        description: office.description || "",
        dependsOn: office.dependsOn || "",
      });
    }
  }, [office]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officeId) return;

    try {
      await updateOffice.mutateAsync({
        id: officeId,
        data: {
          name: formData.name,
          description: formData.description,
          dependsOn: formData.dependsOn || null,
        },
      });

      showToast("Office updated successfully", "success");
      navigate(`/admin/elections/${electionId}/offices/${officeId}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update office", "error");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!office) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
            <p className="font-medium">Office not found</p>
            <button
              onClick={() => navigate(`/admin/elections/${electionId}`)}
              className="mt-4 px-4 py-2 bg-[#234848] text-white rounded hover:bg-[#2a5555] transition-colors"
            >
              Back to Election
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/admin/elections/${electionId}/offices/${officeId}`)}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Office</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Office</h1>
          <p className="text-[#92c9c9]">
            Update the office name, description, and dependencies.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#142828] border border-[#234848] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                Office Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Class Representative, President, etc."
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec]"
              />
            </div>

            <div>
              <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the responsibilities and role of this office..."
                rows={6}
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec] resize-none"
              />
            </div>

            <div>
              <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                Depends On (Optional)
              </label>
              <select
                value={formData.dependsOn}
                onChange={(e) => setFormData({ ...formData, dependsOn: e.target.value })}
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white focus:outline-none focus:border-[#13ecec]"
              >
                <option value="">None (Independent Office)</option>
                {availableOffices.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-[#568888]">
                If selected, candidates for this office must also be candidates for the selected office.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/admin/elections/${electionId}/offices/${officeId}`)}
                className="flex-1 px-4 py-3 bg-[#234848] hover:bg-[#2a5555] text-white rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateOffice.isPending}
                className="flex-1 px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <MdSave className="w-4 h-4" />
                {updateOffice.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

