 import React, { useState } from 'react';

// Now accepts a className to be passed to the <p> tag
function ExpandableText({ text, maxLength = 300, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If the text isn't long enough, just display it all
  if (text.length <= maxLength) {
    return (
      <p className={className} style={{ whiteSpace: 'pre-line' }}>
        {text}
      </p>
    );
  }

  // Toggle function
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <p className={className} style={{ whiteSpace: 'pre-line' }}>
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <button onClick={toggleReadMore} className="read-more-btn">
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
}

export default ExpandableText;