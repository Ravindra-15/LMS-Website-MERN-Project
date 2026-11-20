import fs from "fs/promises";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "Course title and category is required."
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        });

        return res.status(201).json({
            course,
            message: "Course created."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course."
        })
    }
}

// Escape user text so characters like "+" or "(" are matched literally
// (e.g. searching "c++" must not crash the regex).
const escapeRegex = (text = "") => String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Accepts "a,b,c", ["a","b"] or undefined and returns a clean array.
const toList = (value) =>
    (Array.isArray(value) ? value.join(",") : String(value ?? ""))
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const toNumber = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const num = Number(value);
    return Number.isFinite(num) && num >= 0 ? num : undefined;
};

export const searchCourse = async (req, res) => {
    try {
        const { query = "", price = "", sortByPrice = "" } = req.query;
        const categories = toList(req.query.categories);
        const levels = toList(req.query.levels);
        const minPrice = toNumber(req.query.minPrice);
        const maxPrice = toNumber(req.query.maxPrice);

        const searchCriteria = { isPublished: true };
        const andConditions = [];

        // Free-text search across title, subtitle and category
        const text = escapeRegex(String(query).trim());
        if (text) {
            andConditions.push({
                $or: [
                    { courseTitle: { $regex: text, $options: "i" } },
                    { subTitle: { $regex: text, $options: "i" } },
                    { category: { $regex: text, $options: "i" } },
                ],
            });
        }

        // Categories: exact name, case-insensitive
        if (categories.length > 0) {
            searchCriteria.category = {
                $in: categories.map((c) => new RegExp(`^${escapeRegex(c)}$`, "i")),
            };
        }

        // Course level
        if (levels.length > 0) {
            searchCriteria.courseLevel = {
                $in: levels.map((l) => new RegExp(`^${escapeRegex(l)}$`, "i")),
            };
        }

        // Price: free / paid / range
        if (price === "free") {
            // null also matches courses with no price set
            andConditions.push({ coursePrice: { $in: [0, null] } });
        } else {
            const priceRange = {};
            if (price === "paid") priceRange.$gt = 0;
            if (minPrice !== undefined) priceRange.$gte = minPrice;
            if (maxPrice !== undefined) priceRange.$lte = maxPrice;
            if (Object.keys(priceRange).length > 0) searchCriteria.coursePrice = priceRange;
        }

        if (andConditions.length > 0) searchCriteria.$and = andConditions;

        // Sorting ("sortByPrice" low/high kept for older clients)
        const sortBy =
            req.query.sortBy ||
            (sortByPrice === "low" ? "price-asc" : sortByPrice === "high" ? "price-desc" : "newest");
        const sortMap = {
            newest: { createdAt: -1 },
            "price-asc": { coursePrice: 1, createdAt: -1 },
            "price-desc": { coursePrice: -1, createdAt: -1 },
            title: { courseTitle: 1 },
        };

        const courses = await Course.find(searchCriteria)
            .populate({ path: "creator", select: "name photoUrl" })
            .sort(sortMap[sortBy] || sortMap.newest);

        if (sortBy === "popular") {
            courses.sort(
                (a, b) => (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0)
            );
        }

        return res.status(200).json({
            success: true,
            count: courses.length,
            courses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to search courses.",
        });
    }
}


export const getPublishedCourse = async (_, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({
            path: "creator",
            select: "name photoUrl",
        });

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                message: "No published courses found.",
            });
        }

        res.status(200).json({
            courses,
        });
    } catch (error) {
        console.error("getPublishedCourse error:", error);
        return res.status(500).json({
            message: "Failed to get published courses.",
        });
    }
};


export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                course: [],
                message: "Course not found."
            })
        }
        return res.status(200).json({
            courses,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course."
        })
    }
}

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }
        // Build the update from valid values only, so a missing or empty field
        // never wipes data that is already saved.
        const updateData = {};
        if (typeof courseTitle === "string" && courseTitle.trim()) updateData.courseTitle = courseTitle.trim();
        if (typeof subTitle === "string") updateData.subTitle = subTitle;
        if (typeof description === "string") updateData.description = description;
        if (typeof category === "string" && category.trim()) updateData.category = category.trim();
        if (["Beginner", "Intermediate", "Advanced"].includes(courseLevel)) updateData.courseLevel = courseLevel;
        if (coursePrice !== undefined && coursePrice !== "" && Number(coursePrice) >= 0) {
            updateData.coursePrice = Number(coursePrice);
        }

        if (thumbnail) {
            try {
                // Upload the new image first; only delete the old one if that worked
                const uploaded = await uploadMedia(thumbnail.path);
                if (!uploaded?.secure_url) {
                    return res.status(500).json({ message: "Thumbnail upload failed. Course not changed." });
                }
                if (course.courseThumbnail) {
                    const oldPublicId = course.courseThumbnail.split("/").pop().split(".")[0];
                    deleteMediaFromCloudinary(oldPublicId);
                }
                updateData.courseThumbnail = uploaded.secure_url;
            } finally {
                fs.unlink(thumbnail.path).catch(() => {}); // remove temp file
            }
        }

        course = await Course.findByIdAndUpdate(courseId, { $set: updateData }, { new: true });

        return res.status(200).json({
            course,
            message: "Course updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        // Return data in { course } format
        return res.status(200).json({
            success: true,
            course  // <-- This matches frontend expectation
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get course by id" });
    }
};

export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                message: "Lecture title is required"
            })
        };

        // create lecture
        const lecture = await Lecture.create({ lectureTitle });

        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message: "Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create lecture."
        })
    }
}

export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lectures"
        })
    }
}
export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;

        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            })
        }

        // update lecture — only the fields that were sent, so the client can
        // save just the free/locked switch without touching title or video
        if (typeof lectureTitle === "string" && lectureTitle.trim()) {
            lecture.lectureTitle = lectureTitle.trim();
        }
        if (videoInfo?.videoUrl && videoInfo?.publicId) {
            const oldPublicId = lecture.publicId;
            lecture.videoUrl = videoInfo.videoUrl;
            lecture.publicId = videoInfo.publicId;
            // A new video replaced the old one: remove the old file from Cloudinary
            if (oldPublicId && oldPublicId !== videoInfo.publicId) {
                deleteVideoFromCloudinary(oldPublicId);
            }
        }
        if (isPreviewFree !== undefined) {
            lecture.isPreviewFree = isPreviewFree === true || isPreviewFree === "true";
        }

        await lecture.save();

        // Ensure the course still has the lecture id if it was not aleardy added;
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit lectures"
        })
    }
}

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            { lectures: lectureId }, // find the course that contains the lecture
            { $pull: { lectures: lectureId } } // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message: "Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove lecture"
        })
    }
}

export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture by id"
        })
    }
}

export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            });
        }

        // publish status based on the query parameter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message: `Course is ${statusMessage}`
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture by id"
        })
    }
}



export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId).populate("lectures");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Step 1: Delete associated lecture videos from Cloudinary and DB
        for (const lecture of course.lectures) {
            if (lecture.publicId) {
                await deleteVideoFromCloudinary(lecture.publicId);
            }
            await Lecture.findByIdAndDelete(lecture._id);
        }

        // Step 2: Delete course thumbnail from Cloudinary
        if (course.courseThumbnail) {
            const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
            await deleteMediaFromCloudinary(publicId);
        }

        // Step 3: Delete the course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            message: "Course and its content deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to delete course",
        });
    }
};
