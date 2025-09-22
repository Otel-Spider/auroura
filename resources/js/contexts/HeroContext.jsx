import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setupCSRFToken, setupCSRFInterceptor, getCSRFToken } from '../utils/csrf';

// Set up axios defaults for CSRF token
setupCSRFToken();
setupCSRFInterceptor(axios);

const HeroContext = createContext();

export const useHero = () => {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error('useHero must be used within a HeroProvider');
  }
  return context;
};

const defaultHeroData = {
  title: "Rixos Sharm El Sheikh Adults Only 18+",
  location: "Sharm El Sheikh, Egypt",
  stars: 5,
  bgImageUrl: "https://qln0xxt0hw0ogxv1.imgix.net/https%3A%2F%2Fimages.ctfassets.net%2F944fk97h13dc%2F4xadrTCxgBoi6rstnDUJsI%2Ff14ca28071ea66bcf22a16a9f058632a%2FSSH_General_1A.jpg",
  bgImage: null,
  bgImageAlt: "Resort Hero Background",
  bgImageName: "hero-background",
  ratingScore: "4.8/5",
  ratingReviews: "900 reviews",
  chipImages: {},
  chips: [
    { key: 'all-inclusive', label: 'All Inclusive', icon: 'dining', enabled: true },
    { key: 'entertainment', label: 'Entertainment', icon: 'entertainment', enabled: true },
    { key: 'fitness', label: 'Fitness', icon: 'fitness', enabled: true },
    { key: 'wellness', label: 'Wellness', icon: 'wellness', enabled: true },
    { key: 'sports', label: 'Sports', icon: 'sports', enabled: true },
    { key: 'watersports', label: 'Watersports', icon: 'watersports', enabled: true },
    { key: 'beach', label: 'Beach', icon: 'beach', enabled: true },
    { key: 'romance', label: 'Romance', icon: 'romance', enabled: true }
  ]
};

