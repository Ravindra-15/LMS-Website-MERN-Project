import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import { uploadLectureVideo } from "@/lib/uploadVideo";
import { Loader2, Lock, Unlock, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB

const LectureTab = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const { data: lectureData, isLoading: lectureLoading } = useGetLectureByIdQuery(
    lectureId,
    { refetchOnMountOrArgChange: true }
  );
  const lecture = lectureData?.lecture;

  const [lectureTitle, setLectureTitle] = useState("");
  const [video, setVideo] = useState(null); // { videoUrl, publicId }
  const [isFree, setIsFree] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fill the form from the saved lecture (model fields are videoUrl/publicId)
  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle || "");
      setIsFree(!!lecture.isPreviewFree);
      setVideo(
        lecture.videoUrl
          ? { videoUrl: lecture.videoUrl, publicId: lecture.publicId }
          : null
      );
    }
  }, [lecture]);

  // Cancel an in-progress upload if the admin leaves the page
  useEffect(() => () => abortRef.current?.abort(), []);

  const [editLecture, { isLoading: saving }] = useEditLectureMutation();
  const [removeLecture, { isLoading: removing }] = useRemoveLectureMutation();

  const save = (fields) => editLecture({ courseId, lectureId, ...fields }).unwrap();

  // Lock/unlock is saved immediately, so it can't be "forgotten"
  const toggleFree = async (checked) => {
    setIsFree(checked); // optimistic
    try {
      await save({ isPreviewFree: checked });
      toast.success(
        checked
          ? "Lecture unlocked: everyone can watch it as a free preview."
          : "Lecture locked: only students who bought the course can watch it."
      );
    } catch (err) {
      setIsFree(!checked); // revert
      toast.error(err?.data?.message || "Could not update lecture access.");
    }
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a video file.");
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      toast.error("Video is too large (max 2 GB).");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploaded = await uploadLectureVideo(file, {
        onProgress: setUploadProgress,
        signal: controller.signal,
      });
      // Save the video to the lecture right away
      await save({ videoInfo: uploaded });
      setVideo(uploaded);
      toast.success("Video uploaded and saved.");
    } catch (err) {
      if (controller.signal.aborted) {
        toast.info("Upload cancelled.");
      } else {
        console.log(err);
        toast.error(err?.data?.message || err?.response?.data?.message || "Video upload failed.");
      }
    } finally {
      setUploading(false);
      abortRef.current = null;
    }
  };

  const cancelUpload = () => abortRef.current?.abort();

  const updateHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required.");
      return;
    }
    try {
      const res = await save({ lectureTitle, isPreviewFree: isFree });
      toast.success(res?.message || "Lecture updated.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update lecture.");
    }
  };

  const removeHandler = async () => {
    if (!window.confirm("Delete this lecture and its video? This can't be undone.")) return;
    try {
      const res = await removeLecture(lectureId).unwrap();
      toast.success(res?.message || "Lecture removed.");
      navigate(`/admin/course/${courseId}/lecture`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove lecture.");
    }
  };

  if (lectureLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading lecture...
      </div>
    );
  }

  const busy = uploading || saving;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Uploads and the free/locked switch save automatically. Use
            &ldquo;Update Lecture&rdquo; to save title changes.
          </CardDescription>
        </div>
        <Button
          disabled={removing || uploading}
          onClick={removeHandler}
          variant="destructive"
        >
          {removing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Remove Lecture"
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="lecture-title">Title</Label>
          <Input
            id="lecture-title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>

        {/* Video */}
        <div className="space-y-3">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>

          {video?.videoUrl && !uploading && (
            <div className="max-w-xl aspect-video overflow-hidden rounded-lg bg-black">
              <ReactPlayer
                key={video.videoUrl}
                src={video.videoUrl}
                controls
                width="100%"
                height="100%"
              />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="hidden"
          />

          {uploading ? (
            <div className="max-w-xl space-y-2 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploadProgress < 100 ? "Uploading video..." : "Saving..."}
                </span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
              <Button variant="ghost" size="sm" onClick={cancelUpload}>
                <X className="mr-1 h-4 w-4" /> Cancel upload
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {video?.videoUrl ? "Replace video" : "Upload video"}
            </Button>
          )}
        </div>

        {/* Free preview / locked */}
        <div className="flex items-center justify-between max-w-xl rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            {isFree ? (
              <Unlock className="text-green-600 dark:text-green-400" size={20} />
            ) : (
              <Lock className="text-muted-foreground" size={20} />
            )}
            <div>
              <Label htmlFor="free-preview" className="cursor-pointer">
                Free preview
              </Label>
              <p className="text-xs text-muted-foreground">
                {isFree
                  ? "Anyone can watch this lecture before buying."
                  : "Locked: only students who bought the course can watch."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isFree ? "default" : "secondary"}>
              {isFree ? "Free" : "Locked"}
            </Badge>
            <Switch
              id="free-preview"
              checked={isFree}
              onCheckedChange={toggleFree}
              disabled={saving}
            />
          </div>
        </div>
        {isFree && !video?.videoUrl && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This lecture is free but has no video yet, so students won&apos;t see a preview until you upload one.
          </p>
        )}

        <Button disabled={busy} onClick={updateHandler}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Update Lecture"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
