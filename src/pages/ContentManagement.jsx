import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiChevronRight, FiVideo, FiEdit2, FiTrash2, FiChevronDown, FiFileText, FiUpload, FiX, FiArrowLeft, FiMoreVertical } from 'react-icons/fi';
import AdminAPI from '../services/api';

export default function ContentManagement() {
  const { t } = useTranslation(['content', 'common']);
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoSection, setSelectedVideoSection] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const videoInputRef = useRef(null);
  const contentVideoInputRef = useRef(null);
  
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [topicData, setTopicData] = useState({
    topicName: '',
    description: '',
    videoUrl: '',
    videoFile: null,
    subtitleUrl: '',
    videoDurationSeconds: '',
    allowSkip: false,
    hasQuiz: false,
    quiz: {
      quiz_instructions: '',
      quiz_type: 'mcq',
      quiz_time_limit: '',
      passing_required: false,
      passing_score: '',
      questions: [{
        question_text: '',
    options: ['', '', '', ''],
        correct_answer_index: null,
        correct_answer: '', // For theoretical questions
      }],
    },
  });
  const [showQuestionTypeDropdown, setShowQuestionTypeDropdown] = useState(false);
  const [createContentLoading, setCreateContentLoading] = useState(false);
  
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [trainingSections, setTrainingSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [showManageVideoModal, setShowManageVideoModal] = useState(false);
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);
  const [selectedTopicForAction, setSelectedTopicForAction] = useState(null);
  const [showReplaceVideo, setShowReplaceVideo] = useState(false);
  const [videoManagementData, setVideoManagementData] = useState({
    videoUrl: '',
    subtitleUrl: '',
    videoDurationSeconds: '',
    allowSkip: false,
    videoFile: null,
  });
  const [updatingVideo, setUpdatingVideo] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState(false);
  
  // Quiz edit data
  const [quizEditData, setQuizEditData] = useState({
    quiz_instructions: '',
    quiz_type: 'mcq',
    quiz_time_limit: '',
    passing_required: false,
    passing_score: '',
    questions: [],
  });
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [updatingQuiz, setUpdatingQuiz] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState(false);
  const [deletingSection, setDeletingSection] = useState(false);
  
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


  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);

  // Fetch sections, branches and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!AdminAPI.isAuthenticated()) {
        setSectionsLoading(false);
        return;
      }

      try {
        setSectionsLoading(true);
        const [sectionsResponse, branchesResponse, departmentsResponse] = await Promise.all([
          AdminAPI.getAllSections(),
          AdminAPI.getAllBranches(),
          AdminAPI.getAllDepartments(),
        ]);

        if (sectionsResponse.success && sectionsResponse.data) {
          setTrainingSections(sectionsResponse.data);
          // Set first section as selected if available
          if (sectionsResponse.data.length > 0 && !selectedSection) {
            setSelectedSection(sectionsResponse.data[0].section_title);
          }
        }

        if (branchesResponse.success && branchesResponse.data) {
          setBranches(branchesResponse.data);
        }

        if (departmentsResponse.success && departmentsResponse.data) {
          setDepartments(departmentsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load sections. Please refresh the page.");
      } finally {
        setSectionsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch topics for selected section
  const fetchTopics = useCallback(async (sectionId) => {
    if (!sectionId || !AdminAPI.isAuthenticated()) {
      setTopics([]);
      return;
    }

    try {
      setTopicsLoading(true);
      const response = await AdminAPI.getTopicsBySection(sectionId);
      if (response.success && response.data) {
        setTopics(response.data);
      } else {
        setTopics([]);
      }
    } catch (err) {
      console.error("Error fetching topics:", err);
      setTopics([]);
    } finally {
      setTopicsLoading(false);
    }
  }, []);

  // Fetch sections again after creating a new one
  const fetchSections = async () => {
    if (!AdminAPI.isAuthenticated()) {
      return;
    }

    try {
      const response = await AdminAPI.getAllSections();
      if (response.success && response.data) {
        setTrainingSections(response.data);
      }
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  // Fetch topics when section changes
  useEffect(() => {
    if (selectedSection) {
      const selectedSectionData = trainingSections.find(s => s.section_title === selectedSection);
      if (selectedSectionData) {
        fetchTopics(selectedSectionData.id);
      }
    } else {
      setTopics([]);
    }
  }, [selectedSection, trainingSections, fetchTopics]);

  // Filter departments based on selected branch
  const filteredDepartments = selectedBranch
    ? departments.filter((dept) => dept.branch_id === selectedBranch || dept.branch?.id === selectedBranch)
    : [];

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
    // Reset topic data when closing create content modal
    setTopicData({
      topicName: '',
      description: '',
      videoUrl: '',
      videoFile: null,
      subtitleUrl: '',
      videoDurationSeconds: '',
      allowSkip: false,
      hasQuiz: false,
      quiz: {
        quiz_instructions: '',
        quiz_type: 'mcq',
        quiz_time_limit: '',
        passing_required: false,
        passing_score: '',
        questions: [{
          question_text: '',
          options: ['', '', '', ''],
          correct_answer_index: null,
          correct_answer: '',
        }],
      },
    });
    setError(null);
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

  // Video file handlers for Create Content modal
  const handleVideoFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTopicData({ ...topicData, videoFile: file, videoUrl: '' });
    }
  };

  const handleVideoDragOverForContent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleVideoDropForContent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setTopicData({ ...topicData, videoFile: file, videoUrl: '' });
    }
  };

  const handleAddQuestion = () => {
    const quizType = topicData.quiz.quiz_type;
    let newQuestion;
    
    if (quizType === 'true_false') {
      newQuestion = {
        question_text: '',
        options: ['True', 'False'],
        correct_answer_index: null,
        correct_answer: '',
      };
    } else if (quizType === 'theoretical') {
      newQuestion = {
        question_text: '',
        options: [],
        correct_answer_index: null,
        correct_answer: '',
      };
    } else {
      // MCQ
      newQuestion = {
        question_text: '',
        options: ['', '', '', ''],
        correct_answer_index: null,
        correct_answer: '',
      };
    }

    setTopicData({
      ...topicData,
      quiz: {
        ...topicData.quiz,
        questions: [
          ...topicData.quiz.questions,
          newQuestion,
        ],
      },
    });
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...topicData.quiz.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    };
    setTopicData({
      ...topicData,
      quiz: {
        ...topicData.quiz,
        questions: updatedQuestions,
      },
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...topicData.quiz.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions,
    };
    setTopicData({
      ...topicData,
      quiz: {
        ...topicData.quiz,
        questions: updatedQuestions,
      },
    });
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...topicData.quiz.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correct_answer_index: optionIndex,
    };
    setTopicData({
      ...topicData,
      quiz: {
        ...topicData.quiz,
        questions: updatedQuestions,
      },
    });
  };

  const handleRemoveQuestion = (questionIndex) => {
    const updatedQuestions = topicData.quiz.questions.filter((_, index) => index !== questionIndex);
    setTopicData({
      ...topicData,
      quiz: {
        ...topicData.quiz,
        questions: updatedQuestions,
      },
    });
  };

  const handleCreateContent = async () => {
    // Validation
    if (!topicData.topicName.trim()) {
      setError("Topic name is required");
      return;
    }

    if (!selectedSection) {
      setError("Please select a section first");
      return;
    }

    // Find selected section ID
    const selectedSectionData = trainingSections.find(s => s.section_title === selectedSection);
    if (!selectedSectionData) {
      setError("Selected section not found");
      return;
    }

    // Validate video URL or file
    if (!topicData.videoUrl && !topicData.videoFile) {
      setError("Please provide either a video URL or upload a video file");
      return;
    }

    // Validate quiz if enabled
    if (topicData.hasQuiz) {
      // Validate quiz instructions
      if (!topicData.quiz.quiz_instructions || !topicData.quiz.quiz_instructions.trim()) {
        setError("Quiz instructions are required");
        return;
      }

      // Validate quiz type
      if (!topicData.quiz.quiz_type) {
        setError("Quiz type is required");
        return;
      }

      if (!topicData.quiz.questions || topicData.quiz.questions.length === 0) {
        setError("Please add at least one question to the quiz");
        return;
      }

      // Validate each question
      for (let i = 0; i < topicData.quiz.questions.length; i++) {
        const question = topicData.quiz.questions[i];
        if (!question.question_text.trim()) {
          setError(`Question ${i + 1} text is required`);
          return;
        }
        
        // Validate based on quiz type
        if (topicData.quiz.quiz_type === 'mcq') {
          // MCQ: validate options and correct answer index
          if (question.options.filter(opt => opt.trim()).length < 2) {
            setError(`Question ${i + 1} must have at least 2 options`);
            return;
          }
          if (question.correct_answer_index === null || question.correct_answer_index === undefined) {
            setError(`Question ${i + 1} must have a correct answer selected`);
            return;
          }
        } else if (topicData.quiz.quiz_type === 'true_false') {
          // True/False: validate correct answer index is selected
          if (question.correct_answer_index === null || question.correct_answer_index === undefined) {
            setError(`Question ${i + 1} must have a correct answer selected (True or False)`);
            return;
          }
        } else if (topicData.quiz.quiz_type === 'theoretical') {
          // Theoretical: validate correct answer text
          if (!question.correct_answer || !question.correct_answer.trim()) {
            setError(`Question ${i + 1} must have a correct answer provided`);
            return;
          }
        }
      }

      // Validate passing score if passing is required
      if (topicData.quiz.passing_required) {
        const passingScore = parseInt(topicData.quiz.passing_score);
        if (isNaN(passingScore) || passingScore < 0 || passingScore > 100) {
          setError("Passing score must be a number between 0 and 100");
          return;
        }
      }
    }

    try {
      setCreateContentLoading(true);
      setError(null);

      // For now, we'll use video URL. File upload can be handled separately later
      const videoUrl = topicData.videoUrl || (topicData.videoFile ? URL.createObjectURL(topicData.videoFile) : null);

      // Prepare quiz data if enabled
      const quizData = topicData.hasQuiz ? {
        quiz_instructions: topicData.quiz.quiz_instructions.trim(),
        quiz_type: topicData.quiz.quiz_type,
        quiz_time_limit: topicData.quiz.quiz_time_limit ? parseInt(topicData.quiz.quiz_time_limit) : null,
        passing_required: topicData.quiz.passing_required,
        passing_score: topicData.quiz.passing_required && topicData.quiz.passing_score ? parseInt(topicData.quiz.passing_score) : null,
        questions: topicData.quiz.questions.map(q => {
          let correctAnswer = '';
          
          if (topicData.quiz.quiz_type === 'theoretical') {
            // For theoretical, use the provided answer text
            correctAnswer = q.correct_answer ? q.correct_answer.trim() : '';
          } else if (topicData.quiz.quiz_type === 'true_false') {
            // For true/false, set to "True" or "False" based on index
            correctAnswer = q.correct_answer_index === 0 ? 'True' : q.correct_answer_index === 1 ? 'False' : '';
          } else {
            // For MCQ, use the text of the selected option
            const filteredOptions = q.options.filter(opt => opt.trim());
            if (q.correct_answer_index !== null && q.correct_answer_index !== undefined && filteredOptions[q.correct_answer_index]) {
              correctAnswer = filteredOptions[q.correct_answer_index].trim();
            }
          }

          return {
            question_text: q.question_text.trim(),
            question_type: topicData.quiz.quiz_type === 'mcq' ? "multiple_choice" : topicData.quiz.quiz_type === 'true_false' ? "true_false" : "short_answer",
            options: topicData.quiz.quiz_type === 'theoretical' ? [] : q.options.filter(opt => opt.trim()),
            correct_answer_index: topicData.quiz.quiz_type === 'theoretical' ? null : q.correct_answer_index,
            correct_answer: correctAnswer,
          };
        }),
      } : null;

      const response = await AdminAPI.createTopicWithQuiz(
        topicData.topicName.trim(),
        topicData.description.trim() || null,
        selectedSectionData.id,
        videoUrl,
        topicData.subtitleUrl.trim() || null,
        topicData.videoDurationSeconds ? parseInt(topicData.videoDurationSeconds) : null,
        topicData.allowSkip,
        quizData
      );

      if (response.success) {
    // Close modal and reset form
    setShowQuizModal(false);
        setTopicData({
      topicName: '',
          description: '',
          videoUrl: '',
          videoFile: null,
          subtitleUrl: '',
          videoDurationSeconds: '',
          allowSkip: false,
          hasQuiz: false,
          quiz: {
            quiz_instructions: '',
            quiz_type: 'mcq',
            quiz_time_limit: '',
            passing_required: false,
            passing_score: '',
            questions: [{
              question_text: '',
      options: ['', '', '', ''],
              correct_answer_index: null,
              correct_answer: '',
            }],
          },
        });
        setError(null);
        // Refresh topics list
        const selectedSectionData = trainingSections.find(s => s.section_title === selectedSection);
        if (selectedSectionData) {
          await fetchTopics(selectedSectionData.id);
        }
      } else {
        setError(response.message || "Failed to create content");
      }
    } catch (err) {
      setError(err.message || "Failed to create content");
    } finally {
      setCreateContentLoading(false);
    }
  };

  const handleCreateSection = async () => {
    // Validation
    if (!sectionName.trim()) {
      setError("Section name is required");
      return;
    }

    // Validate department belongs to selected branch
    if (selectedDepartment && selectedBranch) {
      const selectedDept = departments.find((dept) => dept.id === selectedDepartment);
      if (selectedDept) {
        const deptBranchId = selectedDept.branch_id || selectedDept.branch?.id;
        if (deptBranchId !== selectedBranch) {
          setError("Selected department does not belong to the selected branch. Please select a department that belongs to the chosen branch.");
          return;
        }
      }
    }

    try {
      setLoading(true);
      setError(null);
      const response = await AdminAPI.createSection(
        sectionName.trim(),
        sectionDescription.trim() || null,
        selectedBranch || null,
        selectedDepartment || null
      );

      if (response.success) {
    // Close modal and reset form
    setShowAddSectionModal(false);
    setSectionName('');
    setSectionDescription('');
        setSelectedBranch('');
        setSelectedDepartment('');
        setError(null);
        // Refresh sections list
        await fetchSections();
      } else {
        setError(response.message || "Failed to create section");
      }
    } catch (err) {
      setError(err.message || "Failed to create section");
    } finally {
      setLoading(false);
    }
  };

  // Handle opening video management modal
  const handleOpenVideoModal = (topic) => {
    setSelectedTopicForAction(topic);
    setVideoManagementData({
      videoUrl: '',
      subtitleUrl: '',
      videoDurationSeconds: '',
      allowSkip: topic.allow_skip || false,
      videoFile: null,
    });
    setShowReplaceVideo(false);
    setShowManageVideoModal(true);
  };

  // Handle replace video
  const handleReplaceVideo = () => {
    setShowReplaceVideo(true);
    setVideoManagementData({
      videoUrl: '',
      subtitleUrl: '',
      videoDurationSeconds: '',
      allowSkip: selectedTopicForAction?.allow_skip || false,
      videoFile: null,
    });
  };

  // Handle video file select for replacement
  const handleReplaceVideoFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoManagementData({ ...videoManagementData, videoFile: file, videoUrl: '' });
    }
  };

  // Handle video drag and drop for replacement
  const handleReplaceVideoDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleReplaceVideoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setVideoManagementData({ ...videoManagementData, videoFile: file, videoUrl: '' });
    }
  };

  // Handle update video
  const handleUpdateVideo = async () => {
    if (!selectedTopicForAction) return;

    if (!videoManagementData.videoUrl && !videoManagementData.videoFile) {
      setError("Please provide either a video URL or upload a video file");
      return;
    }

    try {
      setUpdatingVideo(true);
      setError(null);

      // For now, we'll use video URL. File upload will be handled via a separate upload endpoint later
      const videoUrl = videoManagementData.videoUrl || null;
      
      if (!videoUrl && videoManagementData.videoFile) {
        setError("Please provide a video URL. File upload functionality will be available soon.");
        setUpdatingVideo(false);
        return;
      }

      const response = await AdminAPI.updateTopicVideo(
        selectedTopicForAction.id,
        videoUrl,
        videoManagementData.subtitleUrl.trim() || null,
        videoManagementData.videoDurationSeconds ? parseInt(videoManagementData.videoDurationSeconds) : null,
        videoManagementData.allowSkip
      );

      if (response.success) {
        setShowManageVideoModal(false);
        setShowReplaceVideo(false);
        setSelectedTopicForAction(null);
        setVideoManagementData({
          videoUrl: '',
          subtitleUrl: '',
          videoDurationSeconds: '',
          allowSkip: false,
          videoFile: null,
        });
        setError(null);
        // Refresh topics
        const selectedSectionData = trainingSections.find(s => s.section_title === selectedSection);
        if (selectedSectionData) {
          await fetchTopics(selectedSectionData.id);
        }
      } else {
        setError(response.message || "Failed to update video");
      }
    } catch (err) {
      setError(err.message || "Failed to update video");
    } finally {
      setUpdatingVideo(false);
    }
  };

  // Handle delete video
  const handleDeleteVideo = async () => {
    if (!selectedTopicForAction) return;

    if (!window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingVideo(true);
      setError(null);

      const response = await AdminAPI.deleteTopicVideo(selectedTopicForAction.id);

      if (response.success) {
        setShowManageVideoModal(false);
        setShowReplaceVideo(false);
        setSelectedTopicForAction(null);
        setVideoManagementData({
          videoUrl: '',
          subtitleUrl: '',
          videoDurationSeconds: '',
          allowSkip: false,
          videoFile: null,
        });
        setError(null);
        // Refresh topics
        const selectedSectionData = trainingSections.find(s => s.section_title === selectedSection);
        if (selectedSectionData) {
          await fetchTopics(selectedSectionData.id);
        }
      } else {
        setError(response.message || "Failed to delete video");
      }
    } catch (err) {
      setError(err.message || "Failed to delete video");
    } finally {
      setDeletingVideo(false);
    }
  };

  // Handle opening quiz edit modal
  const handleOpenQuizModal = async (topic) => {
    try {
      setSelectedTopicForAction(topic);
      setLoadingQuiz(true);
      setError(null);
      setShowEditQuizModal(true); // Open modal immediately

      const response = await AdminAPI.getQuizByTopic(topic.id);
      if (response.success && response.data) {
        const quiz = response.data;
        // Format quiz data for editing with null checks
        const formattedQuestions = (quiz.questions || []).map((q) => {
          const options = q.options || [];
          const correctAnswerIndex = options.findIndex(opt => opt && opt.is_correct);
          return {
            id: q.id,
            question_text: q.question_text || '',
            question_type: q.question_type === 'multiple_choice' ? 'mcq' : q.question_type === 'short_answer' ? 'theoretical' : 'true_false',
            options: options.map(opt => opt ? (opt.option_text || '') : ''),
            correct_answer_index: correctAnswerIndex >= 0 ? correctAnswerIndex : null,
            correct_answer: q.correct_answer || '',
            question_points: q.question_points || 1,
          };
        });

        setQuizEditData({
          quiz_instructions: quiz.quiz_instructions || '',
          quiz_type: quiz.quiz_type || 'mcq',
          quiz_time_limit: quiz.quiz_time_limit || '',
          passing_required: quiz.passing_required || false,
          passing_score: quiz.passing_score || '',
          questions: formattedQuestions.length > 0 ? formattedQuestions : [{
            question_text: '',
            question_type: 'mcq',
            options: ['', '', '', ''],
            correct_answer_index: null,
            correct_answer: '',
            question_points: 1,
          }],
        });
      } else {
        setError(response.message || "Failed to fetch quiz data");
      }
    } catch (err) {
      console.error("Error opening quiz modal:", err);
      setError(err.message || "Failed to fetch quiz data");
    } finally {
      setLoadingQuiz(false);
    }
  };

  // Handle quiz question changes
  const handleQuizQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...(quizEditData?.questions || [])];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    };
    setQuizEditData({ 
      ...(quizEditData || {}), 
      questions: updatedQuestions 
    });
  };

  // Handle quiz option changes
  const handleQuizOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...(quizEditData?.questions || [])];
    const updatedOptions = [...(updatedQuestions[questionIndex]?.options || [])];
    updatedOptions[optionIndex] = value;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions,
    };
    setQuizEditData({ 
      ...(quizEditData || {}), 
      questions: updatedQuestions 
    });
  };

  // Handle quiz correct answer change
  const handleQuizCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...(quizEditData?.questions || [])];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correct_answer_index: optionIndex,
    };
    setQuizEditData({ 
      ...(quizEditData || {}), 
      questions: updatedQuestions 
    });
  };

  // Handle add quiz question
  const handleAddQuizQuestion = () => {
    const quizType = quizEditData?.quiz_type || 'mcq';
    let newQuestion;
    
    if (quizType === 'true_false') {
      newQuestion = {
        question_text: '',
        question_type: 'true_false',
        options: ['True', 'False'],
        correct_answer_index: null,
        correct_answer: '',
        question_points: 1,
      };
    } else if (quizType === 'theoretical') {
      newQuestion = {
        question_text: '',
        question_type: 'theoretical',
        options: [],
        correct_answer_index: null,
        correct_answer: '',
        question_points: 1,
      };
    } else {
      newQuestion = {
        question_text: '',
        question_type: 'mcq',
        options: ['', '', '', ''],
        correct_answer_index: null,
        correct_answer: '',
        question_points: 1,
      };
    }

    setQuizEditData({
      ...(quizEditData || {}),
      questions: [...(quizEditData?.questions || []), newQuestion],
    });
  };

  // Handle remove quiz question
  const handleRemoveQuizQuestion = (questionIndex) => {
    const updatedQuestions = (quizEditData?.questions || []).filter((_, index) => index !== questionIndex);
    setQuizEditData({ 
      ...(quizEditData || {}), 
      questions: updatedQuestions 
    });
  };

  // Handle update quiz
  const handleUpdateQuiz = async () => {
    if (!selectedTopicForAction) return;

    // Validation
    if (!quizEditData?.quiz_instructions?.trim()) {
      setError("Quiz instructions are required");
      return;
    }

    if (!quizEditData?.quiz_type) {
      setError("Quiz type is required");
      return;
    }

    const questions = quizEditData?.questions || [];
    if (questions.length === 0) {
      setError("At least one question is required");
      return;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text?.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }

      if (q.question_type === 'mcq' || q.question_type === 'multiple_choice') {
        if (!q.options || q.options.length < 2) {
          setError(`Question ${i + 1} must have at least 2 options`);
          return;
        }
        if (q.correct_answer_index === null || q.correct_answer_index === undefined) {
          setError(`Question ${i + 1} must have a correct answer selected`);
          return;
        }
      } else if (q.question_type === 'theoretical' || q.question_type === 'short_answer') {
        if (!q.correct_answer || !q.correct_answer.trim()) {
          setError(`Question ${i + 1} must have a correct answer`);
          return;
        }
      } else if (q.question_type === 'true_false') {
        if (q.correct_answer_index === null || q.correct_answer_index === undefined) {
          setError(`Question ${i + 1} must have a correct answer selected`);
          return;
        }
      }
    }

    setUpdatingQuiz(true);
    setError(null);

    try {
      // Format questions for API
      const formattedQuestions = questions.map((q) => {
        const questionData = {
          id: q.id || null, // Include ID if it's an existing question
          question_text: q.question_text.trim(),
          question_type: q.question_type === 'mcq' ? 'multiple_choice' : q.question_type === 'theoretical' ? 'short_answer' : 'true_false',
          question_points: q.question_points || 1,
          correct_answer_index: q.correct_answer_index,
          correct_answer: q.correct_answer || '',
        };

        if (q.question_type === 'mcq' || q.question_type === 'multiple_choice') {
          questionData.options = q.options.filter(opt => opt && opt.trim() !== '');
        } else if (q.question_type === 'true_false') {
          questionData.options = ['True', 'False'];
        }

        return questionData;
      });

      const response = await AdminAPI.updateQuizByTopic(selectedTopicForAction.id, {
        quiz_instructions: quizEditData.quiz_instructions.trim(),
        quiz_type: quizEditData.quiz_type,
        quiz_time_limit: quizEditData.quiz_time_limit ? parseInt(quizEditData.quiz_time_limit) : null,
        passing_required: quizEditData.passing_required || false,
        passing_score: quizEditData.passing_score ? parseInt(quizEditData.passing_score) : null,
        questions: formattedQuestions,
      });

      if (response.success) {
        // Refresh topics list
        if (selectedSection) {
          const selectedSectionData = trainingSections.find(s => s.section_title === selectedSection);
          if (selectedSectionData) {
            await fetchTopics(selectedSectionData.id);
          }
        }
        setShowEditQuizModal(false);
        setSelectedTopicForAction(null);
        setQuizEditData({
          quiz_instructions: '',
          quiz_type: 'mcq',
          quiz_time_limit: '',
          passing_required: false,
          passing_score: '',
          questions: [],
        });
        setError(null);
      } else {
        setError(response.message || "Failed to update quiz");
      }
    } catch (err) {
      console.error("Error updating quiz:", err);
      setError(err.message || "Failed to update quiz");
    } finally {
      setUpdatingQuiz(false);
    }
  };

  // Handle delete topic
  const handleDeleteTopic = async (topic) => {
    if (!window.confirm(`Are you sure you want to delete "${topic.topic_title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingTopic(true);
    setError(null);

    try {
      const response = await AdminAPI.deleteTopic(topic.id);
      if (response.success) {
        // Refresh topics list
        if (selectedSection) {
          const selectedSectionData = trainingSections.find(s => s.section_title === selectedSection);
          if (selectedSectionData) {
            await fetchTopics(selectedSectionData.id);
          }
        }
      } else {
        setError(response.message || "Failed to delete topic");
      }
    } catch (err) {
      console.error("Error deleting topic:", err);
      setError(err.message || "Failed to delete topic");
    } finally {
      setDeletingTopic(false);
    }
  };

  // Handle delete section
  const handleDeleteSection = async (section) => {
    if (!window.confirm(`Are you sure you want to delete "${section.section_title}"? This will also delete all topics in this section. This action cannot be undone.`)) {
      return;
    }

    setDeletingSection(true);
    setError(null);

    try {
      const response = await AdminAPI.deleteSection(section.id);
      if (response.success) {
        // Refresh sections list
        await fetchSections();
        // If the deleted section was selected, clear selection
        if (selectedSection === section.section_title) {
          setSelectedSection(null);
          setTopics([]);
        }
      } else {
        setError(response.message || "Failed to delete section");
      }
    } catch (err) {
      console.error("Error deleting section:", err);
      setError(err.message || "Failed to delete section");
    } finally {
      setDeletingSection(false);
    }
  };

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
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-[#3E0288] flex items-center justify-center text-white font-semibold hover:opacity-90 transition cursor-pointer"
              title="View Profile"
            >
              U
            </button>
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

      

      {/* Main Content - Two Column Layout */}
      <div className="px-6 mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Training Sections */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h2 className="text-[#3E0288] text-lg font-bold mb-4">Training Section</h2>
          {sectionsLoading ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Loading sections...</p>
            </div>
          ) : trainingSections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No sections found. Create your first section!</p>
            </div>
          ) : (
          <div className="space-y-2">
              {trainingSections.map((section) => (
                <div
                  key={section.id}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                    selectedSection === section.section_title
                    ? 'bg-purple-100 text-[#3E0288]'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                >
                  <button
                    onClick={() => setSelectedSection(section.section_title)}
                    className="flex-1 flex items-center justify-between text-left"
              >
                <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold">{section.section_title}</span>
                      <span className="text-xs text-gray-500">{section.topics || 0} topics</span>
                </div>
                <FiChevronRight className="text-gray-400" size={18} />
              </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section);
                    }}
                    disabled={deletingSection}
                    className="ml-2 text-red-500 hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed p-1"
                    title="Delete Section"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
            ))}
            </div>
          )}
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
              Create Content
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
                {topicsLoading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                      Loading topics...
                    </td>
                  </tr>
                ) : topics.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                      No topics found. Click "Create Content" to add a new topic.
                    </td>
                  </tr>
                ) : (
                  topics.map((topic) => (
                    <tr key={topic.id} className="border-b border-gray-100 hover:bg-white transition">
                      <td className="py-3 px-4 text-xs text-gray-700 font-medium">
                        {topic.topic_title}
                    </td>
                    <td className="py-3 px-4">
                        {topic.video_url ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                              // Close other modals but not the video modal we're about to open
                              setShowDocumentModal(false);
                              setShowVideoModal(false);
                              setShowQuizModal(false);
                              setShowAddSectionModal(false);
                              setShowEditQuizModal(false);
                              setShowSectionDropdown(false);
                              setShowQuestionTypeDropdown(false);
                              // Now open the video modal
                              handleOpenVideoModal(topic);
                        }}
                        className="text-[#3E0288] hover:opacity-80 transition"
                            title="Manage Video"
                      >
                        <FiVideo size={18} />
                      </button>
                        ) : (
                          <span className="text-gray-400" title="No video">-</span>
                        )}
                          </td>
                    <td className="py-3 px-4">
                        {topic.has_quiz ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                              // Close other modals but not the quiz modal we're about to open
                              setShowDocumentModal(false);
                              setShowVideoModal(false);
                              setShowQuizModal(false);
                              setShowAddSectionModal(false);
                              setShowManageVideoModal(false);
                              setShowSectionDropdown(false);
                              setShowQuestionTypeDropdown(false);
                              // Now open the quiz modal and fetch data
                              handleOpenQuizModal(topic);
                        }}
                        className="text-blue-600 hover:opacity-80 transition"
                            title="Edit Quiz"
                      >
                        <FiEdit2 size={18} />
                      </button>
                        ) : (
                          <span className="text-gray-400" title="No quiz">-</span>
                        )}
                          </td>
                    <td className="py-3 px-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTopic(topic);
                          }}
                          disabled={deletingTopic}
                          className="text-red-500 hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Topic"
                        >
                        <FiTrash2 size={18} />
                              </button>
                          </td>
                        </tr>
                  ))
                )}
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
                      {trainingSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => {
                            setSelectedVideoSection(section.section_title);
                            setShowSectionDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm text-gray-800"
                        >
                          {section.section_title}
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

      {/* Create Content Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Modal */}
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto"
          >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[#3E0288] text-2xl font-bold mb-1">Create Content</h2>
                  <p className="text-gray-600 text-sm">Section: {selectedSection || 'Not selected'}</p>
                </div>
                <button
                  onClick={() => {
                    setShowQuizModal(false);
                    setTopicData({
                      topicName: '',
                      description: '',
                      videoUrl: '',
                      videoFile: null,
                      subtitleUrl: '',
                      videoDurationSeconds: '',
                      allowSkip: false,
                      hasQuiz: false,
                      quiz: {
                        quiz_instructions: '',
                        quiz_type: 'mcq',
                        quiz_time_limit: '',
                        passing_required: false,
                        passing_score: '',
                        questions: [{
                          question_text: '',
                          options: ['', '', '', ''],
                          correct_answer_index: null,
                          correct_answer: '',
                        }],
                      },
                    });
                    setError(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition p-1"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Topic Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Topic Name *</label>
                <input
                  type="text"
                  value={topicData.topicName}
                  onChange={(e) => setTopicData({ ...topicData, topicName: e.target.value })}
                  placeholder="Enter topic name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Description Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
                <textarea
                  value={topicData.description}
                  onChange={(e) => setTopicData({ ...topicData, description: e.target.value })}
                  placeholder="Enter topic description (optional)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm resize-none"
                />
              </div>

              {/* Video URL or Upload */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Video *</label>
                <div className="space-y-3">
                  {/* Video URL Input */}
                  <input
                    type="url"
                    value={topicData.videoUrl}
                    onChange={(e) => {
                      setTopicData({ ...topicData, videoUrl: e.target.value, videoFile: null });
                      setError(null);
                    }}
                    placeholder="Enter video URL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                  
                  {/* Or Divider */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="text-xs text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Video Upload Area */}
                  <div
                    onDragOver={handleVideoDragOverForContent}
                    onDrop={handleVideoDropForContent}
                    onClick={() => contentVideoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#3E0288] transition"
                  >
                    <div className="flex flex-col items-center">
                      <FiUpload className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Drag and drop video here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Supported formats: MP4, MOV, AVI, WebM (Max 500MB)
                      </p>
                      <input
                        ref={contentVideoInputRef}
                        type="file"
                        accept=".mp4,.mov,.avi,.webm"
                        onChange={handleVideoFileSelect}
                        className="hidden"
                      />
                      {topicData.videoFile && (
                        <p className="mt-2 text-sm text-gray-600 font-medium">{topicData.videoFile.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtitle URL */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Subtitle URL (optional)</label>
                <input
                  type="url"
                  value={topicData.subtitleUrl}
                  onChange={(e) => setTopicData({ ...topicData, subtitleUrl: e.target.value })}
                  placeholder="Enter subtitle file URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Video Duration */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Video Duration (seconds)</label>
                <input
                  type="number"
                  min="0"
                  value={topicData.videoDurationSeconds}
                  onChange={(e) => setTopicData({ ...topicData, videoDurationSeconds: e.target.value })}
                  placeholder="Enter video duration in seconds (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

              {/* Allow Skip */}
              <div className="mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={topicData.allowSkip}
                    onChange={(e) => setTopicData({ ...topicData, allowSkip: e.target.checked })}
                    className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288] rounded"
                  />
                  <span className="text-sm font-semibold text-gray-800">Allow Skip Video</span>
                </label>
              </div>

              {/* Add Quiz Toggle */}
              <div className="mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={topicData.hasQuiz}
                    onChange={(e) => setTopicData({ ...topicData, hasQuiz: e.target.checked })}
                    className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288] rounded"
                  />
                  <span className="text-sm font-semibold text-gray-800">Add Quiz</span>
                </label>
              </div>

              {/* Quiz Section */}
              {topicData.hasQuiz && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  {/* Quiz Instructions */}
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Quiz Instructions *</label>
                    <textarea
                      value={topicData.quiz.quiz_instructions}
                      onChange={(e) => setTopicData({
                        ...topicData,
                        quiz: { ...topicData.quiz, quiz_instructions: e.target.value }
                      })}
                      placeholder="Enter quiz instructions"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm resize-none"
                    />
                  </div>

                  {/* Quiz Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Quiz Type *</label>
                    <select
                      value={topicData.quiz.quiz_type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        // Reset questions when type changes
                        let initialQuestion;
                        if (newType === 'true_false') {
                          initialQuestion = {
                            question_text: '',
                            options: ['True', 'False'],
                            correct_answer_index: null,
                            correct_answer: '',
                          };
                        } else if (newType === 'theoretical') {
                          initialQuestion = {
                            question_text: '',
                            options: [],
                            correct_answer_index: null,
                            correct_answer: '',
                          };
                        } else {
                          initialQuestion = {
                            question_text: '',
                            options: ['', '', '', ''],
                            correct_answer_index: null,
                            correct_answer: '',
                          };
                        }
                        setTopicData({
                          ...topicData,
                          quiz: { 
                            ...topicData.quiz, 
                            quiz_type: newType,
                            questions: [initialQuestion]
                          }
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer"
                    >
                      <option value="mcq">MCQ (Multiple Choice Questions)</option>
                      <option value="true_false">True/False</option>
                      <option value="theoretical">Theoretical</option>
                    </select>
                    </div>

                  {/* Quiz Time Limit */}
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Quiz Time Limit (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      value={topicData.quiz.quiz_time_limit}
                      onChange={(e) => setTopicData({
                        ...topicData,
                        quiz: { ...topicData.quiz, quiz_time_limit: e.target.value }
                      })}
                      placeholder="Enter time limit in minutes (optional)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                    />
                </div>

                  {/* Passing Required */}
                  <div className="mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={topicData.quiz.passing_required}
                        onChange={(e) => setTopicData({
                          ...topicData,
                          quiz: { ...topicData.quiz, passing_required: e.target.checked }
                        })}
                        className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288] rounded"
                      />
                      <span className="text-sm font-semibold text-gray-800">Passing Required</span>
                    </label>
              </div>

                  {/* Passing Score */}
                  {topicData.quiz.passing_required && (
              <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-800 mb-2">Passing Score (%)</label>
                <input
                        type="number"
                        min="0"
                        max="100"
                        value={topicData.quiz.passing_score}
                        onChange={(e) => setTopicData({
                          ...topicData,
                          quiz: { ...topicData.quiz, passing_score: e.target.value }
                        })}
                        placeholder="Enter passing score percentage (0-100)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800">Quiz Questions</h3>
                    <button
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2 px-3 py-1.5 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-sm font-semibold"
                    >
                      <FiPlus size={16} />
                      Add Question
                    </button>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    {topicData.quiz.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-700">Question {questionIndex + 1}</span>
                          {topicData.quiz.questions.length > 1 && (
                            <button
                              onClick={() => handleRemoveQuestion(questionIndex)}
                              className="text-red-500 hover:text-red-700 transition text-sm"
                            >
                              <FiX size={18} />
                            </button>
                          )}
                        </div>

                        {/* Question Text */}
                        <div className="mb-3">
                <input
                  type="text"
                            value={question.question_text}
                            onChange={(e) => handleQuestionChange(questionIndex, 'question_text', e.target.value)}
                            placeholder="Enter question text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                />
              </div>

                        {/* Options - Different UI based on quiz type */}
                        {topicData.quiz.quiz_type === 'theoretical' ? (
                          /* Theoretical - Show answer textarea */
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Correct Answer:</label>
                            <textarea
                              value={question.correct_answer || ''}
                              onChange={(e) => handleQuestionChange(questionIndex, 'correct_answer', e.target.value)}
                              placeholder="Enter the correct answer"
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm resize-none"
                            />
                          </div>
                        ) : topicData.quiz.quiz_type === 'true_false' ? (
                          /* True/False - Show True/False radio buttons */
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Select Correct Answer:</label>
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                                    name={`correctAnswer-${questionIndex}`}
                                    checked={question.correct_answer_index === optionIndex}
                                    onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                                    className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288]"
                                  />
                                  <span className="text-sm font-medium text-gray-700">{option}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* MCQ - Show editable options */
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Options:</label>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correctAnswer-${questionIndex}`}
                                  checked={question.correct_answer_index === optionIndex}
                                  onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                      className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288]"
                    />
                    <input
                      type="text"
                      value={option}
                                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                    />
                  </div>
                ))}
              </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Create Button */}
              <button
                onClick={handleCreateContent}
                disabled={createContentLoading}
                className="w-full py-3 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createContentLoading ? "Creating..." : "Create Content"}
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
                  onClick={() => {
                    setShowAddSectionModal(false);
                    setSectionName('');
                    setSectionDescription('');
                    setSelectedBranch('');
                    setSelectedDepartment('');
                    setError(null);
                  }}
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
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Description (optional)</label>
                <textarea
                  value={sectionDescription}
                  onChange={(e) => setSectionDescription(e.target.value)}
                  placeholder="Brief Description of this Training Section"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm resize-none"
                />
              </div>

              {/* Branch Selection */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Branch Name</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => {
                    setSelectedBranch(e.target.value);
                    setSelectedDepartment(''); // Reset department when branch changes
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer"
                >
                  <option value="">Select a branch (optional)</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">Department Name</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm bg-white cursor-pointer"
                  disabled={!selectedBranch}
                >
                  <option value="">
                    {selectedBranch ? "Select a department (optional)" : "Select a branch first"}
                  </option>
                  {selectedBranch
                    ? filteredDepartments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))
                    : null}
                </select>
                {selectedBranch && filteredDepartments.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">No departments available for this branch</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Create Section Button */}
              <button
                onClick={handleCreateSection}
                disabled={loading}
                className="w-full py-3 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Section"}
              </button>
            </div>
        </div>
      )}

      {/* Manage Video Modal */}
      {showManageVideoModal && selectedTopicForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-[#3E0288] text-2xl font-bold mb-1">Manage Video</h2>
                <p className="text-gray-600 text-sm">Topic: {selectedTopicForAction.topic_title}</p>
              </div>
              <button
                onClick={() => {
                  setShowManageVideoModal(false);
                  setShowReplaceVideo(false);
                  setSelectedTopicForAction(null);
                  setVideoManagementData({
                    videoUrl: '',
                    subtitleUrl: '',
                    videoDurationSeconds: '',
                    allowSkip: false,
                    videoFile: null,
                  });
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Current Video Display */}
            {!showReplaceVideo && selectedTopicForAction.video_url && (
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
                    <h3 className="text-base font-bold text-gray-800 mb-1">
                      {selectedTopicForAction.video_url.split('/').pop() || 'Current Video'}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 break-all">{selectedTopicForAction.video_url}</p>
                  <div className="flex gap-2">
                      <button 
                        onClick={handleReplaceVideo}
                        className="px-3 py-1.5 border border-[#3E0288] text-[#3E0288] rounded-lg hover:bg-purple-50 transition text-xs font-semibold"
                      >
                      Replace Video
                    </button>
                      <button 
                        onClick={handleDeleteVideo}
                        disabled={deletingVideo}
                        className="px-3 py-1.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingVideo ? 'Deleting...' : 'Delete Video'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Replace Video Form */}
            {showReplaceVideo && (
              <>
                {/* Video URL or Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-800 mb-2">New Video *</label>
                  <div className="space-y-3">
                    {/* Video URL Input */}
                    <input
                      type="url"
                      value={videoManagementData.videoUrl}
                      onChange={(e) => {
                        setVideoManagementData({ ...videoManagementData, videoUrl: e.target.value, videoFile: null });
                        setError(null);
                      }}
                      placeholder="Enter video URL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                    />
                    
                    {/* Or Divider */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="text-xs text-gray-500">OR</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Video Upload Area */}
                    <div
                      onDragOver={handleReplaceVideoDragOver}
                      onDrop={handleReplaceVideoDrop}
                      onClick={() => contentVideoInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#3E0288] transition"
                    >
                      <div className="flex flex-col items-center">
                        <FiUpload className="text-gray-400 mb-2" size={32} />
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                          Drag and drop video here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          Supported formats: MP4, MOV, AVI, WebM (Max 500MB)
                        </p>
                        <input
                          ref={contentVideoInputRef}
                          type="file"
                          accept=".mp4,.mov,.avi,.webm"
                          onChange={handleReplaceVideoFileSelect}
                          className="hidden"
                        />
                        {videoManagementData.videoFile && (
                          <p className="mt-2 text-sm text-gray-600 font-medium">{videoManagementData.videoFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtitle URL */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-800 mb-2">Subtitle URL (optional)</label>
                  <input
                    type="url"
                    value={videoManagementData.subtitleUrl}
                    onChange={(e) => setVideoManagementData({ ...videoManagementData, subtitleUrl: e.target.value })}
                    placeholder="Enter subtitle file URL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                </div>

                {/* Video Duration */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-800 mb-2">Video Duration (seconds)</label>
                  <input
                    type="number"
                    min="0"
                    value={videoManagementData.videoDurationSeconds}
                    onChange={(e) => setVideoManagementData({ ...videoManagementData, videoDurationSeconds: e.target.value })}
                    placeholder="Enter video duration in seconds (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                </div>

                {/* Allow Skip */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={videoManagementData.allowSkip}
                      onChange={(e) => setVideoManagementData({ ...videoManagementData, allowSkip: e.target.checked })}
                      className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288] rounded"
                    />
                    <span className="text-sm font-semibold text-gray-800">Allow Skip Video</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
            <button
                    onClick={handleUpdateVideo}
                    disabled={updatingVideo || deletingVideo}
                    className="flex-1 py-3 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingVideo ? 'Updating...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setShowReplaceVideo(false);
                      setVideoManagementData({
                        videoUrl: '',
                        subtitleUrl: '',
                        videoDurationSeconds: '',
                        allowSkip: selectedTopicForAction?.allow_skip || false,
                        videoFile: null,
                      });
                      setError(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
                  >
                    Cancel
            </button>
                </div>
              </>
            )}

            {/* Close button when not replacing */}
            {!showReplaceVideo && (
              <button
                onClick={() => {
                  setShowManageVideoModal(false);
                  setShowReplaceVideo(false);
                  setSelectedTopicForAction(null);
                  setVideoManagementData({
                    videoUrl: '',
                    subtitleUrl: '',
                    videoDurationSeconds: '',
                    allowSkip: false,
                    videoFile: null,
                  });
                  setError(null);
                }}
                className="w-full py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-bold"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {showEditQuizModal && selectedTopicForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-[#3E0288] text-2xl font-bold mb-1">Edit Quiz</h2>
                <p className="text-gray-600 text-sm">Topic: {selectedTopicForAction.topic_title}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditQuizModal(false);
                  setSelectedTopicForAction(null);
                  setQuizEditData({
                    quiz_instructions: '',
                    quiz_type: 'mcq',
                    quiz_time_limit: '',
                    passing_required: false,
                    passing_score: '',
                    questions: [],
                  });
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loadingQuiz ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading quiz data...</p>
              </div>
            ) : (
              <>
                {/* Quiz Instructions */}
            <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-800 mb-2">Quiz Instructions *</label>
              <input
                type="text"
                    value={quizEditData?.quiz_instructions || ''}
                    onChange={(e) => setQuizEditData({ ...(quizEditData || {}), quiz_instructions: e.target.value })}
                    placeholder="Enter quiz instructions"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
              />
            </div>

                {/* Quiz Type */}
            <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-800 mb-2">Quiz Type *</label>
                  <select
                    value={quizEditData?.quiz_type || 'mcq'}
                    onChange={(e) => {
                      const newType = e.target.value;
                      // Update all questions to match the new quiz type
                      const updatedQuestions = (quizEditData?.questions || []).map(q => {
                        if (newType === 'true_false') {
                          return {
                            ...q,
                            question_type: 'true_false',
                            options: ['True', 'False'],
                            correct_answer_index: null,
                            correct_answer: '',
                          };
                        } else if (newType === 'theoretical') {
                          return {
                            ...q,
                            question_type: 'theoretical',
                            options: [],
                            correct_answer_index: null,
                            correct_answer: q.correct_answer || '',
                          };
                        } else {
                          return {
                            ...q,
                            question_type: 'mcq',
                            options: q.options && q.options.length > 0 ? q.options : ['', '', '', ''],
                            correct_answer_index: null,
                            correct_answer: '',
                          };
                        }
                      });
                      setQuizEditData({ 
                        ...quizEditData, 
                        quiz_type: newType, 
                        questions: updatedQuestions,
                        quiz_instructions: quizEditData?.quiz_instructions || '',
                        quiz_time_limit: quizEditData?.quiz_time_limit || '',
                        passing_required: quizEditData?.passing_required || false,
                        passing_score: quizEditData?.passing_score || '',
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="true_false">True/False</option>
                    <option value="theoretical">Theoretical</option>
                  </select>
                </div>

                {/* Quiz Time Limit */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-800 mb-2">Quiz Time Limit (minutes)</label>
              <input
                    type="number"
                    min="1"
                    value={quizEditData?.quiz_time_limit || ''}
                    onChange={(e) => setQuizEditData({ ...(quizEditData || {}), quiz_time_limit: e.target.value })}
                    placeholder="Enter time limit in minutes (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
              />
            </div>

                {/* Passing Required */}
                <div className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quizEditData?.passing_required || false}
                      onChange={(e) => setQuizEditData({ ...(quizEditData || {}), passing_required: e.target.checked })}
                      className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288] rounded"
                    />
                    <span className="text-sm font-semibold text-gray-800">Passing Required</span>
                  </label>
                </div>

                {/* Passing Score */}
                {(quizEditData?.passing_required || false) && (
            <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Passing Score (%)</label>
                  <input
                      type="number"
                      min="0"
                      max="100"
                      value={quizEditData?.passing_score || ''}
                      onChange={(e) => setQuizEditData({ ...(quizEditData || {}), passing_score: e.target.value })}
                      placeholder="Enter passing score (0-100)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                    />
                  </div>
                )}

                {/* Questions */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-gray-800">Questions</label>
                    <button
                      onClick={handleAddQuizQuestion}
                      className="px-3 py-1.5 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-xs font-semibold flex items-center gap-2"
                    >
                      <FiPlus size={14} />
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-6">
                    {(quizEditData.questions || []).map((question, questionIndex) => (
                      <div key={questionIndex} className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-800">Question {questionIndex + 1}</h4>
                          {(quizEditData.questions || []).length > 1 && (
                            <button
                              onClick={() => handleRemoveQuizQuestion(questionIndex)}
                              className="text-red-600 hover:text-red-800 transition"
                              title="Remove Question"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>

                        {/* Question Text */}
                        <div className="mb-4">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Question Text *</label>
                  <input
                    type="text"
                            value={question.question_text}
                            onChange={(e) => handleQuizQuestionChange(questionIndex, 'question_text', e.target.value)}
                            placeholder="Enter question text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                          />
                </div>

                        {/* Options for MCQ */}
                        {(question.question_type === 'mcq' || question.question_type === 'multiple_choice') && (
                          <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Answer Options *</label>
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-3">
                  <input
                    type="radio"
                                    name={`quiz-question-${questionIndex}`}
                                    checked={question.correct_answer_index === optionIndex}
                                    onChange={() => handleQuizCorrectAnswerChange(questionIndex, optionIndex)}
                    className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288]"
                  />
                  <input
                    type="text"
                                    value={option}
                                    onChange={(e) => handleQuizOptionChange(questionIndex, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                                  />
                                  {question.correct_answer_index === optionIndex && (
                                    <span className="text-xs text-green-600 font-semibold">(Correct)</span>
                                  )}
                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Options for True/False */}
                        {question.question_type === 'true_false' && (
                          <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Select Correct Answer *</label>
                            <div className="space-y-2">
                              {['True', 'False'].map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-3">
                  <input
                    type="radio"
                                    name={`quiz-question-${questionIndex}`}
                                    checked={question.correct_answer_index === optionIndex}
                                    onChange={() => handleQuizCorrectAnswerChange(questionIndex, optionIndex)}
                    className="w-4 h-4 text-[#3E0288] focus:ring-[#3E0288]"
                  />
                                  <span className="text-sm text-gray-800">{option}</span>
                                  {question.correct_answer_index === optionIndex && (
                                    <span className="text-xs text-green-600 font-semibold">(Correct)</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Correct Answer for Theoretical */}
                        {question.question_type === 'theoretical' && (
                          <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Correct Answer *</label>
                            <textarea
                              value={question.correct_answer}
                              onChange={(e) => handleQuizQuestionChange(questionIndex, 'correct_answer', e.target.value)}
                              placeholder="Enter the correct answer"
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E0288] text-sm"
                  />
                </div>
                        )}
                      </div>
                    ))}
              </div>
            </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
            <button
                    onClick={handleUpdateQuiz}
                    disabled={updatingQuiz || loadingQuiz}
                    className="flex-1 py-3 bg-[#3E0288] text-white rounded-lg hover:opacity-90 transition text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingQuiz ? 'Updating...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setShowEditQuizModal(false);
                      setSelectedTopicForAction(null);
                      setQuizEditData({
                        quiz_instructions: '',
                        quiz_type: 'mcq',
                        quiz_time_limit: '',
                        passing_required: false,
                        passing_score: '',
                        questions: [],
                      });
                      setError(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
                  >
                    Cancel
            </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
