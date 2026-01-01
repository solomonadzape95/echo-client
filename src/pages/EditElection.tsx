import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { useAdminElection, useUpdateElection } from "../hooks/useAdmin";
import { MdArrowBack, MdSave } from "react-icons/md";
import { useToast } from "../hooks/useToast";

export function EditElection() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { slug: electionSlug } = useParams<{ slug: string }>();
  const { data: electionResponse, isLoading } = useAdminElection(electionSlug);
  const updateElection = useUpdateElection();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const election = electionResponse?.success ? electionResponse.data : null;

  // Populate form when election data loads
  useEffect(() => {
    if (election) {
      setFormData({
        name: election.name || "",
        description: election.description || "",
      });
    }
  }, [election]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!election) return;

    try {
      await updateElection.mutateAsync({
        id: election.id,
        data: {
          name: formData.name,
          description: formData.description || undefined,
        },
      });

      showToast("Election updated successfully", "success");
      navigate(`/admin/elections/${electionSlug}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update election", "error");
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

  if (!election) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
            <p className="font-medium">Election not found</p>
            <button
              onClick={() => navigate("/admin/elections")}
              className="mt-4 px-4 py-2 bg-[#234848] text-white rounded hover:bg-[#2a5555] transition-colors"
            >
              Back to Elections
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
          onClick={() => navigate(`/admin/elections/${electionId}`)}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Election</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Election</h1>
          <p className="text-[#92c9c9]">
            Update the election name and description.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#142828] border border-[#234848] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                Election Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Spring 2024 Executive Board"
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec]"
              />
            </div>

            <div>
              <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter a brief description of the election..."
                rows={6}
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec] resize-none"
              />
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
                disabled={updateElection.isPending}
                className="flex-1 px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <MdSave className="w-4 h-4" />
                {updateElection.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

