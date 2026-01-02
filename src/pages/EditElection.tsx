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
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [dateError, setDateError] = useState<string | null>(null);

  const election = electionResponse?.success ? electionResponse.data : null;

  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Helper function to format time for input[type="time"]
  const formatTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toTimeString().slice(0, 5); // HH:MM format
  };

  // Populate form when election data loads
  useEffect(() => {
    if (election) {
      setFormData({
        name: election.name || "",
        description: election.description || "",
        startDate: formatDateForInput(election.startDate),
        startTime: formatTimeForInput(election.startDate),
        endDate: formatDateForInput(election.endDate),
        endTime: formatTimeForInput(election.endDate),
      });
    }
  }, [election]);

  // Validate dates
  useEffect(() => {
    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        setDateError("End date and time must be after start date and time");
      } else {
        setDateError(null);
      }
    } else {
      setDateError(null);
    }
  }, [formData.startDate, formData.startTime, formData.endDate, formData.endTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!election) return;

    // Validate dates
    if (dateError) {
      showToast(dateError, "error");
      return;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    
    if (endDateTime <= startDateTime) {
      showToast("End date and time must be after start date and time", "error");
      return;
    }

    try {
      const startISO = startDateTime.toISOString();
      const endISO = endDateTime.toISOString();

      await updateElection.mutateAsync({
        id: election.id,
        data: {
          name: formData.name,
          description: formData.description || undefined,
          startDate: startISO,
          endDate: endISO,
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
          <div className="loader"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!election) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 ">
            <p className="font-medium">Election not found</p>
            <button
              onClick={() => navigate("/admin/elections")}
              className="mt-4 px-4 py-2 bg-[#234848] text-white  hover:bg-[#2a5555] transition-colors"
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
          onClick={() => navigate(`/admin/elections/${electionSlug}`)}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Election</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Election</h1>
          <p className="text-[#92c9c9]">
            Update the election details, including name, description, and timing.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#142828] border border-[#234848]  p-8">
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
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec]"
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
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec] resize-none"
              />
            </div>

            {/* Date and Time Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date and Time */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
              </div>

              {/* End Date and Time */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
              </div>
            </div>

            {/* Date Error Message */}
            {dateError && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 text-sm">
                {dateError}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/admin/elections/${electionSlug}`)}
                className="flex-1 px-4 py-3 bg-[#234848] hover:bg-[#2a5555] text-white  transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateElection.isPending}
                className="flex-1 px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold  disabled:opacity-50 flex items-center justify-center gap-2"
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

