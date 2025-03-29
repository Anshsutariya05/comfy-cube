
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  name: string;
  imageUrl: string;
  count: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, imageUrl, count }) => {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Link 
      to={`/categories/${slug}`} 
      className="relative group overflow-hidden rounded-lg h-64"
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300 z-10"></div>
      <img 
        src={imageUrl || '/placeholder.svg'} 
        alt={name}
        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 w-full p-6 text-white z-20">
        <h3 className="text-xl font-medium">{name}</h3>
        <p className="text-sm opacity-90">{count} items</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
