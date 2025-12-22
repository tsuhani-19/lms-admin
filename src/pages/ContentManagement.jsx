import React, { useState, useEffect } from "react";
import { FiTrash2, FiEdit2, FiVideo, FiPlus, FiX } from "react-icons/fi";
import AdminAPI from "../services/api";

export default function ContentManagement() {
  const [sections, setSections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [sectionTopicCounts, setSectionTopicCounts] = useState({});
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(false);

  const [showSectionForm, setShowSectionForm] = useState(false);
  const [sectionFormData, setSectionFormData] = useState({
    title: "",
    description: "",
    order: "",
  });
  const [editingSection, setEditingSection] = useState(null);

  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicFormData, setTopicFormData] = useState({
    title: "",
    videoUrl: "",
    locked: false,
  });
  const [editingTopic, setEditingTopic] = useState(null);

  const [topicsWithQuiz, setTopicsWithQuiz] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (activeSectionId) {
      fetchTopics(activeSectionId);
    }
  }, [activeSectionId]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await AdminAPI.getAllSections();
      if (response.success && response.data) {
        const sortedSections = response.data.sort((a, b) => a.order - b.order);
        setSections(sortedSections);

        const counts = {};
        await Promise.all(
          sortedSections.map(async (section) => {
            try {
              const topicsResponse = await AdminAPI.getAllTopics(section.id);
              counts[section.id] = topicsResponse.success
                ? topicsResponse.data.length
                : 0;
            } catch {
              counts[section.id] = 0;
            }
          })
        );
        setSectionTopicCounts(counts);

        if (sortedSections.length > 0 && !activeSectionId) {
          setActiveSectionId(sortedSections[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching sections:", err);
      setError(err.message || "Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (sectionId) => {
    if (!sectionId) {
      setTopics([]);
      setTopicsWithQuiz({});
      return;
    }

    try {
      setTopicsLoading(true);
      const response = await AdminAPI.getAllTopics(sectionId);
      if (response.success && response.data) {
        setTopics(response.data);

        setSectionTopicCounts((prev) => ({
          ...prev,
          [sectionId]: response.data.length,
        }));

        const quizChecks = {};
        await Promise.all(
          response.data.map(async (topic) => {
            try {
              const quiz = await AdminAPI.checkTopicHasQuiz(topic.id);
              quizChecks[topic.id] = !!quiz;
            } catch {
              quizChecks[topic.id] = false;
            }
          })
        );
        setTopicsWithQuiz(quizChecks);
      }
    } catch (err) {
      console.error("Error fetching topics:", err);
      setError(err.message || "Failed to fetch topics");
      setTopics([]);
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      if (editingSection) {
        await AdminAPI.updateSection(editingSection.id, sectionFormData);
        setSuccess("Section updated successfully!");
      } else {
        await AdminAPI.createSection(
          sectionFormData.title,
          sectionFormData.description,
          parseInt(sectionFormData.order)
        );
        setSuccess("Section created successfully!");
      }

      setSectionFormData({ title: "", description: "", order: "" });
      setEditingSection(null);
      setTimeout(() => {
        setShowSectionForm(false);
        setSuccess("");
        fetchSections();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to save section");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!activeSectionId) {
      setError("Please select a section first");
      setSubmitting(false);
      return;
    }

    try {
      if (editingTopic) {
        await AdminAPI.updateTopic(editingTopic.id, topicFormData);
        setSuccess("Topic updated successfully!");
      } else {
        await AdminAPI.createTopic(
          activeSectionId,
          topicFormData.title,
          topicFormData.videoUrl || null,
          topicFormData.locked
        );
        setSuccess("Topic created successfully!");
      }

      setTopicFormData({ title: "", videoUrl: "", locked: false });
      setEditingTopic(null);
      setTimeout(() => {
        setShowTopicForm(false);
        setSuccess("");
        fetchTopics(activeSectionId);
        fetchSections();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to save topic");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSection = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this section? All topics in this section will also be deleted."
      )
    ) {
      return;
    }

    try {
      await AdminAPI.deleteSection(id);
      setSuccess("Section deleted successfully!");

      if (activeSectionId === id) {
        const remainingSections = sections.filter((s) => s.id !== id);
        setActiveSectionId(
          remainingSections.length > 0 ? remainingSections[0].id : null
        );
      }

      setTimeout(() => {
        setSuccess("");
        fetchSections();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to delete section");
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) {
      return;
    }

    try {
      await AdminAPI.deleteTopic(id);
      setSuccess("Topic deleted successfully!");
      setTimeout(() => {
        setSuccess("");
        fetchTopics(activeSectionId);
        fetchSections();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to delete topic");
    }
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setSectionFormData({
      title: section.title,
      description: section.description || "",
      order: section.order.toString(),
    });
    setShowSectionForm(true);
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setTopicFormData({
      title: topic.title,
      videoUrl: topic.videoUrl || "",
      locked: topic.locked || false,
    });
    setShowTopicForm(true);
  };

  const handleCloseSectionForm = () => {
    setShowSectionForm(false);
    setEditingSection(null);
    setSectionFormData({ title: "", description: "", order: "" });
    setError("");
    setSuccess("");
  };

  const handleCloseTopicForm = () => {
    setShowTopicForm(false);
    setEditingTopic(null);
    setTopicFormData({ title: "", videoUrl: "", locked: false });
    setError("");
    setSuccess("");
  };

  const activeSection = sections.find((s) => s.id === activeSectionId);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-1 ">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
          <div className="flex flex-col">
        
            <h1 className="text-3xl text-[#3E0288] font-semibold  mt-1">
              Content Management
            </h1>
            <p className="text-[#3E0288] text-sm mt-2 max-w-lg">
              Organize onboarding <span className="font-medium">sections</span>, topics, and quizzes in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 md:mt-0">
            <button
              onClick={() => {
                setEditingSection(null);
                setSectionFormData({
                  title: "",
                  description: "",
                  order: (sections.length + 1).toString(),
                });
                setShowSectionForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3E0288] px-4 py-2.5 text-sm font-medium text-white "
            >
              <FiPlus className="w-4 h-4" />
              <span>New Section</span>
            </button>
          </div>
        </div>

        {/* Status messages */}
        {(success || error) && (
          <div className="mb-4 space-y-2">
            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 min-h-0 gap-5">
          {/* Left sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
                Training Sections
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                {sections.length} total
              </span>
            </div>

            <div className="flex-1 overflow-auto space-y-2 pr-1">
              {loading ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Loading sections...
                </div>
              ) : sections.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No sections yet. Create the first one.
                </div>
              ) : (
                sections.map((section) => (
                  <div
                    key={section.id}
                    className={`group relative flex items-center rounded-xl border px-3 py-3 text-sm transition ${
                      activeSectionId === section.id
                        ? "border-violet-200 bg-violet-50/80 shadow-sm"
                        : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <button
                      onClick={() => setActiveSectionId(section.id)}
                      className="flex flex-1 items-center justify-between text-left"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">
                          {section.title}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                          {sectionTopicCounts[section.id] || 0} topic
                          {sectionTopicCounts[section.id] !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-400 text-base">
                        ›
                      </span>
                    </button>

                    <div className="ml-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSection(section);
                        }}
                        className="rounded-md p-1 text-slate-400 hover:text-violet-600 hover:bg-violet-50"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(section.id);
                        }}
                        className="rounded-md p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="w-full md:flex-1 bg-white/90 backdrop-blur border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  {activeSection
                    ? `${activeSection.title} topics`
                    : "Select a section"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Manage video and quiz status for each topic.
                </p>
              </div>
              {activeSectionId && (
                <button
                  onClick={() => {
                    setEditingTopic(null);
                    setTopicFormData({
                      title: "",
                      videoUrl: "",
                      locked: false,
                    });
                    setShowTopicForm(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>New Topic</span>
                </button>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 flex-1 min-h-0 overflow-hidden">
              {!activeSectionId ? (
                <div className="flex h-64 items-center justify-center px-4 text-center text-xs text-slate-400">
                  Choose a section on the left to see its topics.
                </div>
              ) : topicsLoading ? (
                <div className="flex h-64 items-center justify-center text-xs text-slate-400">
                  Loading topics...
                </div>
              ) : topics.length === 0 ? (
                <div className="flex h-64 items-center justify-center px-4 text-center text-xs text-slate-400">
                  No topics in this section yet. Use &quot;New Topic&quot; to
                  add your first topic.
                </div>
              ) : (
                <div className="h-full overflow-auto">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead className="bg-white sticky top-0 z-10 shadow-sm">
                      <tr className="text-slate-500">
                        <th className="px-4 py-3 text-xs font-semibold">
                          Topic name
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold">
                          Video
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold">
                          Quiz
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topics.map((topic) => (
                        <tr
                          key={topic.id}
                          className="bg-white/80 hover:bg-violet-50/60 transition-colors"
                        >
                          <td className="px-4 py-3 align-middle">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-900">
                                {topic.title}
                              </span>
                              {topic.locked && (
                                <span className="mt-1 inline-flex w-max rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                  Locked
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center align-middle">
                            {topic.videoUrl ? (
                              <span className="inline-flex items-center justify-center rounded-full bg-violet-50 p-1.5 text-violet-600">
                                <FiVideo className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                No video
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center align-middle">
                            {topicsWithQuiz[topic.id] ? (
                              <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                Quiz added
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                No quiz
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditTopic(topic)}
                                className="inline-flex items-center rounded-md border border-transparent bg-white px-2 py-1 text-[11px] font-medium text-slate-600 shadow-sm hover:border-violet-200 hover:text-violet-700"
                              >
                                <FiEdit2 className="mr-1 h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTopic(topic.id)}
                                className="inline-flex items-center rounded-md border border-transparent bg-white px-2 py-1 text-[11px] font-medium text-rose-600 shadow-sm hover:border-rose-200 hover:bg-rose-50"
                              >
                                <FiTrash2 className="mr-1 h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section Form Sidebar */}
      {showSectionForm && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
            onClick={handleCloseSectionForm}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingSection ? "Edit section" : "New section"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure the name and display order.
                </p>
              </div>
              <button
                onClick={handleCloseSectionForm}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={handleSectionSubmit}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={sectionFormData.title}
                  onChange={(e) =>
                    setSectionFormData({
                      ...sectionFormData,
                      title: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder="e.g. Vision & Mission"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={sectionFormData.description}
                  onChange={(e) =>
                    setSectionFormData({
                      ...sectionFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder="Short description for this section (optional)"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Order <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={sectionFormData.order}
                  onChange={(e) =>
                    setSectionFormData({
                      ...sectionFormData,
                      order: e.target.value,
                    })
                  }
                  required
                  min="1"
                  className="w-32 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder="1"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Sections are sorted ascending by this value.
                </p>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseSectionForm}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting
                    ? editingSection
                      ? "Updating..."
                      : "Creating..."
                    : editingSection
                    ? "Update section"
                    : "Create section"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Topic Form Sidebar */}
      {showTopicForm && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
            onClick={handleCloseTopicForm}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingTopic ? "Edit topic" : "New topic"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Link an optional video and mark the topic as locked.
                </p>
              </div>
              <button
                onClick={handleCloseTopicForm}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={handleTopicSubmit}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={topicFormData.title}
                  onChange={(e) =>
                    setTopicFormData({
                      ...topicFormData,
                      title: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder="e.g. Our Company Story"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Video URL
                </label>
                <input
                  type="url"
                  value={topicFormData.videoUrl}
                  onChange={(e) =>
                    setTopicFormData({
                      ...topicFormData,
                      videoUrl: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder="https://video-link.com/..."
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Leave empty if this topic does not have a video.
                </p>
              </div>
              <div>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={topicFormData.locked}
                    onChange={(e) =>
                      setTopicFormData({
                        ...topicFormData,
                        locked: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-slate-700">
                    Require completion of previous content
                  </span>
                </label>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseTopicForm}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting
                    ? editingTopic
                      ? "Updating..."
                      : "Creating..."
                    : editingTopic
                    ? "Update topic"
                    : "Create topic"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
