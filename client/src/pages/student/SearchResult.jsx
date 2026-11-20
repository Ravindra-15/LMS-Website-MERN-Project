import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  const price = Number(course.coursePrice) || 0;
  const students = course.enrolledStudents?.length || 0;

  return (
    <div className="border-b border-border py-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="group flex flex-col md:flex-row gap-4 rounded-lg p-2 -mx-2 hover:bg-muted/50 transition-colors"
      >
        {/* Thumbnail */}
        <div className="w-full md:w-56 h-40 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          {course.courseThumbnail && (
            <img
              src={course.courseThumbnail}
              alt={course.courseTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        {/* Course Info */}
        <div className="flex flex-col md:flex-row justify-between flex-1 gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-lg md:text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {course.courseTitle}
            </h2>
            {course.subTitle && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.subTitle}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Instructor:{" "}
              <span className="font-semibold text-foreground">
                {course.creator?.name}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {course.courseLevel && <Badge>{course.courseLevel}</Badge>}
              {course.category && (
                <Badge variant="outline">{course.category}</Badge>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Users size={14} /> {students} enrolled
              </span>
            </div>
          </div>

          <div className="md:text-right">
            <p className="font-bold text-lg md:text-xl">
              {price === 0 ? (
                <span className="text-green-600 dark:text-green-400">Free</span>
              ) : (
                `₹${price}`
              )}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResult;
