import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import React from "react";

const Course = () => {
  return (
    <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="relative h-48">
        <img
          src="https://assets.techrepublic.com/uploads/2024/07/tr_20240708-best-web-development-courses.jpg"
          alt="Course"
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      <CardContent className="px-5 py-4 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate">
          Nextjs Complete Course 2025
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>Ravin</AvatarFallback>
            </Avatar>
            <h1 className="font-medium text-sm">Ravin</h1>
          </div>

          <Badge
            className="!bg-blue-700 !text-white hover:!bg-gray-800 px-2 py-1 text-xs !rounded-full transition-colors duration-200"
          >
            Advanced
          </Badge>
        </div>
        <div className="text-lg font-bold">
            <span>₹499</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Course;