export const HeroProvider = ({ children }) => {
  const [heroData, setHeroData] = useState(defaultHeroData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load hero data from API on mount
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/hero/active');

        // Convert snake_case API response to camelCase for frontend
        const convertedData = {
          title: response.data.title,
          location: response.data.location,
          stars: response.data.stars,
          bgImageUrl: response.data.bg_image_url,
          bgImage: response.data.bg_image,
          bgImageAlt: response.data.bg_image_alt || "Resort Hero Background",
          bgImageName: response.data.bg_image_name || "hero-background",
          ratingScore: response.data.rating_score,
          ratingReviews: response.data.rating_reviews,
          chips: response.data.chips,
          chipImages: response.data.chip_images || {}
        };

        setHeroData(convertedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching hero data:', err);
        setError('Failed to load hero data');
        // Keep default data on error
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const updateHeroData = async (newData) => {
    try {
      // Ensure CSRF token is up to date
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        toast.error('CSRF token not available. Please refresh the page.');
        return;
      }

      const updatedData = { ...heroData, ...newData };
      console.log('Sending hero data update:', updatedData);

      // Save to database
      const response = await axios.put('/api/hero/update', updatedData, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });
      console.log('Hero data updated successfully:', response.data);

      // Update local state with response data
      if (response.data && response.data.data) {
        setHeroDataFromResponse(response.data.data);
      }

      setError(null);
      toast.success('Hero settings updated successfully!');
    } catch (err) {
      console.error('Error updating hero data:', err);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);

      if (err.response?.status === 401) {
        setError('Please log in to save hero settings');
        toast.error('Please log in to save hero settings');
      } else if (err.response?.status === 419) {
        setError('Session expired. Please refresh the page and try again.');
        toast.error('Session expired. Please refresh the page and try again.');
      } else if (err.response?.status === 422) {
        setError('Invalid data: ' + (err.response.data.message || 'Validation failed'));
        toast.error('Invalid data: ' + (err.response.data.message || 'Validation failed'));
      } else {
        setError('Failed to save hero data: ' + (err.response?.data?.message || err.message));
        toast.error('Failed to save hero data: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const setHeroDataFromResponse = (newData) => {
    console.log('Setting hero data from response:', newData);

    // Convert snake_case API response to camelCase for frontend
    const convertedData = {
      title: newData.title,
      location: newData.location,
      stars: newData.stars,
      bgImageUrl: newData.bg_image_url,
      bgImage: newData.bg_image,
      bgImageAlt: newData.bg_image_alt || "Resort Hero Background",
      bgImageName: newData.bg_image_name || "hero-background",
      ratingScore: newData.rating_score,
      ratingReviews: newData.rating_reviews,
      chips: newData.chips,
      chipImages: newData.chip_images || {}
    };

    console.log('Converted data:', convertedData);
    setHeroData(convertedData);
    setError(null);
  };

  const updateHeroField = (field, value) => {
    const updatedData = { ...heroData, [field]: value };
    setHeroData(updatedData);
  };

  const toggleChip = (chipKey) => {
    const updatedChips = heroData.chips.map(chip =>
      chip.key === chipKey ? { ...chip, enabled: !chip.enabled } : chip
    );
    const updatedData = { ...heroData, chips: updatedChips };
    setHeroData(updatedData);
  };

  const updateChipLabel = (chipKey, newLabel) => {
    const updatedChips = heroData.chips.map(chip =>
      chip.key === chipKey ? { ...chip, label: newLabel } : chip
    );
    const updatedData = { ...heroData, chips: updatedChips };
    setHeroData(updatedData);
  };

  const addNewChip = () => {
    const chipKey = `chip-${Date.now()}`;
    const newChip = {
      key: chipKey,
      label: 'New Feature',
      icon: 'dining',
      enabled: true
    };
    const updatedChips = [...heroData.chips, newChip];
    const updatedData = { ...heroData, chips: updatedChips };
    setHeroData(updatedData);
  };

  const removeChip = (chipKey) => {
    const updatedChips = heroData.chips.filter(chip => chip.key !== chipKey);
    const updatedData = { ...heroData, chips: updatedChips };
    setHeroData(updatedData);
  };

  const uploadChipImages = async (chipImages) => {
    try {
      // Ensure CSRF token is up to date
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        toast.error('CSRF token not available. Please refresh the page.');
        return;
      }

      const formData = new FormData();

      // Add all current hero data
      formData.append('title', heroData.title || '');
      formData.append('location', heroData.location || '');
      formData.append('stars', heroData.stars || 5);
      if (heroData.bgImageUrl && heroData.bgImageUrl.trim() !== '') {
        formData.append('bg_image_url', heroData.bgImageUrl);
      }
      formData.append('bg_image_alt', heroData.bgImageAlt || '');
      formData.append('bg_image_name', heroData.bgImageName || '');
      formData.append('rating_score', heroData.ratingScore || '4.8/5');
      formData.append('rating_reviews', heroData.ratingReviews || '900 reviews');
      formData.append('chips', JSON.stringify(heroData.chips || []));

      // Add chip images
      Object.keys(chipImages).forEach(key => {
        if (chipImages[key]) {
          formData.append(`chip_images[${key}]`, chipImages[key]);
        }
      });

      const response = await axios.post('/api/hero/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });

      if (response.data && response.data.data) {
        setHeroDataFromResponse(response.data.data);
        toast.success('Chip images uploaded successfully!');
      }
    } catch (err) {
      console.error('Error uploading chip images:', err);
      if (err.response?.status === 419) {
        toast.error('Session expired. Please refresh the page and try again.');
      } else {
        toast.error('Failed to upload chip images: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const renameBackgroundImage = async (newName) => {
    try {
      if (!heroData.bgImage) {
        toast.error('No background image to rename');
        return;
      }

      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        toast.error('CSRF token not available. Please refresh the page.');
        return;
      }

      const response = await axios.post('/api/hero/rename-background', {
        old_path: heroData.bgImage,
        new_name: newName
      }, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });

      if (response.data && response.data.data) {
        // Update local state with new file path
        const updatedData = {
          ...heroData,
          bgImage: response.data.data.new_path
        };
        setHeroData(updatedData);
        toast.success('Background image renamed successfully!');
      }
    } catch (err) {
      console.error('Error renaming background image:', err);
      if (err.response?.status === 409) {
        toast.error('A file with this name already exists');
      } else if (err.response?.status === 404) {
        toast.error('Original file not found');
      } else {
        toast.error('Failed to rename background image: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const resetHeroData = async () => {
    try {
      setHeroData(defaultHeroData);
      await axios.put('/api/hero/update', defaultHeroData);
      setError(null);
      toast.success('Hero data reset successfully!');
    } catch (err) {
      console.error('Error resetting hero data:', err);
      setError('Failed to reset hero data');
      toast.error('Failed to reset hero data');
    }
  };

  const value = {
    heroData,
    loading,
    error,
    updateHeroData,
    setHeroDataFromResponse,
    updateHeroField,
    toggleChip,
    updateChipLabel,
    addNewChip,
    removeChip,
    uploadChipImages,
    renameBackgroundImage,
    resetHeroData
  };

  return (
    <HeroContext.Provider value={value}>
      {children}
    </HeroContext.Provider>
  );
};
