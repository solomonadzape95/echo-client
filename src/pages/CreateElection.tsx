import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { useCreateElection, useAdminClasses, useOfficeTemplates, type OfficeTemplate } from "../hooks/useAdmin";
import { useFaculties, useDepartments, useEnums } from "../hooks/useEnums";
import { MdArrowBack, MdSchool, MdGroups, MdDescription, MdRocket, MdVisibility, MdSave, MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useToast } from "../hooks/useToast";

type ElectionType = "class" | "department" | "faculty";

export function CreateElection() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const createElection = useCreateElection();
  
  // State declarations first
  const [electionType, setElectionType] = useState<ElectionType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    domainId: "",
    selectedFaculty: "",
    selectedDepartment: "",
  });
  const [dateError, setDateError] = useState<string | null>(null);
  const [selectedOffices, setSelectedOffices] = useState<Set<string>>(new Set());

  // Hooks after state
  const { data: classesResponse } = useAdminClasses();
  const { data: facultiesResponse } = useFaculties();
  const { data: departmentsResponse } = useDepartments();
  const { data: enumsResponse } = useEnums();
  const { data: officeTemplatesResponse } = useOfficeTemplates(electionType || undefined);

  const classes = classesResponse?.success ? classesResponse.data : [];
  const faculties = facultiesResponse?.success ? Object.values(facultiesResponse.data) : [];
  const allDepartments = departmentsResponse?.success ? Object.values(departmentsResponse.data) : [];
  const facultyDepartmentMap = enumsResponse?.success ? enumsResponse.data.facultyDepartmentMap : {};

  // Create a list of departments with their faculty info
  const departmentsWithFaculty = Object.entries(facultyDepartmentMap).flatMap(([faculty, depts]) =>
    depts.map(dept => ({ department: dept, faculty }))
  );

  // Reset domain selections and offices when election type changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      domainId: "",
      selectedFaculty: "",
      selectedDepartment: "",
    }));
    setSelectedOffices(new Set());
  }, [electionType]);

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
    if (!electionType) return;
    
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

      // domainId is set directly from the dropdowns:
      // - Class: class UUID (from classes API)
      // - Department: department enum string
      // - Faculty: faculty enum string
      
      // Prepare offices array from selected offices
      const offices = officeTemplatesResponse?.success && officeTemplatesResponse.data
        ? officeTemplatesResponse.data
            .filter((office) => selectedOffices.has(office.title))
            .map((office) => ({
              title: office.title,
              description: office.description,
            }))
        : undefined;

      // Note: Status is derived by the backend, so we don't send it
      await createElection.mutateAsync({
        name: formData.name,
        type: electionType,
        startDate: startISO,
        endDate: endISO,
        description: formData.description || undefined,
        domainId: formData.domainId,
        offices: offices && offices.length > 0 ? offices : undefined,
      });

      showToast("Election created successfully", "success");
      navigate("/admin/elections");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to create election", "error");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/elections")}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Elections</span>
        </button>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">INITIATE ELECTION SEQUENCE</h1>
            <p className="text-[#92c9c9]">
              Configure parameters, select voter base, and define ballot items for the upcoming voting cycle.
            </p>
          </div>
          <div className="bg-[#142828] border border-[#234848] px-4 py-2 ">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 "></div>
              <span className="text-sm text-[#92c9c9] uppercase tracking-wider">STATUS: DRAFT MODE</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Election Scope */}
          <div className="bg-[#142828] border border-[#234848]  p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#13ecec]  flex items-center justify-center text-[#112222] font-bold text-2xl">
                1
              </div>
              <h2 className="text-2xl font-bold text-white">ELECTION SCOPE</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Class */}
              <button
                type="button"
                onClick={() => setElectionType("class")}
                className={`p-6 border-2  text-left transition-all ${
                  electionType === "class"
                    ? "border-[#13ecec] bg-[#13ecec]/10"
                    : "border-[#234848] hover:border-[#13ecec]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <MdDescription className="w-8 h-8 text-[#13ecec]" />
                  {electionType === "class" && (
                    <span className="text-xs bg-[#13ecec] text-[#112222] px-2 py-1  font-bold uppercase">
                      SELECTED
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Class</h3>
                <p className="text-[#92c9c9] text-sm">
                  Elections for class-level representatives and positions.
                </p>
              </button>

              {/* Department */}
              <button
                type="button"
                onClick={() => setElectionType("department")}
                className={`p-6 border-2  text-left transition-all ${
                  electionType === "department"
                    ? "border-[#13ecec] bg-[#13ecec]/10"
                    : "border-[#234848] hover:border-[#13ecec]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <MdGroups className="w-8 h-8 text-[#13ecec]" />
                  {electionType === "department" && (
                    <span className="text-xs bg-[#13ecec] text-[#112222] px-2 py-1  font-bold uppercase">
                      SELECTED
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Department</h3>
                <p className="text-[#92c9c9] text-sm">
                  Department-level elections for academic department leadership.
                </p>
              </button>

              {/* Faculty */}
              <button
                type="button"
                onClick={() => setElectionType("faculty")}
                className={`p-6 border-2  text-left transition-all ${
                  electionType === "faculty"
                    ? "border-[#13ecec] bg-[#13ecec]/10"
                    : "border-[#234848] hover:border-[#13ecec]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <MdSchool className="w-8 h-8 text-[#13ecec]" />
                  {electionType === "faculty" && (
                    <span className="text-xs bg-[#13ecec] text-[#112222] px-2 py-1  font-bold uppercase">
                      SELECTED
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Faculty</h3>
                <p className="text-[#92c9c9] text-sm">
                  Campus-wide faculty elections for student body representatives.
                </p>
              </button>
            </div>
          </div>

          {/* Step 2: Election Metadata */}
          <div className="bg-[#142828] border border-[#234848]  p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#13ecec]  flex items-center justify-center text-[#112222] font-bold text-2xl">
                2
              </div>
              <h2 className="text-2xl font-bold text-white">ELECTION METADATA</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                  OFFICIAL TITLE
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
                  DESCRIPTION (SHORT)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter a brief summary displayed on the ballot card..."
                  maxLength={140}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec] resize-none"
                />
                <div className="text-right text-sm text-[#568888] mt-1">
                  {formData.description.length}/140 characters
                </div>
              </div>
              {/* Domain Selection based on Election Type */}
              {electionType === "class" && (
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    CLASS *
                  </label>
                  <select
                    required
                    value={formData.domainId}
                    onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.level} - {cls.department} ({cls.faculty})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {electionType === "department" && (
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    DEPARTMENT *
                  </label>
                  <select
                    required
                    value={formData.domainId}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        domainId: e.target.value
                      });
                    }}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  >
                    <option value="">Select a department</option>
                    {departmentsWithFaculty.map(({ department, faculty }) => (
                      <option key={`${faculty}-${department}`} value={department}>
                        {department} ({faculty})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {electionType === "faculty" && (
                <div>
                  <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                    FACULTY *
                  </label>
                  <select
                    required
                    value={formData.domainId}
                    onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
                    className="w-full px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  >
                    <option value="">Select a faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Office Selection */}
          {electionType && (
            <div className="bg-[#142828] border border-[#234848]  p-8 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#13ecec]  flex items-center justify-center text-[#112222] font-bold text-2xl">
                  3
                </div>
                <h2 className="text-2xl font-bold text-white">OFFICE SELECTION</h2>
              </div>
              <p className="text-[#92c9c9] mb-6">
                Select the offices that will be part of this election. You can add more offices later if needed.
              </p>
              {officeTemplatesResponse?.success && officeTemplatesResponse.data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {officeTemplatesResponse.data.map((office) => {
                    const isSelected = selectedOffices.has(office.title);
                    return (
                      <button
                        key={office.title}
                        type="button"
                        onClick={() => {
                          const newSelected = new Set(selectedOffices);
                          if (isSelected) {
                            newSelected.delete(office.title);
                          } else {
                            newSelected.add(office.title);
                          }
                          setSelectedOffices(newSelected);
                        }}
                        className={`p-4 border-2  text-left transition-all ${
                          isSelected
                            ? "border-[#13ecec] bg-[#13ecec]/10"
                            : "border-[#234848] hover:border-[#13ecec]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-white flex-1">{office.title}</h3>
                          {isSelected ? (
                            <MdCheckBox className="w-6 h-6 text-[#13ecec] flex-shrink-0 ml-2" />
                          ) : (
                            <MdCheckBoxOutlineBlank className="w-6 h-6 text-[#568888] flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-[#92c9c9]">{office.description}</p>
                      </button>
                    );
                  })}
                </div>
              ) : officeTemplatesResponse?.success === false ? (
                <div className="text-red-400">
                  Failed to load office templates. You can add offices manually after creating the election.
                </div>
              ) : (
                <div className="text-[#92c9c9]">Loading office templates...</div>
              )}
              {selectedOffices.size > 0 && (
                <div className="mt-4 text-sm text-[#13ecec]">
                  {selectedOffices.size} office{selectedOffices.size !== 1 ? "s" : ""} selected
                </div>
              )}
            </div>
          )}

          {/* Step 4: Timeline Sequence */}
          <div className="bg-[#142828] border border-[#234848]  p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#13ecec]  flex items-center justify-center text-[#112222] font-bold text-2xl">
                {electionType ? "4" : "3"}
              </div>
              <h2 className="text-2xl font-bold text-white">TIMELINE SEQUENCE</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                  START DATE & TIME
                </label>
                <div className="flex gap-4">
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="flex-1 px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  />
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="flex-1 px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#568888] text-sm uppercase tracking-wider mb-2">
                  END DATE & TIME
                </label>
                <div className="flex gap-4">
                  <input
                    type="date"
                    required
                    min={formData.startDate || undefined}
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData({ ...formData, endDate: e.target.value });
                      setDateError(null);
                    }}
                    className="flex-1 px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  />
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => {
                      setFormData({ ...formData, endTime: e.target.value });
                      setDateError(null);
                    }}
                    className="flex-1 px-4 py-3 bg-[#102222] border border-[#234848]  text-white focus:outline-none focus:border-[#13ecec]"
                  />
                </div>
                {dateError && (
                  <p className="mt-2 text-sm text-red-400">{dateError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/elections")}
              className="text-[#92c9c9] hover:text-white transition-colors"
            >
              DISCARD
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                className="px-6 py-3 bg-[#234848] hover:bg-[#2a5555] text-white font-bold  flex items-center gap-2"
              >
                <MdVisibility className="w-4 h-4" />
                <span>PREVIEW BALLOT</span>
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-[#234848] hover:bg-[#2a5555] text-white font-bold  flex items-center gap-2"
              >
                <MdSave className="w-4 h-4" />
                <span>SAVE DRAFT</span>
              </button>
              <button
                type="submit"
                disabled={
                  !electionType || 
                  !formData.domainId || 
                  !formData.name ||
                  !formData.startDate ||
                  !formData.startTime ||
                  !formData.endDate ||
                  !formData.endTime ||
                  createElection.isPending ||
                  !!dateError
                }
                className="px-6 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold  flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdRocket className="w-4 h-4" />
                <span>{createElection.isPending ? "PUBLISHING..." : "PUBLISH ELECTION"}</span>
              </button>
            </div>
          </div>
        </form>
    </div>
    </AdminLayout>
  );
}
