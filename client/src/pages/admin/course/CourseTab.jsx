import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const params = useParams();
  const courseId = params.courseId;
  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId);

  const [publishCourse, {}] = usePublishCourseMutation();

  const [deleteCourse] = useDeleteCourseMutation();

  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData?.course; // Now matches backend response
      console.log("Fetched course:", course);
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category || "",
        courseLevel: course.courseLevel || "Beginner",
        coursePrice: course.coursePrice?.toString() || "",
        courseThumbnail: course.courseThumbnail || "",
      });

      // Set thumbnail preview if exists
      if (course.courseThumbnail) {
        setPreviewThumbnail(course.courseThumbnail);
      }
    }
  }, [courseByIdData]);
  //.......................................................................................
  const hasLectures = courseByIdData?.course.lectures.length > 0;
  const isPublished = courseByIdData?.course.isPublished;

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();
  //.........................................................................................................................................
  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [location]);

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  // get file
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);

    await editCourse({ formData, courseId });
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response.data) {
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish course");
    }
  };

  //...................................................................................

  const handleRemoveCourse = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteCourse(courseId).unwrap();
      toast.success("Course deleted successfully!");
      navigate("/admin/course");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete course");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course update.");
    }
    if (error) {
      toast.error(error.data.message || "Failed to update course");
    }
  }, [isSuccess, error]);

  if (courseByIdLoading) {
    return <div className="p-4">Loading course...</div>; // or use a spinner component
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <div className="max-w-[70%]">
            <CardTitle>Basic Course Info</CardTitle>
            <CardDescription>
              Make changes to your courses here and click save when you are done
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end justify-center">
            {/* <Button
              disabled={courseByIdData?.course.lectures.length === 0}
              variant="outline"
              onClick={() =>
                publishStatusHandler(
                  courseByIdData?.course.isPublished ? "false" : "true"
                )
              }
            >
              {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
            </Button> */}
            <Button
              disabled={!hasLectures}
              variant="outline"
              onClick={() =>
                publishStatusHandler(isPublished ? "false" : "true")
              }
            >
              {hasLectures
                ? isPublished
                  ? "Unpublish"
                  : "Publish"
                : "Publish"}
            </Button>

            <Button onClick={handleRemoveCourse} variant="destructive">
              Remove Course
            </Button>

            {/* <Button>Remove Course</Button> */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Title */}
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="courseTitle"
            value={input.courseTitle}
            onChange={changeEventHandler}
            placeholder="Ex. Fullstack developer"
          />
        </div>

        {/* Subtitle */}
        <div>
          <Label>Subtitle</Label>
          <Input
            type="text"
            name="subTitle"
            value={input.subTitle}
            onChange={changeEventHandler}
            placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <RichTextEditor input={input} setInput={setInput} />
        </div>

        {/* Category, Course Level, Price - Side by Side */}
        <div className="flex flex-wrap gap-5">
          <div className="flex flex-col w-[200px] space-y-2">
            <Label>Category</Label>
            <Select
              onValueChange={selectCategory}
              defaultValue={input.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Next JS">Next JS</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Frontend Development">
                    Frontend Development
                  </SelectItem>
                  <SelectItem value="Fullstack Development">
                    Fullstack Development
                  </SelectItem>
                  <SelectItem value="MERN Stack Development">
                    MERN Stack Development
                  </SelectItem>
                  <SelectItem value="Javascript">Javascript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Docker">Docker</SelectItem>
                  <SelectItem value="MongoDB">MongoDB</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-[200px] space-y-2">
            <Label>Course Level</Label>
            <Select
              onValueChange={selectCourseLevel}
              defaultValue={input.courseLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-[200px] space-y-2">
            <Label>Price in (INR)</Label>
            <Input
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={changeEventHandler}
              placeholder="199"
            />
          </div>
        </div>

        {/* Course Thumbnail Below */}
        <div className="flex flex-col space-y-2">
          <Label>Course Thumbnail</Label>
          <Input
            type="file"
            onChange={selectThumbnail}
            accept="image/*"
            className="w-fit"
          />
          {previewThumbnail && (
            <img
              src={previewThumbnail}
              className="w-64 my-2"
              alt="Course Thumbnail"
            />
          )}
        </div>

        {/* Buttons Below */}
        <div className="flex gap-3">
          <Button onClick={() => navigate("/admin/course")} variant="outline">
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={updateCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  
  );
};

export default CourseTab;
