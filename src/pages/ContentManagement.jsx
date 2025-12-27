import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiChevronRight, FiVideo, FiEdit2, FiTrash2, FiChevronDown, FiFileText, FiUpload, FiX, FiArrowLeft, FiMoreVertical } from 'react-icons/fi';

export default function ContentManagement() {
  const { t } = useTranslation(['content', 'common']);
  const [selectedSection, setSelectedSection] = useState('Vision & Mission');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoSection, setSelectedVideoSection] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const videoInputRef = useRef(null);
  
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizData, setQuizData] = useState({
    topicName: '',
    question: '',
    questionType: 'Multiple Questions',
    options: ['', '', '', ''],
    correctAnswer: null,
  });
  const [showQuestionTypeDropdown, setShowQuestionTypeDropdown] = useState(false);
  
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  
  const [showTopicDetails, setShowTopicDetails] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const [showManageVideoModal, setShowManageVideoModal] = useState(false);
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);
  const [selectedTopicForAction, setSelectedTopicForAction] = useState(null);
  
  // Quiz Assessment data
  const [quizAssessment, setQuizAssessment] = useState({
    questions: 5,
    passingScore: 80,
    attempts: 3,
    timeLimit: 20,
  });
  
  // Completion Rules data
  const [completionRules, setCompletionRules] = useState({
    prerequisites: 'No prerequisites',
    lockUntilPrerequisitesMet: true,
  });
  
  // Quiz form data for topic details page
  const [topicQuizData, setTopicQuizData] = useState({
    section: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: null,
  });
  
  // Visibility & Access data
  const [visibilityData, setVisibilityData] = useState({
    audience: 'All Users',
    departments: {
      Engineering: true,
      Sales: true,
      Marketing: true,
      HR: true,
    },
  });

  // Sample data for training sections
  const trainingSections = [
    { name: 'Vision & Mission', topics: 5 },
    { name: 'Company Culture', topics: 5 },
    { name: 'Rules & Policies', topics: 5 },
    { name: 'Job Basics', topics: 5 },
    { name: 'Tools & Software', topics: 5 },
    { name: 'Security Training', topics: 5 },
  ];

  // Sample data for topics based on selected section
  const topicsData = {
    'Vision & Mission': [
      { name: 'Our Company Story' },
      { name: 'Mission Statement Deep Dive' },
      { name: 'Core Values Workshop' },
      { name: 'Vision for the Future' },
      { name: 'Company Overview Quiz' },
    ],
    'Company Culture': [
      { name: 'Culture Introduction' },
      { name: 'Team Values' },
      { name: 'Work Environment' },
      { name: 'Communication Style' },
      { name: 'Culture Quiz' },
    ],
    'Rules & Policies': [
      { name: 'Company Policies' },
      { name: 'Code of Conduct' },
      { name: 'HR Policies' },
      { name: 'Safety Rules' },
      { name: 'Policies Quiz' },
    ],
    'Job Basics': [
      { name: 'Job Introduction' },
      { name: 'Role Responsibilities' },
      { name: 'Daily Workflow' },
      { name: 'Performance Expectations' },
      { name: 'Job Basics Quiz' },
    ],
    'Tools & Software': [
      { name: 'Tool Overview' },
      { name: 'Software Setup' },
      { name: 'Tool Usage Guide' },
      { name: 'Best Practices' },
      { name: 'Tools Quiz' },
    ],
    'Security Training': [
      { name: 'Security Basics' },
      { name: 'Data Protection' },
      { name: 'Password Policies' },
      { name: 'Security Protocols' },
      { name: 'Security Quiz' },
    ],
  };

  const currentTopics = topicsData[selectedSection] || [];

  // Function to close all modals
  const closeAllModals = () => {
    setShowDocumentModal(false);
    setShowVideoModal(false);
    setShowQuizModal(false);
    setShowAddSectionModal(false);
    setShowManageVideoModal(false);
    setShowEditQuizModal(false);
    setShowSectionDropdown(false);
    setShowQuestionTypeDropdown(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadDocument = () => {
    // Handle document upload logic here
    console.log('Uploading document:', { documentTitle, selectedFile });
    // Close modal and reset form
    setShowDocumentModal(false);
    setDocumentTitle('');
    setSelectedFile(null);
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideoFile(file);
    }
  };

  const handleVideoDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedVideoFile(file);
    }
  };

  const handleVideoBrowseClick = () => {
    videoInputRef.current?.click();
  };

  const handleUploadVideo = () => {
    // Handle video upload logic here
    console.log('Uploading video:', { selectedVideoSection, selectedVideoFile });
    // Close modal and reset form
    setShowVideoModal(false);
    setSelectedVideoSection('');
    setSelectedVideoFile(null);
  };

  const handleQuizOptionChange = (index, value) => {
    const newOptions = [...quizData.options];
    newOptions[index] = value;
    setQuizData({ ...quizData, options: newOptions });
  };

  const handleSaveQuiz = () => {
    // Handle quiz save logic here
    console.log('Saving quiz:', quizData);
    // Close modal and reset form
    setShowQuizModal(false);
    setQuizData({
      topicName: '',
      question: '',
      questionType: 'Multiple Questions',
      options: ['', '', '', ''],
      correctAnswer: null,
    });
  };

  const handleCreateSection = () => {
    // Handle section creation logic here
    console.log('Creating section:', { sectionName, sectionDescription });
    // Close modal and reset form
    setShowAddSectionModal(false);
    setSectionName('');
    setSectionDescription('');
  };

  // If showing topic details, render that view
  if (showTopicDetails) {
    return (
      <div className="w-full bg-white min-h-screen">
        {/* Header Section */}
        <div className="bg-white px-6 py-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button
                onClick={() => setShowTopicDetails(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-[#3E0288] transition text-sm mb-2"
              >
                <FiArrowLeft size={16} />
                <span>{t('content:backToContent')}</span>
              </button>
              <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                {t('content:title')}
              </h1>
              <p className="text-[#3E0288] text-base font-medium opacity-70" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                {t('content:subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <span className="text-sm font-semibold">Eng (US)</span>
                <span className="text-lg">🇺🇸</span>
                <FiChevronDown className="text-gray-400" size={14} />
              </div>
              {/* Profile Picture */}
              <div className="w-10 h-10 rounded-full bg-[#3E0288] flex items-center justify-center text-white font-semibold">
                U
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="px-6 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Quiz Assessment Panel */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h2 className="text-[#3E0288] text-lg font-bold mb-4">Quiz Assessment</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Questions</span>
                  <span className="text-sm font-semibold text-gray-800">{quizAssessment.questions} questions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Passing Score</span>
                  <span className="text-sm font-semibold text-gray-800">{quizAssessment.passingScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Attempts</span>
                  <span className="text-sm font-semibold text-gray-800">{quizAssessment.attempts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Time Limit</span>
                  <span className="text-sm font-semibold text-gray-800">{quizAssessment.timeLimit} mins</span>
                </div>
              </div>
              <button className="w-full py-2 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-sm font-semibold">
                Edit
              </button>
            </div>

            {/* Completion Rules Panel */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h2 className="text-[#3E0288] text-lg font-bold mb-4">Completion Rules</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700 mb-2">Completion Flow</p>
                  <p className="text-sm font-semibold text-gray-800">Watch Video → Complete Quiz → Next Topic</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Prerequisites</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm flex items-center justify-between bg-white"
                    >
                      <span className="text-gray-800">{completionRules.prerequisites}</span>
                      <FiChevronDown className="text-gray-400" size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">Lock Until Prerequisites Met</span>
                  <button
                    onClick={() => setCompletionRules({ ...completionRules, lockUntilPrerequisitesMet: !completionRules.lockUntilPrerequisitesMet })}
                    className={`relative w-12 h-6 rounded-full transition ${completionRules.lockUntilPrerequisitesMet ? 'bg-[#3E0288]' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${completionRules.lockUntilPrerequisitesMet ? 'translate-x-6' : ''}`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Add Quiz Panel */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#3E0288] text-lg font-bold">Add Quiz</h2>
                <button className="flex items-center gap-2 px-3 py-1 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-sm font-semibold">
                  <FiPlus size={14} />
                  more question
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Section Selector */}
                <div className="flex items-center gap-2">
                  <FiMoreVertical className="text-gray-400 cursor-move" size={18} />
                  <div className="relative flex-1">
                    <button
                      onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm flex items-center justify-between bg-white"
                    >
                      <span className={topicQuizData.section ? 'text-gray-800' : 'text-gray-400'}>
                        {topicQuizData.section || 'Select Section'}
                      </span>
                      <FiChevronDown className="text-gray-400" size={18} />
                    </button>
                  </div>
                  <button className="text-red-500 hover:opacity-80 transition">
                    <FiTrash2 size={18} />
                  </button>
                </div>

                {/* Question Input */}
                <div>
                  <input
                    type="text"
                    value={topicQuizData.question}
                    onChange={(e) => setTopicQuizData({ ...topicQuizData, question: e.target.value })}
                    placeholder="Enter Your Question"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  {topicQuizData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="topicCorrectAnswer"
                        checked={topicQuizData.correctAnswer === index}
                        onChange={() => setTopicQuizData({ ...topicQuizData, correctAnswer: index })}
                        className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288]"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...topicQuizData.options];
                          newOptions[index] = e.target.value;
                          setTopicQuizData({ ...topicQuizData, options: newOptions });
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                      />
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold">
                    Save Quiz
                  </button>
                  <button 
                    onClick={() => setShowTopicDetails(false)}
                    className="flex-1 py-2 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Visibility & Access Panel */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h2 className="text-[#3E0288] text-lg font-bold mb-4">Visibility & Access</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Audience</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm flex items-center justify-between bg-white"
                    >
                      <span className="text-gray-800">{visibilityData.audience}</span>
                      <FiChevronDown className="text-gray-400" size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Departments (if applicable)</label>
                  <div className="space-y-2">
                    {Object.keys(visibilityData.departments).map((dept) => (
                      <label key={dept} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={visibilityData.departments[dept]}
                          onChange={(e) => {
                            setVisibilityData({
                              ...visibilityData,
                              departments: {
                                ...visibilityData.departments,
                                [dept]: e.target.checked,
                              },
                            });
                          }}
                          className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288] rounded"
                        />
                        <span className="text-sm text-gray-700">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="px-6 pb-6">
          <div className="flex gap-3 max-w-2xl">
            <button className="flex-1 py-3 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold">
              Save Changes
            </button>
            <button 
              onClick={() => setShowTopicDetails(false)}
              className="flex-1 py-3 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-sm font-semibold"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white px-6 py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[#3E0288] text-3xl font-semibold mb-2" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              {t('content:title')}
            </h1>
            <p className="text-[#3E0288] text-base font-medium opacity-70" style={{ fontFamily: 'SF Compact Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              {t('content:subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <span className="text-sm font-semibold">Eng (US)</span>
              <span className="text-lg">🇺🇸</span>
              <FiChevronDown className="text-gray-400" size={14} />
            </div>
            {/* Profile Picture */}
            <div className="w-10 h-10 rounded-full bg-[#3E0288] flex items-center justify-center text-white font-semibold">
              U
            </div>
            {/* Add New Section Button */}
            <button 
              onClick={() => {
                closeAllModals();
                setShowAddSectionModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-semibold"
            >
              <FiPlus size={16} />
              {t('content:addNewSection')}
            </button>
          </div>
        </div>
            </div>

      {/* Global Action Buttons */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-4">
                    <button
            onClick={() => {
              closeAllModals();
              setShowDocumentModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold text-gray-700"
          >
            <FiFileText size={16} />
            Add Document
                      </button>
                      <button
            onClick={() => {
              closeAllModals();
              setShowVideoModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold text-gray-700"
          >
            <FiUpload size={16} />
            Upload Video
                      </button>
                    </div>
                  </div>

      {/* Main Content - Two Column Layout */}
      <div className="px-6 mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Training Sections */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h2 className="text-[#3E0288] text-lg font-bold mb-4">Training Section</h2>
          <div className="space-y-2">
            {trainingSections.map((section, index) => (
              <button
                key={index}
                onClick={() => setSelectedSection(section.name)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                  selectedSection === section.name
                    ? 'bg-purple-100 text-[#3E0288]'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">{section.name}</span>
                  <span className="text-xs text-gray-500">{section.topics} topics</span>
                </div>
                <FiChevronRight className="text-gray-400" size={18} />
              </button>
            ))}
            </div>
          </div>

        {/* Right Panel - Topics */}
        <div className="lg:col-span-2 bg-gray-50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#3E0288] text-lg font-bold">{selectedSection} Topics</h2>
            <button 
              onClick={() => {
                closeAllModals();
                setShowQuizModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold text-gray-700"
            >
              <FiPlus size={16} />
              Add Quiz
            </button>
            </div>

          {/* Topics Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Topic Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Video</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Quiz</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
              <tbody>
                {currentTopics.map((topic, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-white transition">
                    <td 
                      className="py-3 px-4 text-xs text-gray-700 font-medium cursor-pointer hover:text-[#3E0288]"
                      onClick={() => {
                        setSelectedTopic(topic);
                        setShowTopicDetails(true);
                      }}
                    >
                      {topic.name}
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTopicForAction(topic);
                          closeAllModals();
                          setShowManageVideoModal(true);
                        }}
                        className="text-[#3E0288] hover:opacity-80 transition"
                      >
                        <FiVideo size={18} />
                      </button>
                          </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTopicForAction(topic);
                          closeAllModals();
                          setShowEditQuizModal(true);
                        }}
                        className="text-blue-600 hover:opacity-80 transition"
                      >
                        <FiEdit2 size={18} />
                      </button>
                          </td>
                    <td className="py-3 px-4">
                      <button className="text-red-500 hover:opacity-80 transition">
                        <FiTrash2 size={18} />
                              </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Modal */}
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto"
          >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
              <div>
                  <h2 className="text-[#3E0288] text-2xl font-bold mb-1">Add Document</h2>
                  <p className="text-gray-600 text-sm">New Topic</p>
              </div>
              <button
                  onClick={() => setShowDocumentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                  <FiX size={24} />
              </button>
            </div>

              {/* Document Title */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">Document Title</label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="e.g, Employee Software Training"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Document Upload Area */}
              <div className="mb-6">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#3E0288] transition"
                >
                  <div className="flex flex-col items-center">
                    <FiUpload className="text-gray-400 mb-4" size={48} />
                    <p className="text-sm font-bold text-gray-800 mb-2">
                      Drag and drop your document here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Supported formats PDF, DOC, DOCX (Max 50MB)
                    </p>
                <button
                  type="button"
                      className="px-4 py-2 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-sm font-semibold"
                >
                      Browse Files
                </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {selectedFile && (
                      <p className="mt-3 text-sm text-gray-600">{selectedFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Button */}
                <button
                onClick={handleUploadDocument}
                className="w-full py-3 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-bold"
              >
                Upload Document
                </button>
              </div>
          </div>
      )}

      {/* Upload Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Modal */}
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto"
          >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
              <div>
                  <h2 className="text-[#3E0288] text-2xl font-bold mb-1">Upload Video</h2>
                  <p className="text-gray-600 text-sm">First Select the section then upload the video</p>
              </div>
              <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                  <FiX size={24} />
              </button>
            </div>

              {/* Select Section Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">Select Section</label>
                <div className="relative">
                  <button
                    onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm flex items-center justify-between bg-white"
                  >
                    <span className={selectedVideoSection ? 'text-gray-800' : 'text-gray-400'}>
                      {selectedVideoSection || 'Select a section'}
                    </span>
                    <FiChevronDown className="text-gray-400" size={18} />
                  </button>
                  {showSectionDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {trainingSections.map((section, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedVideoSection(section.name);
                            setShowSectionDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm text-gray-800"
                        >
                          {section.name}
                        </button>
                      ))}
              </div>
                  )}
              </div>
              </div>

              {/* Video Upload Area */}
              <div className="mb-6">
                <div
                  onDragOver={handleVideoDragOver}
                  onDrop={handleVideoDrop}
                  onClick={handleVideoBrowseClick}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#3E0288] transition"
                >
                  <div className="flex flex-col items-center">
                    <FiUpload className="text-gray-400 mb-4" size={48} />
                    <p className="text-sm font-bold text-gray-800 mb-2">
                      Drag and drop your videos here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Supported Formats: MP4, MOV, AVL, WebM (Max 500MB)
                    </p>
                <button
                  type="button"
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
                >
                      Browse Files
                </button>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept=".mp4,.mov,.avi,.webm"
                      onChange={handleVideoSelect}
                      className="hidden"
                    />
                    {selectedVideoFile && (
                      <p className="mt-3 text-sm text-gray-600">{selectedVideoFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Button */}
                <button
                onClick={handleUploadVideo}
                className="w-full py-3 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-bold"
              >
                Upload Video
                </button>
              </div>
          </div>
      )}

      {/* Add Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Modal */}
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto"
          >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[#3E0288] text-2xl font-bold mb-1">Add Quiz</h2>
                  <p className="text-gray-600 text-sm">{selectedSection}</p>
                </div>
                <button
                  onClick={() => setShowQuizModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition p-1"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Question Type and Add Question Button */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-semibold text-gray-700">Q1</span>
                <div className="relative flex-1">
                  <button
                    onClick={() => setShowQuestionTypeDropdown(!showQuestionTypeDropdown)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm flex items-center justify-between bg-white"
                  >
                    <span className="text-gray-800">{quizData.questionType}</span>
                    <FiChevronDown className="text-gray-400" size={18} />
                  </button>
                  {showQuestionTypeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <button
                        onClick={() => {
                          setQuizData({ ...quizData, questionType: 'Multiple Questions' });
                          setShowQuestionTypeDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm text-gray-800"
                      >
                        Multiple Questions
                      </button>
                    </div>
                  )}
                </div>
                <button className="p-2 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition">
                  <FiPlus size={20} />
                </button>
              </div>

              {/* Topic Name Input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={quizData.topicName}
                  onChange={(e) => setQuizData({ ...quizData, topicName: e.target.value })}
                  placeholder="Enter Your Topic Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Question Input */}
              <div className="mb-6">
                <input
                  type="text"
                  value={quizData.question}
                  onChange={(e) => setQuizData({ ...quizData, question: e.target.value })}
                  placeholder="Enter Your Question"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Multiple Choice Options */}
              <div className="mb-6 space-y-3">
                {quizData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={quizData.correctAnswer === index}
                      onChange={() => setQuizData({ ...quizData, correctAnswer: index })}
                      className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288]"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleQuizOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveQuiz}
                className="w-full py-3 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-bold"
              >
                Save
              </button>
            </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Modal */}
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto"
          >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[#3E0288] text-2xl font-bold mb-1">Add Section</h2>
                  <p className="text-gray-600 text-sm">Create a new onboarding section to organize topics, videos, and quizzes.</p>
                </div>
                <button
                  onClick={() => setShowAddSectionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition p-1"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Section Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Section Name</label>
                <input
                  type="text"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="e.g, Employee Benefit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Description Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">Description (optional)</label>
                <textarea
                  value={sectionDescription}
                  onChange={(e) => setSectionDescription(e.target.value)}
                  placeholder="Brief Description of this Training Section"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm resize-none"
                />
              </div>

              {/* Create Section Button */}
              <button
                onClick={handleCreateSection}
                className="w-full py-3 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-bold"
              >
                Create Section
              </button>
            </div>
        </div>
      )}

      {/* Manage Video Modal */}
      {showManageVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div 
            className="bg-white rounded-xl p-5 w-full max-w-lg mx-4 shadow-2xl pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-[#3E0288] text-xl font-bold mb-1">Manage Video</h2>
                <p className="text-gray-600 text-xs">Remove or Replace Video</p>
              </div>
              <button
                onClick={() => setShowManageVideoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Video Content Area */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-4">
                {/* Left Side - Video Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 border-2 border-[#3E0288] rounded-lg flex items-center justify-center">
                    <FiVideo className="text-[#3E0288]" size={32} />
                  </div>
                </div>

                {/* Right Side - Video Details */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-800 mb-1">Mission Statement.mp4</h3>
                  <p className="text-xs text-gray-500 mb-3">Current Video</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-xs font-semibold">
                      Replace Video
                    </button>
                    <button className="px-3 py-1.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition text-xs font-semibold">
                      Delete Video
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Changes Button */}
            <button
              onClick={() => setShowManageVideoModal(false)}
              className="w-full py-2.5 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-bold"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {showEditQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-[#3E0288] text-2xl font-bold mb-1">Edit Quiz</h2>
                <p className="text-gray-600 text-sm">Modify or add quiz content</p>
              </div>
              <button
                onClick={() => setShowEditQuizModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Edit Topic */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-800 mb-2">Edit Topic</label>
              <input
                type="text"
                defaultValue="Our company story"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
              />
            </div>

            {/* Question */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-800 mb-2">Question 1/5</label>
              <input
                type="text"
                defaultValue="What are the core values of the company?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
              />
            </div>

            {/* Answer Options */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-3">Answer Options</label>
              <div className="space-y-3">
                {/* Option 1 - Correct */}
                <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
                  <input
                    type="radio"
                    name="editQuizAnswer"
                    defaultChecked
                    className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288]"
                  />
                  <input
                    type="text"
                    defaultValue="Innovation, Integrity, Customer Focus"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white"
                  />
                  <span className="text-xs text-gray-500">(Correct)</span>
                </div>

                {/* Option 2 */}
                <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg">
                  <input
                    type="radio"
                    name="editQuizAnswer"
                    className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288]"
                  />
                  <input
                    type="text"
                    defaultValue="Profit, Growth, Market Share"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                </div>

                {/* Option 3 */}
                <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg">
                  <input
                    type="radio"
                    name="editQuizAnswer"
                    className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288]"
                  />
                  <input
                    type="text"
                    defaultValue="Speed, Scale, Efficiency"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Save Changes Button */}
            <button
              onClick={() => setShowEditQuizModal(false)}
              className="w-full py-3 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-bold"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
