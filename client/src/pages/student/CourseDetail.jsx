import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BuyCourseButton from "@/components/ui/BuyCourseButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReactPlayer from "react-player";

import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";

import { BadgeInfo, Loader2, Lock, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2 py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading course...
      </div>
    );
  }
  if (isError || !data?.course) {
    return <h1 className="text-center py-24 text-lg">Failed to load course details</h1>;
  }

  const { course, purchased } = data;
  const lectures = course.lectures || [];

  // A lecture can be watched here if the user bought the course or it is a
  // free preview, and it actually has a video. (The server already removes
  // video links of locked lectures for non-buyers.)
  const canWatch = (lecture) =>
    (purchased || lecture.isPreviewFree) && !!lecture.videoUrl;

  const watchable = lectures.filter(canWatch);
  const current =
    watchable.find((l) => l._id === selectedId) || watchable[0] || null;
  const freeCount = lectures.filter((l) => l.isPreviewFree).length;
  const price = Number(course.coursePrice) || 0;

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">{course.courseTitle}</h1>
          {course.subTitle && (
            <p className="text-base md:text-lg text-gray-200">{course.subTitle}</p>
          )}
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course.creator?.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course.updatedAt?.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course.enrolledStudents?.length || 0}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Description + lecture list */}
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {lectures.length} Lecture{lectures.length === 1 ? "" : "s"}
                {!purchased && freeCount > 0 && ` · ${freeCount} free preview${freeCount === 1 ? "" : "s"}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {lectures.map((lecture, idx) => {
                const playable = canWatch(lecture);
                const active = current?._id === lecture._id;
                return (
                  <button
                    key={lecture._id || idx}
                    type="button"
                    disabled={!playable}
                    onClick={() => setSelectedId(lecture._id)}
                    className={`w-full flex items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors
                      ${playable ? "hover:bg-muted cursor-pointer" : "cursor-not-allowed opacity-70"}
                      ${active ? "bg-muted font-medium" : ""}`}
                  >
                    {playable ? (
                      <PlayCircle size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Lock size={16} className="shrink-0 text-muted-foreground" />
                    )}
                    <span className="flex-1">{lecture.lectureTitle}</span>
                    {!purchased && lecture.isPreviewFree && (
                      <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-600/40">
                        Preview
                      </Badge>
                    )}
                  </button>
                );
              })}
              {lectures.length === 0 && (
                <p className="text-sm text-muted-foreground">No lectures yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview player + purchase */}
        <div className="w-full lg:w-1/3">
          <Card className="p-4 flex flex-col lg:sticky lg:top-24">
            <CardContent className="p-0 sm:p-2">
              <div className="w-full aspect-video mb-4 overflow-hidden rounded-md bg-black">
                {current ? (
                  <ReactPlayer
                    key={current._id}
                    width="100%"
                    height="100%"
                    src={current.videoUrl}
                    controls
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Lock size={22} />
                    <p className="text-sm">
                      {purchased ? "No video uploaded yet" : "No free preview available"}
                    </p>
                  </div>
                )}
              </div>
              <h2 className="font-semibold">
                {current ? current.lectureTitle : course.courseTitle}
              </h2>
              {current && !purchased && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Free preview</p>
              )}
              <Separator className="my-3" />
              <p className="text-2xl font-bold">
                {price === 0 ? "Free" : `₹${price}`}
              </p>
            </CardContent>
            <CardFooter className="flex justify-center p-0 pt-4 sm:p-2 sm:pt-4">
              {purchased ? (
                <Button
                  onClick={() => navigate(`/course-progress/${courseId}`)}
                  className="w-full"
                >
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
