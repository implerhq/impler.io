import { Collapse } from '@mantine/core';
import React, { useState, useEffect, useRef } from 'react';

interface AutoHeightComponentProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const AutoHeightComponent: React.FC<AutoHeightComponentProps> = ({ isVisible, children }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldRemoveContent = useRef(false);

  useEffect(() => {
    if (isVisible) {
      shouldRemoveContent.current = false;
      setIsRendered(true);
      requestAnimationFrame(() => {
        setIsExpanded(true);
      });
    } else {
      shouldRemoveContent.current = true;
      setIsExpanded(false);
    }
  }, [isVisible]);

  const handleTransitionEnd = () => {
    if (shouldRemoveContent.current) {
      setIsRendered(false);
    }
  };

  return (
    <Collapse in={isExpanded} onTransitionEnd={handleTransitionEnd} w="100%">
      {isRendered && children}
    </Collapse>
  );
};
