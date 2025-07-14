import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`}>
    <Card className=" max-w-sm mx-auto overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:max-w-[300px]">
      <div className="relative h-48">
        <img
          src={course.courseThumbnail}
          alt="Course"
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      <CardContent className="px-5 py-4 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate max-w-[80%]">
          {course.courseTitle}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  course.creator?.photourl || "https://github.com/shadcn.png"
                }
              />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
            <h1 className="font-medium text-sm">{course.creator?.name}</h1>
          </div>

          <Badge  className="!bg-blue-700 !text-white hover:!bg-gray-800 mt-2 px-2 py-1 text-[10px] sm:text-xs !rounded-full transition-colors duration-200 whitespace-nowrap">
            {course.courseLevel}
          </Badge>
        </div>

        <div className="text-lg font-bold">
          <span>₹{course.coursePrice}</span>
        </div>
      </CardContent>
    </Card>
    </Link>
    
  );
  
};

export default Course;
