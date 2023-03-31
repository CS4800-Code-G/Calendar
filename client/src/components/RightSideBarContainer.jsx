import React from "react";
import { useState } from "react";

const RightSideBarContainer = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="right_sidebar_container">
      <div className="tab__buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`tab__button ${activeTab === index ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab__content">{tabs[activeTab].content}</div>
    </div>
  );
};

export default RightSideBarContainer;
