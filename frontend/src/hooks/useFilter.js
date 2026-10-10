import { useState, useMemo } from 'react';

export const useFilter = (items = [], initialCategory = 'all') => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'price-low', 'price-high', 'rating'
  const [priceRange, setPriceRange] = useState(1500);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        const matchCategory =
          selectedCategory === 'all' ||
          item.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          item.type?.toLowerCase().includes(selectedCategory.toLowerCase());

        // Search query filter
        const query = searchQuery.toLowerCase().trim();
        const matchSearch =
          !query ||
          item.name?.toLowerCase().includes(query) ||
          item.brand?.toLowerCase().includes(query) ||
          item.type?.toLowerCase().includes(query) ||
          item.tagline?.toLowerCase().includes(query);

        // Price filter
        const price = item.pricePerDay || item.dailyRate || item.price || 0;
        const matchPrice = price <= priceRange;

        return matchCategory && matchSearch && matchPrice;
      })
      .sort((a, b) => {
        const priceA = a.pricePerDay || a.dailyRate || a.price || 0;
        const priceB = b.pricePerDay || b.dailyRate || b.price || 0;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // recommended
      });
  }, [items, searchQuery, selectedCategory, sortBy, priceRange]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    filteredItems,
    totalCount: items.length,
    filteredCount: filteredItems.length
  };
};
