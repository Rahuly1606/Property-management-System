import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component using Tailwind CSS for the PropertyHub design system
 * Optimized for property listings with large imagery, details, and quick actions
 */
const Card = ({
  children,
  title,
  subtitle,
  price,
  frequency = 'month',
  image,
  imageAlt = 'Property image',
  badges = [],
  essentials = [],
  className = '',
  onClick,
  footer,
  isSaved = false,
  onSave,
  onRequestVisit,
  onMessageLandlord,
  isNew = false,
  isVerified = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden ${className}`}
      {...props}
    >
      {/* Image Container - 3:2 ratio as specified in the brief */}
      {image && (
        <div className="relative w-full pb-[66.67%] overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* Badges overlay */}
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {isVerified && (
              <span className="bg-success-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Verified
              </span>
            )}
            {isNew && (
              <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                New
              </span>
            )}
            {badges.map((badge, index) => (
              <span
                key={index}
                className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-medium"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Save button */}
          <button
            onClick={onSave}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors duration-200"
            aria-label={isSaved ? "Remove from saved" : "Save property"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isSaved ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 ${isSaved ? 'text-accent-500' : 'text-gray-700'}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
      )}

      <div className="p-4">
        {/* Title & Price Row */}
        <div className="flex justify-between items-start mb-2">
          <div>
            {title && <h3 className="font-heading font-semibold text-xl text-primary-900 mb-1">{title}</h3>}
            {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
          </div>
          {price && (
            <div className="text-right">
              <span className="text-xl font-semibold text-primary-900">${price}</span>
              <span className="text-gray-500 text-sm">/{frequency}</span>
            </div>
          )}
        </div>

        {/* Property description - 3 lines as mentioned in the brief */}
        <div className="mb-3">
          <p className="text-gray-700 line-clamp-3">{children}</p>
        </div>

        {/* Essentials row (beds • baths • sqft) as mentioned in the brief */}
        {essentials.length > 0 && (
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            {essentials.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-400">•</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Quick actions: Request visit, Message landlord as mentioned in the brief */}
        <div className="flex gap-2 mt-4">
          {onRequestVisit && (
            <button
              onClick={onRequestVisit}
              className="flex-1 py-2 px-3 bg-accent-500 hover:bg-accent-600 text-white text-sm rounded font-medium transition-colors duration-200"
            >
              Request visit
            </button>
          )}
          {onMessageLandlord && (
            <button
              onClick={onMessageLandlord}
              className="flex-1 py-2 px-3 bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 text-sm rounded font-medium transition-colors duration-200"
            >
              Message landlord
            </button>
          )}
        </div>
      </div>

      {/* Optional footer */}
      {footer && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">{footer}</div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  frequency: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  badges: PropTypes.arrayOf(PropTypes.string),
  essentials: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  onClick: PropTypes.func,
  footer: PropTypes.node,
  isSaved: PropTypes.bool,
  onSave: PropTypes.func,
  onRequestVisit: PropTypes.func,
  onMessageLandlord: PropTypes.func,
  isNew: PropTypes.bool,
  isVerified: PropTypes.bool,
};

export default Card;