import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { useCreateOffice, useAdminOffices, useAdminElection } from "../hooks/useAdmin";
import { MdArrowBack, MdClose } from "react-icons/md";
import { useToast } from "../hooks/useToast";

export function CreateOffice() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { slug: electionSlug } = useParams<{ slug: string }>();
  const { data: electionResponse } = useAdminElection(electionSlug);
  const createOffice = useCreateOffice();
  const { data: officesResponse } = useAdminOffices(electionResponse?.success ? electionResponse.data.id : undefined);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dependsOn: "",
  });

  const offices = officesResponse?.success ? officesResponse.data : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!electionResponse?.success) return;

    try {
      await createOffice.mutateAsync({
        name: formData.name,
        description: formData.description,
        election: electionResponse.data.id,
        dependsOn: formData.dependsOn || null,
      });

      showToast("Office created successfully", "success");
      navigate(`/admin/elections/${electionSlug}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to create office", "error");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/admin/elections/${electionSlug}`)}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Election</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create New Office</h1>
          <p className="text-[#92c9c9]">
            Add a new office position to this election. Offices can have dependencies on other offices.
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
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
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
                onClick={() => navigate(`/admin/elections/${electionSlug}`)}
                className="flex-1 px-4 py-3 bg-[#234848] hover:bg-[#2a5555] text-white rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createOffice.isPending}
                className="flex-1 px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg disabled:opacity-50"
              >
                {createOffice.isPending ? "Creating..." : "Create Office"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

