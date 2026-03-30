import { useState } from "react";

function LectureCard({ lecture, index, onPlay }) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);

  const thumbnail =
    lecture?.thumbnail?.secure_url &&
    !imgError
      ? lecture.thumbnail.secure_url
      : "https://via.placeholder.com/400x250?text=No+Thumbnail";

  return (
    <div
      className="bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/40 transition cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      
      <div className="relative h-40 bg-black">

        {!hover ? (
          <img
            src={thumbnail}
            alt={lecture.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={lecture?.lecture?.secure_url}
            muted
            autoPlay
            loop
            className="w-full h-full object-cover"
          />
        )}

      
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 px-3 py-1 rounded text-sm">
            ▶ Preview
          </div>
        </div>
      </div>

      
      <div className="p-4">
        <h3 className="font-semibold text-sm truncate">
          {index + 1}. {lecture.title}
        </h3>

        <p className="text-xs text-white/50 mt-1 line-clamp-2">
          {lecture.description}
        </p>

        <button
          onClick={onPlay}
          className="mt-3 w-full bg-yellow-400 text-black py-2 rounded text-sm font-bold"
        >
          Watch
        </button>
      </div>
    </div>
  );
}

export default LectureCard;