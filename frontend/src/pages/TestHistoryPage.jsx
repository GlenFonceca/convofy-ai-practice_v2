import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Filter,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { getTestHistory } from "../lib/api";

const TestHistoryPage = () => {
  const queryClient = useQueryClient();

  const [expandedTest, setExpandedTest] = useState(null);
  const [filterGrade, setFilterGrade] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: testHistory,isLoading,error,} = useQuery({
    queryKey: ["testhistory"],
    queryFn: getTestHistory,
  });

  // Helper function to get grade based on score
  const getGrade = (score) => {
    if (score >= 90) return "Outstanding";
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Below Average";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "badge-error";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-info";
    if (score >= 70) return "text-warning";
    return "text-error";
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-success/20 border-success/30";
    if (score >= 80) return "bg-info/20 border-info/30";
    if (score >= 70) return "bg-warning/20 border-warning/30";
    return "bg-error/20 border-error/30";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleTestClick = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-xl font-bold text-error mb-2">
              Error loading test history
            </div>
            <p className="text-base-content/50">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!testHistory || testHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-base-content/70 mb-2">
              No tests found
            </h3>
            <p className="text-base-content/50">
              Take your first speech test to see results here
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Transform data to match component expectations
  const transformedTests = testHistory.map((test) => ({
    id: test._id,
    topic: test.topic,
    date: test.createdAt,
    time: formatTime(test.createdAt),
    duration: formatDuration(test.durationInSeconds),
    overallScore: test.evaluation.overall_score,
    grade: getGrade(test.evaluation.overall_score),
    gradeColor: getScoreColor(test.evaluation.overall_score),
    metrics: [
      {
        label: "Fluency",
        score: test.evaluation.fluency,
        color:
          test.evaluation.fluency >= 70
            ? "progress-success"
            : test.evaluation.fluency >= 50
            ? "progress-warning"
            : "progress-error",
      },
      {
        label: "Grammar",
        score: test.evaluation.grammar,
        color:
          test.evaluation.grammar >= 70
            ? "progress-success"
            : test.evaluation.grammar >= 50
            ? "progress-warning"
            : "progress-error",
      },
      {
        label: "Vocabulary",
        score: test.evaluation.vocabulary,
        color:
          test.evaluation.vocabulary >= 70
            ? "progress-success"
            : test.evaluation.vocabulary >= 50
            ? "progress-warning"
            : "progress-error",
      },
      {
        label: "Pronunciation",
        score: test.evaluation.pronunciation,
        color:
          test.evaluation.pronunciation >= 70
            ? "progress-success"
            : test.evaluation.pronunciation >= 50
            ? "progress-warning"
            : "progress-error",
      },
    ],
    suggestions: test.evaluation.suggestions.map((suggestion) => ({
      text: suggestion,
    })),
    transcript: test.transcript,
  }));

  // Filter and search functionality
  const filteredTests = transformedTests.filter((test) => {
    const matchesGrade =
      filterGrade === "all" ||
      test.grade.toLowerCase().includes(filterGrade.toLowerCase());
    const matchesSearch = test.topic
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const averageScore =
    transformedTests.length > 0
      ? Math.round(
          transformedTests.reduce((sum, test) => sum + test.overallScore, 0) /
            transformedTests.length
        )
      : 0;

  // Prepare data for the progress chart
  const chartData = transformedTests
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((test, index) => ({
      testNumber: index + 1,
      score: test.overallScore,
      date: test.date,
      topic:
        test.topic.length > 20
          ? test.topic.substring(0, 20) + "..."
          : test.topic,
      fullTopic: test.topic,
    }));

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-base-100 border border-base-300 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-base-content">{`Test ${label}`}</p>
          <p className="text-sm text-base-content/70">
            {formatDate(data.date)}
          </p>
          <p className="text-sm text-base-content/70">{data.fullTopic}</p>
          <p className="font-bold text-primary">{`Score: ${data.score}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">
              Test History
            </h1>
          </div>
          <p className="text-base text-base-content/70 mb-6">
            Review your speech analysis results and track your progress over
            time
          </p>
        </div>

        {/* Progress Chart */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-8 border border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-primary">
              Progress Over Time
            </h2>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />{" "}
                    {/* Indigo-500 */}
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />{" "}
                {/* Gray-200 */}
                <XAxis
                  dataKey="testNumber"
                  stroke="#9ca3af" // Gray-400
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickLine={{ stroke: "#d1d5db" }} // Gray-300
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#9ca3af"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickLine={{ stroke: "#d1d5db" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1" // Indigo-500
                  strokeWidth={3}
                  fill="url(#scoreGradient)"
                  dot={{
                    fill: "#6366f1",
                    strokeWidth: 2,
                    stroke: "#ffffff",
                    r: 6,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#6366f1",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-base-content/70">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Overall Score</span>
            </div>
            <div className="hidden sm:block text-base-content/50">•</div>
            <span className="hidden sm:inline">
              Hover over points for details
            </span>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border border-primary/20 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {transformedTests.length}
            </div>
            <div className="text-sm text-base-content/70">Total Tests</div>
          </div>
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border border-primary/20 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {averageScore}
            </div>
            <div className="text-sm text-base-content/70">Average Score</div>
          </div>
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border border-primary/20 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {
                transformedTests.filter((test) => test.overallScore >= 80)
                  .length
              }
            </div>
            <div className="text-sm text-base-content/70">Good+ Scores</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-base-100/50 rounded-2xl p-6 mb-8 border border-base-300/30">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-5 h-5 text-base-content/50" />
              <input
                type="text"
                placeholder="Search by topic..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-base-content/50" />
              <select
                className="select select-bordered"
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
              >
                <option value="all">All Grades</option>
                <option value="outstanding">Outstanding</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="below">Below Average</option>
              </select>
            </div>
          </div>
        </div>

        {/* Test List */}
        <div className="space-y-4">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-base-100/50 rounded-2xl border border-base-300/30 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Test Summary - Clickable */}
              <div
                className="p-6 cursor-pointer hover:bg-base-100/80 transition-colors"
                onClick={() => handleTestClick(test.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      <h3 className="text-lg font-bold text-base-content flex-1 capitalize">
                        {test.topic}
                      </h3>
                      <div
                        className={`rounded-full px-4 py-2 border ${getScoreBgColor(
                          test.overallScore
                        )}`}
                      >
                        <span
                          className={`text-xl font-bold ${getScoreColor(
                            test.overallScore
                          )}`}
                        >
                          {test.overallScore}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(test.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{test.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Duration: {test.duration}</span>
                      </div>
                      <div
                        className={`badge ${
                          test.gradeColor === "text-success"
                            ? "badge-success"
                            : test.gradeColor === "text-info"
                            ? "badge-info"
                            : test.gradeColor === "text-warning"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {test.grade}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    {expandedTest === test.id ? (
                      <ChevronUp className="w-6 h-6 text-base-content/50" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-base-content/50" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Results */}
              {expandedTest === test.id && (
                <div className="border-t border-base-300/30 bg-base-200/30">
                  <div className="p-6">
                    {/* Transcript */}
                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Transcript
                      </h4>
                      <div className="bg-base-100/50 rounded-xl p-4 border border-base-300/30">
                        <p className="text-base-content italic">
                          {test.transcript}
                        </p>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Performance Metrics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {test.metrics.map((metric, index) => (
                          <div
                            key={index}
                            className="bg-base-100/50 rounded-xl p-4 border border-base-300/30"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold text-base-content">
                                {metric.label}
                              </span>
                              <span className="text-sm font-bold text-base-content">
                                {metric.score}%
                              </span>
                            </div>
                            <progress
                              className={`progress ${metric.color} w-full h-2`}
                              value={metric.score}
                              max="100"
                            ></progress>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Recommendations
                      </h4>
                      <div className="space-y-3">
                        {test.suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="bg-base-100/50 rounded-xl p-4 border border-base-300/30"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-sm text-base-content flex-1">
                                {suggestion.text}
                              </span>

                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && transformedTests.length > 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-base-content/70 mb-2">
              No tests found
            </h3>
            <p className="text-base-content/50">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHistoryPage;
