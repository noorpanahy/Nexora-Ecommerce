function Loading() {
  return (
    <div className="flex justify-center items-center py-10">
      <style>{`
        .catalog-spinner {
          width: 2.5rem;
          height: 2.5rem;
          border: 3px solid #D8D0BF;
          border-top-color: #A8492F;
          border-radius: 50%;
          animation: catalog-spin 0.8s linear infinite;
        }

        @keyframes catalog-spin {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .catalog-spinner {
            animation-duration: 1.6s;
          }
        }
      `}</style>

      <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
    </div>
  );
}

export default Loading;