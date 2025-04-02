import React from 'react';

const Card = ({
  children,
  title,
  image,
  imageAlt = 'Card image',
  imagePosition = 'top',
  className = '',
  onClick,
  footer,
  ...props
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={handleClick}
      {...props}
    >
      {image && imagePosition === 'top' && (
        <figure>
          <img
            src={image}
            alt={imageAlt}
            className="object-cover w-full h-48"
          />
        </figure>
      )}
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        {children}
      </div>
      {image && imagePosition === 'bottom' && (
        <figure>
          <img
            src={image}
            alt={imageAlt}
            className="object-cover w-full h-48"
          />
        </figure>
      )}
      {footer && <div className="card-actions justify-end p-4">{footer}</div>}
    </div>
  );
};

export default Card; 