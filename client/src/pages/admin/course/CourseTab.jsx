import { Button } from "@/components/ui/button";
import { COURSE_CATEGORIES } from "@/lib/courseOptions";

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
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
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
  // Always load fresh data from the server when this page opens (and after
  // refresh), so the form never starts from an old cached copy.
  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    isError: courseByIdError,
  } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

  const [publishCourse, { isLoading: publishing }] = usePublishCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const course = courseByIdData?.course;
    if (!course) return;
    setInput({
      courseTitle: course.courseTitle || "",
      subTitle: course.subTitle || "",
      description: course.description || "",
      category: course.category || "",
      courseLevel: course.courseLevel || "",
      coursePrice:
        course.coursePrice === undefined || course.coursePrice === null
          ? ""
          : String(course.coursePrice),
      courseThumbnail: course.courseThumbnail || "",
    });
    setPreviewThumbnail(course.courseThumbnail || "");
  }, [courseByIdData]);

  const hasLectures = courseByIdData?.course?.lectures?.length > 0;
  const isPublished = courseByIdData?.course?.isPublished;

  const [editCourse, { isLoading }] = useEditCourseMutation();

  // Functional updates everywhere so one field can never overwrite another
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };
  const selectCategory = (value) => setInput((prev) => ({ ...prev, category: value }));
  const selectCourseLevel = (value) => setInput((prev) => ({ ...prev, courseLevel: value }));

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setInput((prev) => ({ ...prev, courseThumbnail: file }));
    const fileReader = new FileReader();
    fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
    fileReader.readAsDataURL(file);
  };

  const updateCourseHandler = async () => {
    if (!input.courseTitle.trim()) {
      toast.error("Course title is required.");
      return;
    }
    if (input.coursePrice !== "" && Number(input.coursePrice) < 0) {
      toast.error("Price can't be negative.");
      return;
    }

    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle.trim());
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    // Only send a thumbnail when a new image file was chosen
    if (input.courseThumbnail instanceof File) {
      formData.append("courseThumbnail", input.courseThumbnail);
    }

    try {
      const res = await editCourse({ formData, courseId }).unwrap();
      toast.success(res?.message || "Course updated.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update course");
    }
  };

  const publishStatusHandler = async (action) => {
    try {
      const res = await publishCourse({ courseId, query: action }).unwrap();
      toast.success(res.message);
    } catch {
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
      await deleteCourse(courseId).unwrap();
      toast.success("Course deleted successfully!");
      navigate("/admin/course");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete course");
    }
  };

  if (courseByIdLoading) {
    return (
      <div className="p-4 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading course...
      </div>
    );
  }
  if (courseByIdError || !courseByIdData?.course) {
    return <div className="p-4 text-red-500">Failed to load this course.</div>;
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
              disabled={!hasLectures || publishing}
              title={hasLectures ? "" : "Add at least one lecture to publish"}
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
              value={input.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {COURSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-[200px] space-y-2">
            <Label>Course Level</Label>
            <Select
              onValueChange={selectCourseLevel}
              value={input.courseLevel}
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
