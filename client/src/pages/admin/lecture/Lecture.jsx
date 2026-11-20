import { Badge } from "@/components/ui/badge";
import { Edit, Lock, Unlock, VideoOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, index }) => {
  const navigate = useNavigate();
  const goToUpdateLecture = () => navigate(`${lecture._id}`);

  return (
    <div className="flex items-center justify-between gap-3 bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2">
      <h1 className="font-bold text-gray-800 dark:text-gray-100">
        Lecture - {index + 1}: {lecture.lectureTitle}
      </h1>
      <div className="flex items-center gap-2 shrink-0">
        {!lecture.videoUrl && (
          <Badge variant="outline" className="gap-1 text-amber-600 dark:text-amber-400">
            <VideoOff size={12} /> No video
          </Badge>
        )}
        {lecture.isPreviewFree ? (
          <Badge variant="outline" className="gap-1 text-green-600 dark:text-green-400">
            <Unlock size={12} /> Free
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Lock size={12} /> Locked
          </Badge>
        )}
        <Edit
          onClick={goToUpdateLecture}
          size={20}
          className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        />
      </div>
    </div>
  );
};

export default Lecture;
