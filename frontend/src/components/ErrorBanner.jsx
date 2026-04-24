export default function ErrorBanner({ message, onClose }) {
  return (
    <div className="error-banner" role="alert">
      <span className="error-icon">❌</span>
      <span className="error-message">{message}</span>
      <button className="error-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
    </div>
  );
}
