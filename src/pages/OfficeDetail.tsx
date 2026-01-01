import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { useAdminOffice, useAdminCandidates, useDeleteOffice } from "../hooks/useAdmin";
import { MdArrowBack, MdPerson, MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { useToast } from "../hooks/useToast";
import { useConfirm } from "../hooks/useConfirm";

export function OfficeDetail() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const { id: electionId, officeId } = useParams<{ id: string; officeId: string }>();
  const { data: officeResponse, isLoading: isLoadingOffice, error: officeError } = useAdminOffice(officeId);
  const { data: candidatesResponse } = useAdminCandidates(officeId);
  const deleteOffice = useDeleteOffice();

  const office = officeResponse?.success ? officeResponse.data : null;
  const candidates = candidatesResponse?.success ? candidatesResponse.data : [];

  if (!officeId) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
            <p className="font-medium">Invalid Route</p>
            <p className="text-sm mt-2 text-red-300">
              Office ID is missing from the URL. Please navigate from the election detail page.
            </p>
            <button
              onClick={() => navigate(`/admin/elections/${electionId || ''}`)}
              className="mt-4 px-4 py-2 bg-[#234848] text-white rounded hover:bg-[#2a5555] transition-colors"
            >
              Back to Election
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (isLoadingOffice) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!office && !isLoadingOffice) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
            <p className="font-medium">Office not found</p>
            {officeError && (
              <p className="text-sm mt-2 text-red-300">
                Error: {officeError instanceof Error ? officeError.message : "Unknown error"}
              </p>
            )}
            {officeResponse && !officeResponse.success && (
              <p className="text-sm mt-2 text-red-300">
                {officeResponse.message || "Failed to load office"}
              </p>
            )}
            <p className="text-sm mt-2 text-red-300">
              Office ID: {officeId}
            </p>
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
      {ConfirmDialogComponent}
      <div className="p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/admin/elections/${electionId}`)}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Election</span>
        </button>

        {/* Office Info */}
        <div className="bg-[#142828] border border-[#234848] rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{office.name}</h1>
              <p className="text-[#92c9c9]">{office.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/elections/${electionId}/offices/${officeId}/edit`)}
                className="px-4 py-2 bg-[#234848] hover:bg-[#2a5555] text-white rounded flex items-center gap-2"
              >
                <MdEdit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={async () => {
                  const confirmed = await confirm({
                    title: "Delete Office",
                    message: "Are you sure you want to delete this office? This action cannot be undone.",
                    type: "danger",
                    confirmText: "Delete",
                  });
                  if (confirmed) {
                    try {
                      await deleteOffice.mutateAsync(officeId!);
                      showToast("Office deleted successfully", "success");
                      navigate(`/admin/elections/${electionId}`);
                    } catch (error) {
                      showToast("Failed to delete office", "error");
                    }
                  }
                }}
                disabled={deleteOffice.isPending}
                className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500/50 rounded flex items-center gap-2 disabled:opacity-50"
              >
                <MdDelete className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Candidates */}
        <div className="bg-[#142828] border border-[#234848] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Candidates</h2>
            <button
              onClick={() => navigate(`/admin/elections/${electionId}/offices/${officeId}/candidates/create`)}
              className="px-4 py-2 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded flex items-center gap-2"
            >
              <MdAdd className="w-4 h-4" />
              <span>Add Candidate</span>
            </button>
          </div>
          {candidates.length === 0 ? (
            <div className="text-center py-8 text-[#568888]">
              <MdPerson className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No candidates yet</p>
              <button
                onClick={() => navigate(`/admin/elections/${electionId}/offices/${officeId}/candidates/create`)}
                className="mt-4 px-4 py-2 bg-[#234848] hover:bg-[#2a5555] text-white rounded"
              >
                Add First Candidate
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-[#102222] border border-[#234848] rounded-lg p-4 hover:border-[#13ecec] transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#13ecec]/20 rounded-lg flex items-center justify-center">
                      {candidate.image ? (
                        <img
                          src={candidate.image}
                          alt="Candidate"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <MdPerson className="w-6 h-6 text-[#13ecec]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold">
                        Candidate
                      </h3>
                      <p className="text-[#92c9c9] text-sm">
                        ID: {candidate.voterId.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                  {candidate.quote && (
                    <p className="text-[#92c9c9] text-sm italic mb-2">"{candidate.quote}"</p>
                  )}
                  {candidate.manifesto && (
                    <p className="text-[#568888] text-xs line-clamp-2">{candidate.manifesto}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

