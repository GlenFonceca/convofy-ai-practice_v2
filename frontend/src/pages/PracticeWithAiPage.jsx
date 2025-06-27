import {
  Cpu,
  MessagesSquare,
  Newspaper,
  Search,
  Speech,
  History,
  Plane,
  Clapperboard,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PracticeWithAiPage = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const categories = [
    { id: "general", name: "General Conversation", icon: MessagesSquare },
    { id: "technology", name: "Technology", icon: Cpu },
    { id: "current-events", name: "Current Events", icon: Newspaper },
    { id: "interview", name: "Interview Preparation", icon: Speech },
    { id: "travel", name: "Travel & Culture", icon: Plane },
    { id: "entertainment" ,name:"Entertainment & Media" , icon : Clapperboard}
  ];

  const topicsByCategory = {
    general: [
      "Discuss your favorite hobby",
      "Describe your ideal vacation",
      "Talk about a recent book you read",
      "Share your thoughts on remote work",
      "Explain a complex topic in simple terms",
      "Practice a short presentation",
      "Discuss your morning routine",
      "Talk about Own Topic",
    ],
    technology: [
      "Explain artificial intelligence basics",
      "Discuss the future of smartphones",
      "Compare different programming languages",
      "Talk about cybersecurity importance",
      "Explain cloud computing benefits",
      "Discuss social media impact",
      "Compare iOS vs Android",
      "Talk about emerging tech trends",
    ],
    "current-events": [
      "Discuss recent scientific discoveries",
      "Talk about climate change solutions",
      "Analyze current market trends",
      "Discuss global economic changes",
      "Talk about space exploration news",
      "Discuss renewable energy progress",
      "Analyze political developments",
      "Talk about cultural movements",
    ],
    interview: [
      "Practice introducing yourself",
      "Discuss your greatest strengths",
      "Explain a challenging project",
      "Talk about career goals",
      "Practice behavioral questions",
      "Discuss problem-solving skills",
      "Explain your work experience",
      "Practice salary negotiation",
    ],
    travel: [
      "Describe your most memorable travel experience",
      "Talk about a country you want to visit and why",
      "Share tips for packing efficiently for a trip",
      "Discuss the pros and cons of solo travel",
      "Describe the culture of a place you have visited",
      "Talk about how travel broadens your perspective",
      "Explain how you prepare for international travel",
      "Compare urban vs. rural travel destinations",
    ],
    entertainment: [
      'Describe your favorite movie and why you love it',
      'Talk about a TV series you recently watched',
      'Discuss how streaming services are changing entertainment',
      'Share your thoughts on the influence of social media influencers',
      'Compare books and movies — which do you prefer and why?',
      'Talk about your favorite music genre or artist',
      'Describe a concert or event you attended',
      'Discuss how entertainment reflects culture and society'
    ]

  };

  const currentTopics = topicsByCategory[activeCategory] || [];

  const filteredTopics = currentTopics.filter((topic) =>
    topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleTopicClick = (seletedTopic) => {
    navigate("/speech-analysis", {
      state: { topic: seletedTopic },
    });
  };

  const handleTestHistory = () => {
    navigate("/test-history");
  };

  return (
    <div className="h-full bg-base-100 max-w-screen">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between">
              {/* Left side - Title */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div>
                  <h1 className="text-base-content text-lg sm:text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em]">
                    Practice with AI
                  </h1>
                  <p className="text-base-content/60 text-xs sm:text-sm hidden sm:block">
                    Choose a topic and start practicing your conversation skills
                  </p>
                </div>
              </div>

              {/* Right side - Test History button */}
              <button
                onClick={handleTestHistory}
                className="btn btn-primary btn-sm sm:btn-md gap-2"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Test History</span>
                <span className="sm:hidden">History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Search Input */}
          <div className="mb-4 sm:mb-6">
            <label className="flex flex-col h-10 sm:h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-base-content/60 flex border-none bg-base-200 items-center justify-center pl-2 sm:pl-3 md:pl-4 rounded-l-xl border-r-0">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <input
                  placeholder="Search topics"
                  className="input input-bordered flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-base-content focus:outline-0 focus:ring-0 border-none bg-base-200 focus:border-none h-full placeholder:text-base-content/60 px-2 sm:px-3 md:px-4 rounded-l-none border-l-0 pl-1 sm:pl-2 text-sm sm:text-base font-normal leading-normal"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
          </div>

          {/* Categories Section */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base-content text-lg sm:text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] mb-3 sm:mb-4">
              Categories
            </h2>
            <div className="border-b border-base-300">
              <div className="flex gap-1 sm:gap-2 md:gap-4 lg:gap-6 overflow-x-auto pb-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const isActive = activeCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`flex flex-col items-center justify-center border-b-[3px] gap-1 pb-2 pt-2 min-w-fit whitespace-nowrap px-2 sm:px-3 ${
                        isActive
                          ? "border-b-primary text-primary"
                          : "border-b-transparent text-base-content/60 hover:text-base-content/80"
                      }`}
                    >
                      <div
                        className={
                          isActive ? "text-primary" : "text-base-content/60"
                        }
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </div>
                      <p
                        className={`text-[10px] sm:text-xs md:text-sm font-semibold leading-tight text-center ${
                          isActive ? "text-primary" : "text-base-content/60"
                        }`}
                      >
                        {category.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Topics Section */}
          <div>
            <h2 className="text-base-content text-lg sm:text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] mb-3 sm:mb-4">
              Topics
              {searchQuery && (
                <span className="text-base-content/60 text-xs sm:text-sm font-normal ml-2">
                  ({filteredTopics.length} results)
                </span>
              )}
            </h2>

            {filteredTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-base-content/60">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
                <p className="text-base sm:text-lg font-medium mb-2">
                  No topics found
                </p>
                <p className="text-sm text-center px-4">
                  Try adjusting your search or select a different category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleTopicClick(topic)}
                    className="flex items-center justify-start gap-3 rounded-lg border border-base-content/20 bg-base-200 p-3 sm:p-4 hover:bg-base-300 hover:border-base-content/40 transition-all duration-200 text-left min-h-[60px] sm:min-h-[80px]"
                  >
                    <h2 className="text-base-content text-sm sm:text-base font-semibold leading-tight">
                      {topic}
                    </h2>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeWithAiPage;
