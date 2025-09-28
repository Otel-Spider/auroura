import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import * as RiIcons from 'react-icons/ri';

const StickyActionBar = ({
  hasChanges,
  loading,
  onSave,
  onPublish,
  disabled = false,
  auth
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled down more than 200px
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="sticky-action-bar">
      <div className="sticky-action-content">
        <div className="d-flex gap-2 align-items-center">
          {hasChanges && (
            <span className="text-warning small me-2">
              <RiIcons.RiInformationLine size={16} className="me-1" />
              You have unsaved changes
            </span>
          )}

          <Button
            variant="outline-primary"
            size="sm"
            onClick={onSave}
            disabled={loading || !auth?.user || !hasChanges || disabled}
            className="d-flex align-items-center"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <RiIcons.RiSaveLine size={14} className="me-1" />
                Save
              </>
            )}
          </Button>

          <Button
            variant="success"
            size="sm"
            onClick={onPublish}
            disabled={loading || !auth?.user || disabled}
            className="d-flex align-items-center"
          >
            <RiIcons.RiGlobalLine size={14} className="me-1" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyActionBar;
