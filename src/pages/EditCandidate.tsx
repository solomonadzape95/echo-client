import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { useAdminCandidate, useUpdateCandidate, useAdminElection, useAdminOffice } from "../hooks/useAdmin";
import { API_BASE_URL } from "../lib/api";
import { MdArrowBack, MdSave, MdImage, MdClose } from "react-icons/md";
import { useToast } from "../hooks/useToast";

export function EditCandidate() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { slug: electionSlug, officeSlug, candidateId } = useParams<{ slug: string; officeSlug: string; candidateId: string }>();
  const { data: candidateResponse, isLoading } = useAdminCandidate(candidateId);
  const { data: electionResponse } = useAdminElection(electionSlug);
  const { data: officeResponse } = useAdminOffice(officeSlug);
  const updateCandidate = useUpdateCandidate();
  
  const [formData, setFormData] = useState({
    quote: "",
    manifesto: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [useProfilePic, setUseProfilePic] = useState(false);

  const candidate = candidateResponse?.success ? candidateResponse.data : null;

  // Populate form when candidate data loads
  useEffect(() => {
    if (candidate) {
      setFormData({
        quote: candidate.quote || "",
        manifesto: candidate.manifesto || "",
        image: candidate.image || "",
      });
    }
  }, [candidate]);

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
      setUseProfilePic(false);
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
    if (!candidate) return;

    // If image file is selected but not uploaded, upload it first
    if (imageFile && !formData.image) {
      await handleUploadImage();
      if (!formData.image) {
        showToast("Please wait for image upload to complete", "warning");
        return;
      }
    }

    try {
      // If using profile pic, send the profile pic URL, otherwise send the custom image
      const imageToUse = useProfilePic && candidate.voterProfilePicture 
        ? candidate.voterProfilePicture 
        : (formData.image || undefined);

      await updateCandidate.mutateAsync({
        id: candidate.id,
        data: {
          quote: formData.quote || undefined,
          manifesto: formData.manifesto || undefined,
          image: imageToUse,
        },
      });

      showToast("Candidate updated successfully", "success");
      navigate(`/admin/elections/${electionSlug}/offices/${officeSlug}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update candidate", "error");
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

  if (!candidate) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 ">
            <p className="font-medium">Candidate not found</p>
            <button
              onClick={() => navigate(`/admin/elections/${electionSlug}/offices/${officeSlug}`)}
              className="mt-4 px-4 py-2 bg-[#234848] text-white  hover:bg-[#2a5555] transition-colors"
            >
              Back to Office
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
          onClick={() => navigate(`/admin/elections/${electionSlug}/offices/${officeSlug}`)}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Office</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Candidate</h1>
          <p className="text-[#92c9c9]">
            Update the candidate's campaign information.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#142828] border border-[#234848]  p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec]"
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
                className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec] resize-none"
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
                    <div className="px-4 py-3 bg-[#102222] border border-[#234848]  text-white hover:border-[#13ecec] transition-colors flex items-center justify-center gap-2">
                      <MdImage className="w-5 h-5" />
                      <span>{imageFile ? imageFile.name : "Upload Custom Image"}</span>
                    </div>
                  </label>
                  {imageFile && !formData.image && (
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={uploadingImage}
                      className="px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold  disabled:opacity-50"
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
                      className="w-full h-full object-cover  border border-[#234848]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: "" }));
                        setUseProfilePic(false);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white  p-1"
                    >
                      <MdClose className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {formData.image && !imagePreview && (
                  <div className="relative w-32 h-32">
                    <img
                      src={formData.image}
                      alt="Current"
                      className="w-full h-full object-cover  border border-[#234848]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, image: "" }));
                        setUseProfilePic(false);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white  p-1"
                    >
                      <MdClose className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setUseProfilePic(!useProfilePic);
                    if (!useProfilePic) {
                      // Clear custom image when using profile pic
                      setFormData((prev) => ({ ...prev, image: "" }));
                      setImageFile(null);
                      setImagePreview(null);
                    }
                  }}
                  className={`px-4 py-2  font-medium transition-colors ${
                    useProfilePic
                      ? "bg-[#13ecec] text-[#112222]"
                      : "bg-[#234848] text-white hover:bg-[#2a5555]"
                  }`}
                >
                  {useProfilePic ? "✓ Using Profile Picture" : "Use Candidate's Profile Picture"}
                </button>
              </div>
              <p className="mt-2 text-sm text-[#568888]">
                Upload a custom image or use the candidate's profile picture (max 5MB, JPG/PNG).
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/admin/elections/${electionSlug}/offices/${officeSlug}`)}
                className="flex-1 px-4 py-3 bg-[#234848] hover:bg-[#2a5555] text-white  transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateCandidate.isPending || uploadingImage}
                className="flex-1 px-4 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold  disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <MdSave className="w-4 h-4" />
                {updateCandidate.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

