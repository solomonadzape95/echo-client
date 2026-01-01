import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { useSearchVotersByElection, useCreateCandidate, useAdminElection } from "../hooks/useAdmin";
import { API_BASE_URL } from "../lib/api";
import { MdArrowBack, MdAdd, MdPerson, MdSearch, MdImage, MdClose } from "react-icons/md";
import { useToast } from "../hooks/useToast";

export function AddCandidate() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { id: electionId, officeId } = useParams<{ id: string; officeId: string }>();
  const createCandidate = useCreateCandidate();
  const { data: electionResponse } = useAdminElection(electionId);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVoter, setSelectedVoter] = useState<any | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    quote: "",
    manifesto: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading: isSearching } = useSearchVotersByElection(
    electionId,
    searchQuery.length >= 3 ? searchQuery : ""
  );

  const voters = searchResults?.success ? searchResults.data : [];

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file", "error");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size must be less than 5MB", "error");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("folder", "profile-images");

      const response = await fetch(`${API_BASE_URL}/admin/storage/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      });

      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({ ...prev, image: result.data.url }));
        showToast("Image uploaded successfully!", "success");
      } else {
        throw new Error(result.message || "Failed to upload image");
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officeId || !selectedVoter) return;

    // If image file is selected but not uploaded, upload it first
    if (imageFile && !formData.image) {
      await handleUploadImage();
      if (!formData.image) {
        showToast("Please wait for image upload to complete", "warning");
        return;
      }
    }

    try {
      await createCandidate.mutateAsync({
        officeId: officeId!,
        voterId: selectedVoter.id,
        quote: formData.quote || undefined,
        manifesto: formData.manifesto || undefined,
        image: formData.image || undefined,
      });

      showToast("Candidate added successfully", "success");
      navigate(`/admin/elections/${electionId}/offices/${officeId}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to add candidate", "error");
    }
  };

  const election = electionResponse?.success ? electionResponse.data : null;
  const electionType = election?.type || "class";

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
          <h1 className="text-4xl font-bold text-white mb-2">Add Candidate</h1>
          <p className="text-[#92c9c9]">
            Add a new candidate to this office. Search for a voter in this {electionType} election and optionally add their campaign information.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#142828] border border-[#234848] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Voter Search */}
            <div ref={searchRef} className="relative">
              <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                Search Voter *
              </label>
              <div className="relative">
                <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#568888] w-5 h-5" />
                <input
                  type="text"
                  required
                  value={selectedVoter ? `${selectedVoter.name || selectedVoter.username} (${selectedVoter.regNumber})` : searchQuery}
                  onChange={(e) => {
                    if (selectedVoter) {
                      setSelectedVoter(null);
                      setFormData((prev) => ({ ...prev, image: "" }));
                      setImageFile(null);
                      setImagePreview(null);
                    }
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.length >= 3) {
                      setShowResults(true);
                    }
                  }}
                  placeholder="Type at least 3 characters to search..."
                  className="w-full pl-12 pr-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec]"
                />
                {selectedVoter && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVoter(null);
                      setSearchQuery("");
                      setFormData((prev) => ({ ...prev, image: "" }));
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#568888] hover:text-white"
                  >
                    <MdClose className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchQuery.length >= 3 && (
                <div className="absolute z-50 w-full mt-2 bg-[#102222] border border-[#234848] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-[#568888]">Searching...</div>
                  ) : voters.length === 0 ? (
                    <div className="p-4 text-center text-[#568888]">No voters found</div>
                  ) : (
                    voters.map((voter) => (
                      <button
                        key={voter.id}
                        type="button"
                        onClick={() => {
                          setSelectedVoter(voter);
                          setSearchQuery("");
                          setShowResults(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-[#142828] transition-colors border-b border-[#234848] last:border-b-0"
                      >
                        <div className="text-white font-medium">{voter.name || voter.username}</div>
                        <div className="text-sm text-[#92c9c9]">{voter.regNumber}</div>
                        <div className="text-xs text-[#568888] mt-1">
                          {voter.classLevel} • {voter.department} • {voter.faculty}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              <p className="mt-2 text-sm text-[#568888]">
                Search for voters eligible for this {electionType} election. Type at least 3 characters.
              </p>
            </div>

            {selectedVoter && (
              <div className="bg-[#102222] border border-[#13ecec]/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#13ecec]/20 rounded-lg flex items-center justify-center">
                    <MdPerson className="w-6 h-6 text-[#13ecec]" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{selectedVoter.name || selectedVoter.username}</div>
                    <div className="text-sm text-[#92c9c9]">{selectedVoter.regNumber}</div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                Quote (Optional)
              </label>
              <input
                type="text"
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="e.g. Vote for change!"
                maxLength={200}
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec]"
              />
              <div className="text-right text-sm text-[#568888] mt-1">
                {formData.quote.length}/200 characters
              </div>
            </div>

            <div>
              <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                Manifesto (Optional)
              </label>
              <textarea
                value={formData.manifesto}
                onChange={(e) => setFormData({ ...formData, manifesto: e.target.value })}
                placeholder="Enter the candidate's manifesto or campaign promises..."
                rows={8}
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec] resize-none"
              />
            </div>

            <div>
              <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                Profile Image (Optional)
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="px-4 py-3 bg-[#102222] border border-[#234848] rounded-lg text-white hover:border-[#13ecec] transition-colors flex items-center justify-center gap-2">
                      <MdImage className="w-5 h-5" />
                      <span>{imageFile ? imageFile.name : "Choose Image"}</span>
                    </div>
                  </label>
                  {imageFile && !formData.image && (
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={uploadingImage}
                      className="px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg disabled:opacity-50"
                    >
                      {uploadingImage ? "Uploading..." : "Upload"}
                    </button>
                  )}
                </div>
                {imagePreview && (
                  <div className="relative w-32 h-32">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border border-[#234848]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: "" }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <MdClose className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {formData.image && (
                  <div className="text-sm text-[#13ecec]">
                    ✓ Image uploaded: {formData.image.substring(0, 50)}...
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-[#568888]">
                Upload a profile image for the candidate (max 5MB, JPG/PNG).
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
                disabled={createCandidate.isPending || !selectedVoter || uploadingImage}
                className="flex-1 px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <MdAdd className="w-4 h-4" />
                {createCandidate.isPending ? "Adding..." : "Add Candidate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
