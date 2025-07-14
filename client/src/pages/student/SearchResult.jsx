import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  return (
    <div className="border-b border-gray-300 py-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* Thumbnail */}
        <div className="w-full md:w-56 h-40 flex-shrink-0">
          <img
            src={course.courseThumbnail}
            alt="course-thumbnail"
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Course Info */}
        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg md:text-xl">
              {course.courseTitle}
            </h1>
            <p className="text-sm text-gray-600">{course.subTitle}</p>
            <p className="text-sm text-gray-700">
              Instructor:{" "}
              <span className="font-bold">{course.creator?.name}</span>
            </p>
            <Badge className="w-fit">{course.courseLevel}</Badge>
          </div>

          <div className="mt-4 md:mt-0 md:text-right text-left">
            <h1 className="font-bold text-lg md:text-xl">
              ₹{course.coursePrice}
            </h1>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResult;
