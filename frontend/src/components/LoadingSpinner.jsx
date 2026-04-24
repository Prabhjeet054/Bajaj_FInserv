export default function LoadingSpinner() {
  return (
    <div className="spinner-container" aria-live="polite">
      <div className="spinner" />
      <span>Analyzing node relationships...</span>
    </div>
  );
}
