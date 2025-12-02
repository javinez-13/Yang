import { useNavigate } from 'react-router-dom';

const BackButton = ({ fallback = '/dashboard', label = 'Back' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallback);
  };

  return (
    <button className="back-btn" onClick={handleClick} aria-label="Go back">
      <span aria-hidden="true">←</span>
      {label}
    </button>
  );
};

export default BackButton;


